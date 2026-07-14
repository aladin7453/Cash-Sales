"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

type TabSelectorProps<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
};

export function TabSelector<T extends string>({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}: TabSelectorProps<T>) {
  return (
    <div className={cn("flex space-x-1 rounded-lg bg-erp-blue-2 p-1", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "flex-1 items-center justify-center gap-x-2",
            activeTab === tab.value
              ? "bg-white text-erp-blue-14 shadow-sm"
              : "text-erp-blue-12 hover:bg-erp-blue-4 hover:text-erp-blue-14"
          )}
        >
          <span>{tab.label}</span>
          {typeof tab.count === 'number' && (
            <span className="rounded-full bg-erp-blue-4 px-2 py-1 text-xs font-medium">
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}
