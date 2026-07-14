import { fromUnixTime, getUnixTime } from "date-fns";

import { Calendar } from "../ui/calendar";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export default function CalendarPicker<
  TData extends FieldValues,
  TKey extends Path<TData>,
>({
  field,
  onSelect,
  disableFuture = true,
}: {
  field: ControllerRenderProps<TData, TKey>;
  onSelect?: () => void;
  disableFuture?: boolean;
}) {
  return (
    <Calendar
      mode="single"
      required
      selected={field.value ? fromUnixTime(field.value) : undefined}
      onSelect={(date) => {
        date && field.onChange(getUnixTime(date).toString());
        onSelect && onSelect();
      }}
      disabled={(date) =>
        (disableFuture && date > new Date()) || date < new Date("1900-01-01")
      }
      initialFocus
      defaultMonth={field.value ? fromUnixTime(field.value) : undefined}
    />
  );
}
