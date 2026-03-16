import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TestResult, TestType } from "../backend";
import { useAttachLabResult } from "../hooks/useQueries";
import { TEST_RESULT_LABELS, TEST_TYPE_LABELS } from "../lib/constants";

interface LabResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: bigint;
}

export default function LabResultModal({
  open,
  onOpenChange,
  reportId,
}: LabResultModalProps) {
  const [testType, setTestType] = useState<TestType | "">("");
  const [result, setResult] = useState<TestResult | "">("");
  const [collectionDate, setCollectionDate] = useState("");
  const [labName, setLabName] = useState("");

  const { mutateAsync, isPending } = useAttachLabResult();

  const handleSubmit = async () => {
    if (!testType || !result || !collectionDate || !labName) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await mutateAsync({
        reportId,
        labResult: {
          testType: testType as TestType,
          result: result as TestResult,
          collectionDate,
          labName,
        },
      });
      toast.success("Lab result attached successfully");
      onOpenChange(false);
      setTestType("");
      setResult("");
      setCollectionDate("");
      setLabName("");
    } catch {
      toast.error("Failed to attach lab result");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="lab_modal.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Attach Lab Result</DialogTitle>
          <DialogDescription>
            Add laboratory confirmation data to case report #
            {reportId.toString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Type</Label>
            <Select
              value={testType}
              onValueChange={(v) => setTestType(v as TestType)}
            >
              <SelectTrigger data-ocid="lab_modal.test_type_select">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TestType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TEST_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Result</Label>
            <Select
              value={result}
              onValueChange={(v) => setResult(v as TestResult)}
            >
              <SelectTrigger data-ocid="lab_modal.result_select">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TestResult).map((r) => (
                  <SelectItem key={r} value={r}>
                    {TEST_RESULT_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Collection Date</Label>
            <Input
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label>Laboratory Name</Label>
            <Input
              placeholder="e.g. NCDC Reference Lab, Abuja"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="lab_modal.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            data-ocid="lab_modal.submit_button"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Attach Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
