import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/veyra/StatusPage";
export const Route = createFileRoute("/payment-failed")({ component: () => <StatusPage code="Payment" title="Payment couldn't be completed" description="Your payment did not go through. You can return to Veyra and try again. If your bank shows a pending charge, check its status before retrying." primaryLabel="Try again" primaryTo="/pricing" secondaryLabel="Billing support" secondaryTo="/support" /> });
