import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitManuscript } from "../hooks/useQueries";
import { JOURNAL_CATEGORIES } from "../lib/constants";

const STEPS = ["Paper Details", "Author Information", "Upload & Submit"];

export default function SubmitManuscriptPage() {
  const { identity, login } = useInternetIdentity();
  const { mutateAsync: submitManuscript, isPending } = useSubmitManuscript();

  const [step, setStep] = useState(0);
  const [paperId, setPaperId] = useState<bigint | null>(null);

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-[#E9EFF4] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Upload className="w-8 h-8 text-[#0B2C45]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] mb-3">
          Sign In to Submit
        </h2>
        <p className="text-[#6B7280] mb-6">
          You need to sign in with Internet Identity to submit a manuscript.
        </p>
        <Button
          onClick={login}
          className="bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90"
        >
          Sign In / Register
        </Button>
      </div>
    );
  }

  if (paperId !== null) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#111827] mb-3">
          Submission Successful!
        </h2>
        <p className="text-[#6B7280] mb-2">
          Your manuscript has been submitted for review.
        </p>
        <div className="bg-[#E9EFF4] border border-[#0B2C45]/20 rounded-xl p-4 my-6">
          <p className="text-sm text-[#6B7280] mb-1">Your Paper ID</p>
          <p className="text-2xl font-bold text-[#0B2C45]">
            #{paperId.toString()}
          </p>
          <p className="text-xs text-[#6B7280] mt-2">
            Save this ID to track your paper status
          </p>
        </div>
        <Button
          onClick={() => {
            setStep(0);
            setPaperId(null);
            setTitle("");
            setAbstract("");
            setKeywords("");
            setCategory("");
            setAuthorName("");
            setInstitution("");
            setEmail("");
            setCoAuthors("");
            setFile(null);
            setAgreed(false);
          }}
          variant="outline"
          className="border-[#0B2C45] text-[#0B2C45]"
        >
          Submit Another Manuscript
        </Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError("");
    if (!file) {
      setError("Please upload your manuscript file.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the copyright terms.");
      return;
    }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const authors = [
        authorName,
        ...coAuthors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ];
      const id = await submitManuscript({
        title,
        abstract,
        authors,
        category,
        contactEmail: email,
        pdf: blob,
      });
      setPaperId(id);
    } catch {
      setError("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#111827] mb-2">
        Submit Manuscript
      </h1>
      <p className="text-[#6B7280] mb-8">
        Submit your research for peer review. All fields are required.
      </p>

      {/* Progress */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-[#0B2C45] text-white"
                      : "bg-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  i === step ? "text-[#111827]" : "text-[#9CA3AF]"
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-[#9CA3AF] mx-2 flex-1" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#111827] mb-6">
              Step 1: Paper Details
            </h2>
            <div>
              <Label className="mb-1.5">Paper Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter full paper title"
              />
            </div>
            <div>
              <Label className="mb-1.5">Abstract *</Label>
              <Textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Provide a 150–300 word abstract"
                rows={5}
              />
            </div>
            <div>
              <Label className="mb-1.5">Keywords</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. machine learning, climate, health"
              />
            </div>
            <div>
              <Label className="mb-1.5">Category / Subject Area *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {JOURNAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => {
                  if (!title || !abstract || !category) {
                    setError("Please fill all required fields.");
                    return;
                  }
                  setError("");
                  setStep(1);
                }}
                className="bg-[#0B2C45] text-white"
              >
                Next: Author Information
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#111827] mb-6">
              Step 2: Author Information
            </h2>
            <div>
              <Label className="mb-1.5">Lead Author Name *</Label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div>
              <Label className="mb-1.5">Institution / Affiliation *</Label>
              <Input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="University of..."
              />
            </div>
            <div>
              <Label className="mb-1.5">Contact Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@university.edu"
              />
            </div>
            <div>
              <Label className="mb-1.5">Co-Authors (comma separated)</Label>
              <Input
                value={coAuthors}
                onChange={(e) => setCoAuthors(e.target.value)}
                placeholder="Prof. A. Smith, Dr. B. Jones"
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  if (!authorName || !email) {
                    setError("Please fill all required fields.");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="bg-[#0B2C45] text-white"
              >
                Next: Upload File
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#111827] mb-6">
              Step 3: Upload & Submit
            </h2>
            <div>
              <Label className="mb-1.5">Manuscript File (PDF or DOCX) *</Label>
              <button
                type="button"
                className="w-full border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center cursor-pointer hover:border-[#0B2C45]/40 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                {file ? (
                  <p className="text-[#0B2C45] font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-[#6B7280] text-sm">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[#9CA3AF] text-xs mt-1">
                      PDF or DOCX, max 20MB
                    </p>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(!!v)}
                className="mt-0.5"
              />
              <label
                htmlFor="agree"
                className="text-sm text-[#6B7280] cursor-pointer"
              >
                I confirm this work is original, has not been published
                elsewhere, and I agree to RKNO WEB's copyright and publication
                terms.
              </label>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#0B2C45] text-white"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isPending ? "Submitting..." : "Submit Manuscript"}
              </Button>
            </div>
          </div>
        )}

        {error && step < 2 && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
