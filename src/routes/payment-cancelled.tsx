import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/veyra/StatusPage";
export const Route = createFileRoute("/payment-cancelled")({ component: () => <StatusPage code="Payment" title="Payment cancelled" description="No new payment was completed. You can return to pricing whenever you're ready." primaryLabel="Back to pricing" primaryTo="/pricing" secondaryLabel="Get support" secondaryTo="/support" /> });
