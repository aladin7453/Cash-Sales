import { getAuthHeaders } from "../constants";

export default async function authorizedFetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  // const username = JSON.parse(localStorage.getItem("username") ?? '""');
  // const authToken = JSON.parse(localStorage.getItem("authToken") ?? '""');

  // const isValid = await checkAccessToken(username, authToken);
  // if (!isValid) {
  //   console.error("Session expired. Redirecting to login.");
  //   throw new Error("Session expired");
  // }

  const headers = getAuthHeaders();

  try {
    const res = await fetch(input, { headers, ...init });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
