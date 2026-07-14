import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/components/ui/use-toast";
import { ORIGIN, getAuthHeaders } from "@/lib/constants";
import { getColumnLength } from "./columnLengthService";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  charLimit?: number;
  moduleName?: string;
  fieldName?: string;
  columnName?: string;
}

const cache: Record<string, Record<string, number>> = {};
const promiseCache: Record<string, Promise<void> | undefined> = {};
const headers = getAuthHeaders();

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      charLimit = 85,
      moduleName,
      fieldName,
      columnName,
      ...props
    },
    ref
  ) => {
    const isDev = process.env.NODE_ENV === "development";
    const [maxLength, setMaxLength] = React.useState<number | undefined>(
      charLimit
    );

    React.useEffect(() => {
      if (!moduleName || !fieldName) return;

      getColumnLength(moduleName, headers).then((data) => {
        const length = data[fieldName];
        if (length === "text") {
          setMaxLength(undefined); // no limit
        } else {
          setMaxLength(length ?? charLimit);
        }
      });
    }, [moduleName, fieldName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength && e.target.value.length > maxLength) {
        const errorMessage =
          !moduleName || !fieldName
            ? `Exceeded the maximum length of ${maxLength} characters. Please shorten it and try again.`
            : `The "${columnName}" exceeds the maximum length of ${maxLength} characters. Please shorten it and try again.`;

        toast({
          title: "Truncation Error",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });

        e.target.value = e.target.value.substring(0, maxLength);
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-erp-gray-1 disabled:border-gray-200",
          className
        )}
        ref={ref}
        {...props}
        onChange={handleChange}
        value={props.value ?? ""}
      />
    );
  }
);

Input.displayName = "Input";

// New NumberInputField component
export interface NumberInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  form: any;
  fieldName: string;
  allowDecimal?: boolean;
  decimalPlaces?: number;
  charLimit?: number;
}

export const NumberInputField = React.forwardRef<
  HTMLInputElement,
  NumberInputFieldProps
>(
  (
    {
      className,
      form,
      fieldName,
      allowDecimal = true,
      decimalPlaces = 2,
      charLimit = 10,
      constUpdate,
      ...props
    },
    ref
  ) => {
    // Get the current value from the form
    const currentValue = form.getValues(fieldName);
    const [isFocused, setIsFocused] = React.useState(false);

    const formatNumberOnBlur = (value: string) => {
      // If empty, don't format
      if (!value || value.trim() === "") {
        return "";
      }

      // Remove any non-numeric characters except period
      let cleanedValue = value.replace(/[^\d.]/g, "");

      // Ensure there's only one decimal point
      const parts = cleanedValue.split(".");
      if (parts.length > 2) {
        cleanedValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Parse to float and format
      const parsedValue = parseFloat(cleanedValue);

      // Check if it's a valid number
      if (isNaN(parsedValue)) {
        return "";
      }

      // Return formatted number with specified decimal places
      return allowDecimal
        ? parsedValue.toFixed(decimalPlaces)
        : Math.floor(parsedValue).toString();
    };

    // Format value whenever it changes, but only if not focused
    React.useEffect(() => {
      if (
        constUpdate &&
        !isFocused &&
        currentValue &&
        currentValue.toString().trim() !== ""
      ) {
        const formattedValue = formatNumberOnBlur(currentValue.toString());
        if (formattedValue !== currentValue.toString()) {
          form.setValue(fieldName, formattedValue);
        }
      }
    }, [
      currentValue,
      decimalPlaces,
      allowDecimal,
      fieldName,
      form,
      constUpdate,
      isFocused,
    ]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      const value = input.value;

      // Allow empty input
      if (value === "") {
        return;
      }

      // Create regex pattern based on allowDecimal setting
      const pattern = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;

      // If value doesn't match pattern, prevent the input
      if (!pattern.test(value)) {
        e.preventDefault();
        // Restore previous valid value
        const currentFormValue = form.getValues(fieldName);
        input.value = currentFormValue || "";
        return;
      }

      // If decimal is allowed, ensure only one decimal point
      if (allowDecimal && (value.match(/\./g) || []).length > 1) {
        e.preventDefault();
        const currentFormValue = form.getValues(fieldName);
        input.value = currentFormValue || "";
        return;
      }

      //Added
      if (allowDecimal && value.includes(".")) {
        const decimalPart = value.split(".")[1];
        if (decimalPart && decimalPart.length > decimalPlaces) {
          e.preventDefault();
          input.value = props.value?.toString() || "";
          return;
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (charLimit && value.length > charLimit) {
        toast({
          title: "Character Limit Reached",
          description: `Maximum ${charLimit} characters allowed.`,
          variant: "destructive",
          duration: 3000,
        });
        e.target.value = value.substring(0, charLimit);
      }

      // Only allow valid numeric input
      const pattern = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
      if (value === "" || pattern.test(value)) {
        form.setValue(fieldName, e.target.value);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Format only on blur
      const formattedValue = formatNumberOnBlur(e.target.value);
      form.setValue(fieldName, formattedValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const inputElement = e.target as HTMLInputElement;
      inputElement.setSelectionRange(
        inputElement.value.length,
        inputElement.value.length
      );
    };

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-erp-gray-1 disabled:border-gray-200",
          className
        )}
        ref={ref}
        onClick={handleClick}
        onInput={handleInput}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={currentValue || ""}
        {...props}
      />
    );
  }
);

NumberInputField.displayName = "NumberInputField";

// New NumberInputCell component for tables
export interface NumberInputCellProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: string) => void;
  allowDecimal?: boolean;
  decimalPlaces?: number;
  onBlurCallback?: (value: string) => void;
  charLimit?: number;
}

export const NumberInputCell = React.forwardRef<
  HTMLInputElement,
  NumberInputCellProps
>(
  (
    {
      className,
      onValueChange,
      allowDecimal = true,
      decimalPlaces = 2,
      onBlurCallback,
      charLimit = 10,
      ...props
    },
    ref
  ) => {
    const formatNumberOnBlur = (value: string) => {
      // If empty or just whitespace, return empty string
      if (!value || value.trim() === "") {
        return "";
      }

      // Remove any non-numeric characters except period
      let cleanedValue = value.replace(/[^\d.]/g, "");

      // If after cleaning there's nothing left, return empty string
      if (!cleanedValue) {
        return "";
      }

      // Ensure there's only one decimal point
      const parts = cleanedValue.split(".");
      if (parts.length > 2) {
        cleanedValue = parts[0] + "." + parts.slice(1).join("");
      }

      // If decimals aren't allowed, remove any decimal portion
      if (!allowDecimal) {
        cleanedValue = cleanedValue.split(".")[0];
      }

      // Parse to float
      const parsedValue = parseFloat(cleanedValue);

      // Check if it's a valid number
      if (isNaN(parsedValue)) {
        return "";
      }

      // Return formatted number with specified decimal places if decimals are allowed
      return allowDecimal
        ? parsedValue.toFixed(decimalPlaces)
        : Math.floor(Math.abs(parsedValue)).toString();
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      const value = input.value;

      // Allow empty input
      if (value === "") {
        return;
      }

      // Create regex pattern based on allowDecimal setting
      const pattern = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;

      // If value doesn't match pattern, prevent the input
      if (!pattern.test(value)) {
        e.preventDefault();
        // Restore previous valid value
        input.value = props.value?.toString() || "";
        return;
      }

      // If decimal is allowed, ensure only one decimal point
      if (allowDecimal && (value.match(/\./g) || []).length > 1) {
        e.preventDefault();
        input.value = props.value?.toString() || "";
        return;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (charLimit && value.length > charLimit) {
        toast({
          title: "Character Limit Reached",
          description: `Maximum ${charLimit} characters allowed.`,
          variant: "destructive",
          duration: 3000,
        });
        const truncatedValue = value.substring(0, charLimit);
        onValueChange(truncatedValue);
        return;
      }


      //Added
      if (allowDecimal && value.includes(".")) {
        const decimalPart = value.split(".")[1];
        if (decimalPart && decimalPart.length > decimalPlaces) {
          return;
        }
      }

      // Only allow valid numeric input with stricter validation
      const pattern = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
      if (value === "" || pattern.test(value)) {
        onValueChange(value);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Only format if there's a value, otherwise keep it empty
      const value = e.target.value;

      // First, call the custom onBlur callback if provided (for discount calculations)
      if (onBlurCallback) {
        onBlurCallback(value);
      }

      // Then format the number
      if (value && value.trim() !== "") {
        const formattedValue = formatNumberOnBlur(value);
        onValueChange(formattedValue);
      } else {
        onValueChange("");
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const inputElement = e.target as HTMLInputElement;
      // Select all text when clicked
      inputElement.select();
    };

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onClick={handleClick}
        onInput={handleInput}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
NumberInputCell.displayName = "NumberInputCell";

export { Input };
