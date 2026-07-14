"use client";

import { ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { menus } from "@/data/menus";
import { cn } from "@/lib/utils/cn";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import {
  checkAccessToken,
  getAuthHeaders,
  ORIGIN,
  TOOLTIP_DELAY_DURATION,
} from "@/lib/constants";
import useSWRImmutable from "swr/immutable";

const fetcher = async (url: string) => {
  const username = JSON.parse(localStorage.getItem("username") ?? '""');
  const authToken = JSON.parse(localStorage.getItem("authToken") ?? '""');

  const isValid = await checkAccessToken(username, authToken);

  if (!isValid) {
    console.error("Session expired. Redirecting to login.");

    throw new Error("Session expired");
  }

  const headers = getAuthHeaders();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    if (res.status === 401) {
      throw new Error("A 401 error occurred while fetching the data.");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();

  const minimumInputLength = 2;
  const commandItemStyle = cn("group flex flex-col items-start");

  const handleClear = () => {
    setInputValue("");
    inputRef.current && inputRef.current.focus();
  };

  const handleSelect = (value: string) => {
    router.push(value);
    setInputValue("");
  };

  let userID = "";
  if (typeof window !== "undefined") {
    userID = JSON.parse(localStorage.getItem("userID") ?? '""');
  }

  const apiUrl = userID
    ? `${ORIGIN}/user/api/user/get-user-access?id=${userID}`
    : `${ORIGIN}/user/api/user/get-user-access`;

  const { data: accessData } = useSWRImmutable(apiUrl, fetcher);

  const allowedRules = new Set(
    accessData ? Object.values(accessData).flat() : []
  );

  return (
    <Command
      className={cn(
        "relative overflow-visible bg-erp-blue-3",
        inputValue.length >= minimumInputLength && "rounded-b-none"
      )}
    >
      <div className="grid grid-cols-[1fr_auto] items-center">
        <CommandInput
          ref={inputRef}
          className="h-8.5"
          placeholder="Search"
          value={inputValue}
          onValueChange={(e) => setInputValue(e)}
        />
        {inputValue.length > 0 && (
          <button
            className="mx-1 flex size-7 items-center justify-center rounded-full text-erp-gray-6 hover:bg-erp-blue-4"
            onClick={handleClear}
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
      {inputValue.length >= minimumInputLength && (
        <div className="absolute top-8.5 z-50 h-min w-full rounded-b-md border-t border-erp-blue-5 bg-erp-blue-3">
          <CommandList className="max-h-[500px] p-1.5">
            <CommandEmpty>No results found.</CommandEmpty>
            {menus.map((menu) =>
              menu.subMenu?.map((item) => {
                if (item.subMenu) {
                  const filteredSubItems = item.subMenu.filter(
                    (subItem) =>
                      !subItem.ruleId || allowedRules.has(subItem.ruleId)
                  );

                  if (filteredSubItems.length === 0) return null;

                  return filteredSubItems.map((subItem) => (
                    <CommandItem
                      className={commandItemStyle}
                      onSelect={() =>
                        typeof subItem.href === "string" &&
                        handleSelect(subItem.href)
                      }
                      value={`${menu.title}-${item.title}-${subItem.title}`}
                      key={`${menu.title}-${item.title}-${subItem.title}`}
                    >
                      <span className="font-medium group-aria-selected:text-erp-blue-14">
                        {subItem.title}
                      </span>
                      <div className="inline-flex items-center gap-x-px text-xs text-secondary-foreground">
                        {menu.title}
                        <ChevronRight className="size-3 text-erp-gray-6" />
                        {item.title}
                      </div>
                    </CommandItem>
                  ));
                }

                if (item.ruleId && !allowedRules.has(item.ruleId)) {
                  return null;
                }

                return (
                  <CommandItem
                    className={commandItemStyle}
                    onSelect={() =>
                      typeof item.href === "string" && handleSelect(item.href)
                    }
                    value={`${menu.title}-${item.title}`}
                    key={`${menu.title}-${item.title}`}
                  >
                    <span className="font-medium group-aria-selected:text-erp-blue-14">
                      {item.title}
                    </span>
                    <span className="text-xs text-secondary-foreground">
                      {menu.title}
                    </span>
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </div>
      )}
    </Command>
  );
}
