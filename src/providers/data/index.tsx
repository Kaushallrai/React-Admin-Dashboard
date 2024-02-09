import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

// Define the API URL constant
export const API_URL = "https://api.crm.refine.dev";

// Create a new GraphQLClient instance with custom fetch function
export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      // Attempt to fetch data using fetchWrapper function
      return fetchWrapper(url, options);
    } catch (error) {
      // If an error occurs during fetching, reject the promise with the error
      return Promise.reject(error as Error);
    }
  },
});
