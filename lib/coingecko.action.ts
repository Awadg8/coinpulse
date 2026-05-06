"use server";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not got base url");
if (!API_KEY) throw new Error("Could not got api key");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
): Promise<T> {
  const url = `${process.env.COINGECKO_BASE_URL!.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-cg-demo-api-key": String(process.env.API_KEY),
    },
    cache: "no-store",
  });

  const text = await response.text();
  // console.log("RAW RESPONSE TEXT:", text);
  // console.log("RAW RESPONSE URL:", url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}
