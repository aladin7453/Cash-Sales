"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type DashboardContextType = {
  active: string;
  setActive: (value: string) => void;
  widgetName: string[];
  setWidgetName: (value: string[]) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("");
  const [widgetName, setWidgetName] = useState<string[]>([]);

  return (
    <DashboardContext.Provider value={{ active, setActive, widgetName, setWidgetName }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
