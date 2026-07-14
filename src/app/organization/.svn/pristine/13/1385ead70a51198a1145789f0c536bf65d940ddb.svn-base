import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

// Base types
export interface ChangelogItem {
  UUID?: string;
  action: string;
  createdAtFormat: string;
  createdByUsername: string;
  _version?: string;
  _actionUUID?: string;
  historyUUID: string;
  [key: string]: any; // Allow for entity-specific fields
}

export interface ChangelogDetail {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface ChangelogTabItem {
  value: string;
  label: string;
  count?: number;
  // Add tab-specific API endpoints
  getHistoryUrl?: (id: string) => string;
  getDetailsUrl?: (id: string, action: string) => string;
  // Add optional reference field for tab-specific reference column
  referenceField?: string;
}

export interface ChangelogConfig {
  // Default API endpoints (fallback)
  getHistoryUrl: (id: string) => string;
  getDetailsUrl: (id: string, action: string) => string;
  
  // Field name mapping for displaying in details
  fieldNameMapping: Record<string, string>;
  
  // Fields to filter out from details
  fieldsToFilter?: string[];
  
  // Entity name for local storage keys
  entityName: string;
  
  // Default sorting field
  defaultSortField?: string;
  
  // Tab configuration
  tabs: ChangelogTabItem[];
  
  // Local storage key prefix
  storageKeyPrefix?: string;

  // Field value transformers for custom transformations
  valueTransformers?: Record<string, (value: any) => any>;
  
  // Add flag to control where transformers are applied
  applyTransformersToTableData?: boolean;
}

export interface ChangelogTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  initialData?: any | null;
  config: ChangelogConfig;
  entityId: string;
  onTableParamsChange?: (
    filters: ColumnFiltersState,
    pagination: PaginationState,
    sorting: SortingState
  ) => void;
}

/**
 * Utility function to transform getChild value.
 * Converts 1 to True and 0 to False with capitalized first letter.
 */
export function transformGetChildValue(value: string | null): string | null {
  if (value === "1") return "True";
  if (value === "0") return "False";
  return null;
}

// Add better typing for API responses
export interface ChangelogApiResponse {
  rows: ChangelogItem[];
  total: string | number;
  [key: string]: any; // For tab-specific data
}

export interface TabDataState {
  [tabKey: string]: ChangelogItem[];
}

export interface TabCountState {
  [tabKey: string]: number;
}
