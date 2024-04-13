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
