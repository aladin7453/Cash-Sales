"use client";

import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
};

export default function TableHeadDateTimeFilter<TData>({ table }: Props<TData>) {
  const [key, setKey] = useState(+new Date());
  const [selectedDate, setSelectedDate] = useState("");

  const handleChangeDate = (value: Date) => {
    setSelectedDate(moment(value).format("YYYY/MM/DD"));
    table.getColumn("createdAtFormat")?.setFilterValue(moment(value).format("YYYY/MM/DD"));
    table.resetPageIndex(); // reset pagination to the first page
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("flex h-7.5 w-full")} variant="outline" size="sm">
          {selectedDate}
          <CalendarIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          onDayClick={(value) => handleChangeDate(value)}
          initialFocus
          // tileStyle={({ date }) => {
          //   // Define inline styles for the selected date
          //   return moment(date).format("YYYY/MM/DD") === selectedDate
          //     ? { backgroundColor: "black", color: "white" }
          //     : {};
          // }}
        />
        <Separator />
        <Button
          className="h-8 w-full"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDate("");
            table.getColumn("createdAtFormat")?.setFilterValue(undefined);
            table.resetPageIndex(); // reset pagination to the first page
            // setKey(+new Date()); // set the key to a new value to force it to re-render
          }}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}
