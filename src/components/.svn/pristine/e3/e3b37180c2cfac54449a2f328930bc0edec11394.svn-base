import * as Icons from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type IconOption = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const iconCache: Record<string, IconOption[]> = {};
const promiseCache: Record<string, Promise<IconOption[]> | undefined> = {};

const getAllIcons = (): IconOption[] => {
  return Object.entries(Icons)
    .filter(([_, value]) => {
      return typeof value === "object" && value !== null && "render" in value;
    })
    .map(([name, component]) => ({
      label: name,
      value: name,
      icon: component as unknown as LucideIcon,
    }));
};

export const getFilteredIcons = async (search: string): Promise<IconOption[]> => {
  const keyword = search.toLowerCase();

  if (iconCache[keyword]) {
    return iconCache[keyword];
  }

  if (promiseCache[keyword]) {
    return promiseCache[keyword]!;
  }

  promiseCache[keyword] = (async () => {
    const allIcons = getAllIcons();

    const filtered = !keyword
      ? allIcons
      : allIcons.filter((icon) => icon.label.toLowerCase().includes(keyword));

    iconCache[keyword] = filtered;

    return filtered;
  })();

  const result = await promiseCache[keyword];

  delete promiseCache[keyword];

  return result;
};
