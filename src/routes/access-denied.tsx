import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/veyra/StatusPage";
export const Route = createFileRoute("/access-denied")({ component: () => <StatusPage code="403" title="Access denied" description="You don't have permission to view this area. Sign in with the correct account or return to a safe page." primaryLabel="Sign in" primaryTo="/auth" secondaryLabel="Get support" secondaryTo="/support" /> });
