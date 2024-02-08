/*
  Define a custom fetch function that adds authorization headers,
  content type, and Apollo preflight requirement for GraphQL requests.
*/
import { GraphQLFormattedError } from "graphql";

// Define a type for error responses
type Error = {
  message: string;
  statusCode: string;
};

// Define a custom fetch function
const customFetch = async (url: string, options: RequestInit) => {
  // Get access token from local storage
  const accessToken = localStorage.getItem("access_token");

  // Extract headers from options object
  const headers = options.headers as Record<string, string>;

  // Perform fetch request with modified headers
  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

// Function to extract GraphQL errors from response body
const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  // If response body is empty, return a generic error
  if (!body) {
    return {
      message: "Unknown error occurred",
      statusCode: "Internal Server Error",
    };
  }

  // If response body contains GraphQL errors
  if ("errors" in body) {
    const errors = body?.errors;

    // Extract error messages and code
    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0]?.extensions?.code;

    // Return error message and status code
    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || "500",
    };
  }
  // If no GraphQL errors found, return null
  return null;
};
