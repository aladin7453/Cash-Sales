import { SVGPending } from "@/components/icons/svg-repo/SVGPending";
import { SVGApprove } from "@/components/icons/svg-repo/SVGApprove";
import { SVGReject } from "@/components/icons/svg-repo/SVGReject";
import { SVGNull } from "@/components/icons/svg-repo/SVGNull";

export function ApprovalStatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return <SVGPending />;
    case "approved":
      return <SVGApprove />;
    case "rejected":
      return <SVGReject />;
    case "nil":
      return <SVGNull />;
    default:
      return <SVGNull />;
  }
}
