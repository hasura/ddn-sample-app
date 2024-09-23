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
 * @paralleldegree 5
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
 * @paralleldegree 5
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

interface GithubProfile {
  bio: string | null; // Assuming 'bio' can be null
}

/**
 * Returns the github bio for the userid provided with batching
 *
 * @param username Username of the user who's bio will be fetched.
 * @returns The github bio for the requested user.
 * @readonly This function should only query data without making modifications
 * @paralleldegree 12
 */

export async function get_github_profile_description(
  username: string
): Promise<string | null> {
  try {
    // const response = await fetch(`https://api.github.com/users/${username}`);
    const response = await fetch(`https://httpbin.org/delay/2`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
    }

    // Use type assertion to tell TypeScript the expected type of the JSON response
    const data = (await response.json()) as GithubProfile;

    // Handle the case where 'bio' is null or undefined
    return data.bio ?? "No bio available.";
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    throw error; // Or handle it as appropriate for your application
  }
}

/**
 * Returns the github bio for the userid provided without batching
 *
 * @param username Username of the user who's bio will be fetched.
 * @returns The github bio for the requested user.
 * @readonly This function should only query data without making modifications
 * @paralleldegree 1
 */

 export async function get_github_profile_description_noparallel(
  username: string
): Promise<string | null> {
  try {
    // const response = await fetch(`https://api.github.com/users/${username}`);
    const response = await fetch(`https://httpbin.org/delay/3`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
    }

    // Use type assertion to tell TypeScript the expected type of the JSON response
    const data = (await response.json()) as GithubProfile;

    // Handle the case where 'bio' is null or undefined
    return data.bio ?? "No bio available.";
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    throw error; // Or handle it as appropriate for your application
  }
}

/**
 * Typescript Function with a 300 HTTP Delay
 * @readonly This function should only query data without making modifications
 * @paralleldegree 5
 */

export async function http300delay(
  username: string
): Promise<string | null> {
  try {
    // const response = await fetch(`https://api.github.com/users/${username}`);
    const response = await fetch(`https://httpbin.org/delay/3`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
    }

    // Use type assertion to tell TypeScript the expected type of the JSON response
    const data = (await response.json()) as GithubProfile;

    // Handle the case where 'bio' is null or undefined
    return data.bio ?? "No bio available.";
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    throw error; // Or handle it as appropriate for your application
  }
}