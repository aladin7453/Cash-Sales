import { Suspense } from "react";
import CashSalesClientPage from "./CashSalesClientPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CashSalesClientPage />
    </Suspense>
  );
}