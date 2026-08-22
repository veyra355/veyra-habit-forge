import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/veyra/StatusPage";
export const Route = createFileRoute("/maintenance")({ component: () => <StatusPage code="Maintenance" title="Veyra is getting better" description="We're temporarily unavailable while maintenance is in progress. Please try again shortly." primaryLabel="Try again" primaryTo="/" secondaryLabel="Get support" secondaryTo="/support" /> });
