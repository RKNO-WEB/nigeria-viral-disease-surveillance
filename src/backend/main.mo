import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Disease = {
    #lassaFever;
    #ebola;
    #mpox;
    #cholera;
    #meningitis;
    #yellowFever;
    #covid19;
    #marburg;
  };

  public type CaseStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type CaseClassification = {
    #suspected;
    #probable;
    #confirmed;
  };

  public type ClinicalOutcome = {
    #alive;
    #dead;
    #unknown;
  };

  public type TestType = {
    #pcr;
    #rdt;
    #elisa;
    #culture;
  };

  public type TestResult = {
    #positive;
    #negative;
    #indeterminate;
  };

  public type AlertLevel = {
    #watch;
    #warning;
    #emergency;
  };

  public type PatientDemographics = {
    age : Nat;
    sex : Text;
    lga : Text;
    state : Text;
  };

  public type LabResult = {
    testType : TestType;
    result : TestResult;
    collectionDate : Text;
    labName : Text;
  };

  public type CaseReport = {
    id : Nat;
    reporter : Principal;
    demographics : PatientDemographics;
    disease : Disease;
    classification : CaseClassification;
    symptomsDate : Text;
    exposureHistory : Text;
    outcome : ClinicalOutcome;
    status : CaseStatus;
    timestamp : Time.Time;
    labResult : ?LabResult;
  };

  public type OutbreakAlert = {
    disease : Disease;
    state : Text;
    caseCount : Nat;
    weekStart : Time.Time;
    alertLevel : AlertLevel;
  };

  public type AnalyticsSummary = {
    casesByDisease : [(Disease, Nat)];
    casesByState : [(Text, Nat)];
    casesBySex : [(Text, Nat)];
    casesByAgeGroup : [(Text, Nat)];
    casesByOutcome : [(ClinicalOutcome, Nat)];
    weeklyCounts : [(Text, Nat)];
  };

  public type UserProfile = {
    name : Text;
    role : Text;
    organization : Text;
  };

  let reports = Map.empty<Nat, CaseReport>();
  let alerts = Map.empty<Text, OutbreakAlert>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextReportId = 1;

  module CaseReport {
    public func compare(a : CaseReport, b : CaseReport) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  func diseaseToText(disease : Disease) : Text {
    switch (disease) {
      case (#lassaFever) { "lassaFever" };
      case (#ebola) { "ebola" };
      case (#mpox) { "mpox" };
      case (#cholera) { "cholera" };
      case (#meningitis) { "meningitis" };
      case (#yellowFever) { "yellowFever" };
      case (#covid19) { "covid19" };
      case (#marburg) { "marburg" };
    };
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

  public shared ({ caller }) func submitCaseReport(demographics : PatientDemographics, disease : Disease, classification : CaseClassification, symptomsDate : Text, exposureHistory : Text, outcome : ClinicalOutcome) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit reports");
    };

    let newReport : CaseReport = {
      id = nextReportId;
      reporter = caller;
      demographics;
      disease;
      classification;
      symptomsDate;
      exposureHistory;
      outcome;
      status = #pending;
      timestamp = Time.now();
      labResult = null;
    };

    reports.add(nextReportId, newReport);
    nextReportId += 1;

    updateOutbreakAlerts(disease, demographics.state);

    newReport.id;
  };

  public shared ({ caller }) func updateCaseReport(id : Nat, demographics : PatientDemographics, disease : Disease, classification : CaseClassification, symptomsDate : Text, exposureHistory : Text, outcome : ClinicalOutcome) : async () {
    let report = switch (reports.get(id)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) { r };
    };

    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    let isOwner = report.reporter == caller;

    if (not isAdmin and not isOwner) {
      Runtime.trap("Unauthorized: Can only update your own reports");
    };

    if (not isAdmin and isOwner and report.status != #pending) {
      Runtime.trap("Unauthorized: Reporters can only update pending reports");
    };

    let updatedReport : CaseReport = {
      id;
      reporter = report.reporter;
      demographics;
      disease;
      classification;
      symptomsDate;
      exposureHistory;
      outcome;
      status = report.status;
      timestamp = report.timestamp;
      labResult = report.labResult;
    };

    reports.add(id, updatedReport);
  };

  public shared ({ caller }) func attachLabResult(reportId : Nat, labResult : LabResult) : async () {
    let report = switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) { r };
    };

    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    let isOwner = report.reporter == caller;

    if (not isAdmin and not isOwner) {
      Runtime.trap("Unauthorized: Can only attach lab results to your own reports");
    };

    let updatedReport : CaseReport = {
      id = report.id;
      reporter = report.reporter;
      demographics = report.demographics;
      disease = report.disease;
      classification = report.classification;
      symptomsDate = report.symptomsDate;
      exposureHistory = report.exposureHistory;
      outcome = report.outcome;
      status = report.status;
      timestamp = report.timestamp;
      labResult = ?labResult;
    };

    reports.add(reportId, updatedReport);
  };

  public query ({ caller }) func getCaseReports(filterDisease : ?Disease, filterState : ?Text) : async [CaseReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reports");
    };

    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);

    let filtered = reports.values().toArray().filter(
      func(report) {
        if (not isAdmin and report.reporter != caller) {
          return false;
        };

        switch (filterDisease, filterState) {
          case (null, null) { true };
          case (?d, null) { report.disease == d };
          case (null, ?s) { report.demographics.state == s };
          case (?d, ?s) { report.disease == d and report.demographics.state == s };
        };
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getCaseById(id : Nat) : async CaseReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reports");
    };

    switch (reports.get(id)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        if (report.reporter != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
        report;
      };
    };
  };

  public query ({ caller }) func getOutbreakAlerts() : async [OutbreakAlert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view outbreak alerts");
    };
    alerts.values().toArray();
  };

  public query ({ caller }) func getAnalyticsSummary() : async AnalyticsSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view analytics");
    };

    let allReports = reports.values().toArray();

    let diseaseList = List.empty<(Disease, Nat)>();
    let stateMap = Map.empty<Text, Nat>();
    let sexMap = Map.empty<Text, Nat>();
    let ageGroupMap = Map.empty<Text, Nat>();
    let outcomeList = List.empty<(ClinicalOutcome, Nat)>();

    for (report in allReports.vals()) {
      // Update disease count
      var foundDisease = false;
      let updatedDiseaseList = diseaseList.map<(Disease, Nat), (Disease, Nat)>(
        func((disease, count)) {
          if (disease == report.disease) {
            foundDisease := true;
            (disease, count + 1);
          } else {
            (disease, count);
          };
        }
      );
      diseaseList.clear();
      diseaseList.addAll(updatedDiseaseList.values());

      if (not foundDisease) {
        diseaseList.add((report.disease, 1));
      };

      stateMap.add(report.demographics.state, switch (stateMap.get(report.demographics.state)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      });

      sexMap.add(report.demographics.sex, switch (sexMap.get(report.demographics.sex)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      });

      let ageGroup = if (report.demographics.age <= 17) {
        "0-17";
      } else if (report.demographics.age <= 35) {
        "18-35";
      } else if (report.demographics.age <= 60) {
        "36-60";
      } else {
        "60+";
      };

      ageGroupMap.add(ageGroup, switch (ageGroupMap.get(ageGroup)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      });

      // Update outcome count
      var foundOutcome = false;
      let updatedOutcomeList = outcomeList.map<(ClinicalOutcome, Nat), (ClinicalOutcome, Nat)>(
        func((outcome, count)) {
          if (outcome == report.outcome) {
            foundOutcome := true;
            (outcome, count + 1);
          } else {
            (outcome, count);
          };
        }
      );
      outcomeList.clear();
      outcomeList.addAll(updatedOutcomeList.values());

      if (not foundOutcome) {
        outcomeList.add((report.outcome, 1));
      };
    };

    let weeklyCounts : [(Text, Nat)] = [];

    {
      casesByDisease = diseaseList.toArray();
      casesByState = stateMap.entries().toArray();
      casesBySex = sexMap.entries().toArray();
      casesByAgeGroup = ageGroupMap.entries().toArray();
      casesByOutcome = outcomeList.toArray();
      weeklyCounts;
    };
  };

  public shared ({ caller }) func approveReport(reportId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve reports");
    };

    let report = switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) { r };
    };

    let updatedReport : CaseReport = {
      id = report.id;
      reporter = report.reporter;
      demographics = report.demographics;
      disease = report.disease;
      classification = report.classification;
      symptomsDate = report.symptomsDate;
      exposureHistory = report.exposureHistory;
      outcome = report.outcome;
      status = #approved;
      timestamp = report.timestamp;
      labResult = report.labResult;
    };

    reports.add(reportId, updatedReport);
  };

  public shared ({ caller }) func rejectReport(reportId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reject reports");
    };

    let report = switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) { r };
    };

    let updatedReport : CaseReport = {
      id = report.id;
      reporter = report.reporter;
      demographics = report.demographics;
      disease = report.disease;
      classification = report.classification;
      symptomsDate = report.symptomsDate;
      exposureHistory = report.exposureHistory;
      outcome = report.outcome;
      status = #rejected;
      timestamp = report.timestamp;
      labResult = report.labResult;
    };

    reports.add(reportId, updatedReport);
  };

  func updateOutbreakAlerts(disease : Disease, state : Text) {
    let sevenDaysAgo = Time.now() - (7 * 24 * 60 * 60 * 1_000_000_000);

    let stateReports = reports.values().toArray().filter(
      func(report) {
        report.disease == disease and
        report.demographics.state == state and
        report.timestamp >= sevenDaysAgo and
        (report.status == #approved or report.status == #pending)
      }
    );

    let count = stateReports.size();

    if (count < 3) {
      return;
    };

    let alertLevel = if (count >= 10) {
      #emergency;
    } else if (count >= 5) {
      #warning;
    } else {
      #watch;
    };

    let newAlert : OutbreakAlert = {
      disease;
      state;
      caseCount = count;
      weekStart = sevenDaysAgo;
      alertLevel;
    };

    alerts.add(state # "_" # diseaseToText(disease), newAlert);
  };
};
