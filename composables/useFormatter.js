export function useFormatter() {
  const formatDecimal = (value) => {
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join("")}`;
    }
    if (value.includes(".")) {
      const [integerPart, decimalPart = ""] = value.split(".");
      value = `${integerPart}.${decimalPart.slice(0, 2)}`;
    }
    return value;
  };
  const enforceTwoDecimalPlaces = (value) => {
    const numericValue = parseFloat(value || "0").toFixed(2);
    return numericValue;
  };
  return {
    formatDecimal,
    enforceTwoDecimalPlaces,
  };
}
