import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useSaveProfile,
  useUserProfile,
  useUserRole,
} from "../hooks/useQueries";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.admin]: "NCDC Administrator",
  [UserRole.user]: "Health Worker / Supervisor",
  [UserRole.guest]: "Guest (Unauthenticated)",
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  [UserRole.admin]: "bg-primary text-primary-foreground",
  [UserRole.user]: "bg-secondary text-secondary-foreground",
  [UserRole.guest]: "bg-muted text-muted-foreground",
};

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: role, isLoading: roleLoading } = useUserRole();
  const { identity } = useInternetIdentity();
  const { mutateAsync: save, isPending } = useSaveProfile();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setOrganization(profile.organization);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!organization.trim()) {
      toast.error("Please enter your organization");
      return;
    }
    try {
      await save({
        name: name.trim(),
        organization: organization.trim(),
        role: role ?? "user",
      });
      toast.success("Profile saved successfully");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const isLoading = profileLoading || roleLoading;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your identity and view your access level
        </p>
      </div>

      {!isLoading && !profile && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <ShieldCheck className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">
              Complete your profile
            </p>
            <p className="text-yellow-700 mt-0.5">
              Your profile is not yet set up. Please fill in your details to
              enable full access to reporting features.
            </p>
          </div>
        </div>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Identity & Role
          </CardTitle>
          <CardDescription>
            Your Internet Identity and system-assigned access level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Principal ID</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded max-w-[220px] truncate">
                  {identity?.getPrincipal().toString() ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Access Role</span>
                {role ? (
                  <Badge className={ROLE_BADGE_CLASSES[role]}>
                    {ROLE_LABELS[role]}
                  </Badge>
                ) : (
                  <Badge variant="outline">Unknown</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Profile Details
          </CardTitle>
          <CardDescription>
            Your name and organization as displayed in reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="prof-name">Full Name</Label>
                <Input
                  id="prof-name"
                  placeholder="e.g. Dr. Amaka Okoye"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="profile.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prof-org">Organization / Facility</Label>
                <Input
                  id="prof-org"
                  placeholder="e.g. Lagos University Teaching Hospital"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  data-ocid="profile.input"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="w-full"
                data-ocid="profile.save_button"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
