"use client";

import React, { useEffect, useState } from "react";

import MainLayout from "@/components/layouts/MainLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDashboardLayout, setIsDashboardLayout] = useState(true);

  return (
    <MainLayout isDashboardLayout={isDashboardLayout} setIsDashboardLayout={setIsDashboardLayout}>
      {isDashboardLayout ? children : null}
    </MainLayout>
  );
}
