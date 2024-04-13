/**
 * @readonly Exposes the function as an NDC function (the function should only query data without making modifications)
 */
export function hello(name?: string) {
  return `hello ${name ?? "world"}`;
}

/**
 * Formats a date string to a human-readable format.
 *
 * @param date The date string to format.
 * @returns The formatted date string.
 * @readonly This function should only query data without making modifications
 */
export function toDateString(date?: string): string {
  console.log("date", date);
  if (!date) {
    return "Invalid date";
  }
  try {
    return new Date(date).toDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a number into a currency string.
 *
 * @param amount The number to format into currency.
 * @returns The formatted currency string.
 * @readonly This function should only format data without making modifications to the input.
 */
 export function toCurrencyString(amount?: number): string {
  console.log("amount", amount);
  if (amount === undefined || isNaN(amount)) {
      return "Invalid amount";
  }
  try {
      return amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
      });
  } catch (error) {
      console.error("Error formatting currency:", error);
      return "Invalid amount";
  }
}
