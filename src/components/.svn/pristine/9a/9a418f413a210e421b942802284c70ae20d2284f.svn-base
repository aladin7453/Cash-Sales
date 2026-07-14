"use client";

import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";
import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import Export from "@/components/data-table/Export";
import { TabSelector, TabItem } from "@/components/TabSelector";
import { type Table } from "@tanstack/react-table";
import { ChangelogTabItem } from "./types";

type Props<TData> = {
  table: Table<TData>;
  refreshData: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: ChangelogTabItem[];
  title?: string;
};

export default function ChangelogDataTableToolbar<TData>({
  table,
  refreshData,
  activeTab,
  onTabChange,
  tabs,
  title = "Changelog",
}: Props<TData>) {
  return (
    <div className="flex flex-col p-1.5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left section - Title */}
        <div className="flex items-center gap-x-1 pl-2">
          <div className="text-base font-semibold">
            {title}
          </div>
        </div>

        {/* Middle section - Pagination */}
        <Pagination table={table} />

        {/* Right section - Additional controls */}
        <div className="flex items-center gap-x-1 pr-2 text-erp-blue-14">
          {/* <Export table={table} /> */}
          <Refresh refreshTable={refreshData} />
          <ColumnVisibilityToggle table={table} />
        </div>
      </div>
      
      {/* Tab selector */}
      {tabs.length > 0 && (
        <div className="mb-2">
          <TabSelector 
            tabs={tabs}
            activeTab={activeTab} 
            onTabChange={onTabChange}
          />
        </div>
      )}
    </div>
  );
}
