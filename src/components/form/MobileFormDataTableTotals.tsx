"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface TotalField {
  key: string;
  label: string;
  value: string | number;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  className?: string;
}

interface TotalSection {
  fields: TotalField[];
  className?: string;
}

interface MobileFormDataTableTotalsProps {
  title: string;
  sections: TotalSection[];
  className?: string;
}

export default function MobileFormDataTableTotals({
  title,
  sections,
  className,
}: MobileFormDataTableTotalsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // Mobile View (Totals Section) - Only mobile implementation
    <div className={cn("block p-2 md:hidden", className)}>
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="rounded-t-lg bg-erp-blue-14 px-3 py-2 font-semibold text-white">
          {title}
        </div>

        {/* First Section - Always Visible */}
        {sections.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-2 gap-3 p-3",
              sections.length > 1 ? "border-b-2 border-solid border-erp-blue-18" : "",
              sections[0].className
            )}
          >
            {sections[0].fields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  {field.label}:
                </span>
                <Input
                  className={cn("h-8 text-right text-sm", field.className)}
                  readOnly={field.readOnly}
                  value={field.value}
                  onChange={field.onChange}
                  dir={field.dir}
                  disabled={field.disabled}
                />
              </div>
            ))}
          </div>
        )}

        {/* Additional Sections - Show when expanded */}
        {isExpanded && sections.slice(1).map((section, sectionIndex) => (
          <div
            key={sectionIndex + 1}
            className={cn(
              "grid grid-cols-2 gap-3 p-3 border-t-0 border-solid border-erp-blue-18",
              section.className
            )}
          >
            {section.fields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  {field.label}:
                </span>
                <Input
                  className={cn("h-8 text-right text-sm", field.className)}
                  readOnly={field.readOnly}
                  value={field.value}
                  onChange={field.onChange}
                  dir={field.dir}
                  disabled={field.disabled}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Show More/Less Button - Only show if there are multiple sections */}
        {sections.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full border-t border-gray-200 py-2 text-center text-sm font-medium text-erp-blue-14 hover:bg-gray-50 hover:underline"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
