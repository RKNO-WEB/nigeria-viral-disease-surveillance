import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type ArticleStatus = { #published; #underReview; #rejected };

  public type JournalArticle = {
    id : Nat;
    title : Text;
    abstract : Text;
    authors : [Text];
    journalName : Text;
    category : Text;
    publicationDate : ?Time.Time;
    status : ArticleStatus;
    pdf : Storage.ExternalBlob;
    featured : Bool;
  };

  public type ManuscriptSubmission = {
    id : Nat;
    title : Text;
    abstract : Text;
    authors : [Text];
    category : Text;
    contactEmail : Text;
    manuscriptFile : Storage.ExternalBlob;
    status : ArticleStatus;
  };

  public type ReviewerApplication = {
    name : Text;
    email : Text;
    institution : Text;
    qualifications : Text;
    expertise : [Text];
  };

  public type UserProfile = {
    name : Text;
    role : Text;
    organization : Text;
  };

  let articles = Map.empty<Nat, JournalArticle>();
  let submissions = Map.empty<Nat, ManuscriptSubmission>();
  let reviewers = Map.empty<Text, ReviewerApplication>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextArticleId = 1;
  var nextSubmissionId = 1;
  var nextReviewerId = 1;

  func getNextArticleId() : Nat {
    let id = nextArticleId;
    nextArticleId += 1;
    id;
  };

  func getNextSubmissionId() : Nat {
    let id = nextSubmissionId;
    nextSubmissionId += 1;
    id;
  };

  func getNextReviewerId() : Nat {
    let id = nextReviewerId;
    nextReviewerId += 1;
    id;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitManuscript(
    title : Text,
    abstract : Text,
    authors : [Text],
    category : Text,
    contactEmail : Text,
    pdf : Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit manuscripts");
    };

    let submission : ManuscriptSubmission = {
      id = getNextSubmissionId();
      title;
      abstract;
      authors;
      category;
      contactEmail;
      manuscriptFile = pdf;
      status = #underReview;
    };

    submissions.add(submission.id, submission);
    submission.id;
  };

  public shared ({ caller }) func registerReviewer(
    name : Text,
    email : Text,
    institution : Text,
    qualifications : Text,
    expertise : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as reviewers");
    };

    let application : ReviewerApplication = {
      name;
      email;
      institution;
      qualifications;
      expertise;
    };

    reviewers.add(email, application);
  };

  public shared ({ caller }) func updatePaperStatus(paperId : Nat, status : ArticleStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update paper status");
    };

    let submission = switch (submissions.get(paperId)) {
      case (null) { Runtime.trap("Manuscript not found") };
      case (?manuscript) { manuscript };
    };

    let updatedSubmission : ManuscriptSubmission = {
      submission with status;
    };

    submissions.add(paperId, updatedSubmission);
  };

  public shared ({ caller }) func publishArticle(
    submissionId : Nat,
    journalName : Text,
    publicationDate : Time.Time,
    featured : Bool,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can publish articles");
    };

    let submission = switch (submissions.get(submissionId)) {
      case (null) { Runtime.trap("Manuscript not found") };
      case (?manuscript) { manuscript };
    };

    let article : JournalArticle = {
      id = getNextArticleId();
      title = submission.title;
      abstract = submission.abstract;
      authors = submission.authors;
      journalName;
      category = submission.category;
      publicationDate = ?publicationDate;
      status = #published;
      pdf = submission.manuscriptFile;
      featured;
    };

    articles.add(article.id, article);
    article.id;
  };

  public shared ({ caller }) func setFeatured(articleId : Nat, featured : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set featured status");
    };

    let article = switch (articles.get(articleId)) {
      case (null) { Runtime.trap("Article not found") };
      case (?art) { art };
    };

    let updatedArticle : JournalArticle = {
      article with featured;
    };

    articles.add(articleId, updatedArticle);
  };

  public query ({ caller }) func getArticles() : async [JournalArticle] {
    articles.values().toArray();
  };

  public query ({ caller }) func getArticleById(id : Nat) : async ?JournalArticle {
    articles.get(id);
  };

  public query ({ caller }) func getPaperStatus(paperId : Nat) : async ?ArticleStatus {
    switch (submissions.get(paperId)) {
      case (null) { null };
      case (?submission) { ?submission.status };
    };
  };

  public query ({ caller }) func getFeaturedArticles() : async [JournalArticle] {
    articles.values().toArray().filter(func(a) { a.featured and a.status == #published });
  };

  public query ({ caller }) func getLatestArticles(limit : Nat) : async [JournalArticle] {
    let publishedArticlesList = List.fromArray<JournalArticle>(
      articles.values().toArray().filter(func(a) { a.status == #published })
    );

    let sortedArray = publishedArticlesList.toArray().sort(
      func(a, b) {
        switch (a.publicationDate, b.publicationDate) {
          case (?aDate, ?bDate) {
            if (aDate > bDate) { return #greater } else if (aDate < bDate) { return #less } else {
              return #equal;
            };
          };
          case (?_, null) { return #greater };
          case (null, ?_) { return #less };
          case (null, null) { return #equal };
        };
      }
    );

    sortedArray.sliceToArray(0, Nat.min(limit, sortedArray.size()));
  };

  public query ({ caller }) func getSubmissions() : async [ManuscriptSubmission] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view submissions");
    };
    submissions.values().toArray();
  };

  public query ({ caller }) func getReviewerApplications() : async [ReviewerApplication] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view reviewer applications");
    };
    reviewers.values().toArray();
  };
};
