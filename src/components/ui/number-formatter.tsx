import React from "react";

interface NumberFormatterProps {
  value: any;
  decimals?: number;
  className?: string;
}

export const NumberFormatter: React.FC<NumberFormatterProps> = ({
  value,
  decimals = 2,
  className,
}) => {
  const formatNumber = (val: any, decimalPlaces: number = 2): string => {
    if (val === undefined || val === null || val === "") return "0.00";
    
    const cleaned = String(val).replace(/,/g, "");
    const num = parseFloat(cleaned);

    if (isNaN(num)) return "0.00";
    
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };

  return (
    <span className={className}>
      {formatNumber(value, decimals)}
    </span>
  );
};

export const formatNumberWithCommas = (value: any, decimals: number = 2): string => {
  if (value === undefined || value === null || value === "") return "0.00";
  
  const cleaned = String(value).replace(/,/g, "");
  const num = parseFloat(cleaned);

  if (isNaN(num)) return "0.00";
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
