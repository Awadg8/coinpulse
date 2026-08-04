"use server";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not got base url");
if (!API_KEY) throw new Error("Could not got api key");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
): Promise<T> {
  const url = new URL(
    `${BASE_URL!.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-cg-pro-api-key": API_KEY!,
    },
    // cache: "no-store",
  });

  const text = await response.text();
  // console.log(response);
  // console.log("RAW RESPONSE TEXT:", text);
  // console.log("RAW RESPONSE URL:", url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

export async function getPools(
  id: string,
  network: string | null,
  contactAddress: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contactAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contactAddress}/pools`,
      );
      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/coins/search/pools",
      { query: id },
    );
    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query) return [];
  try {
    const response = await fetcher<{ coins: SearchCoin[] }>("/search", { query });
    const coins = response.coins || [];
    
    if (coins.length > 0) {
      // Get up to 10 coin IDs to fetch their prices
      const ids = coins.slice(0, 10).map((c) => c.id).join(",");
      const prices = await fetcher<Record<string, { usd: number; usd_24h_change: number }>>(
        "/simple/price",
        {
          ids,
          vs_currencies: "usd",
          include_24hr_change: true,
        }
      );

      return coins.map((coin) => ({
        ...coin,
        data: {
          price: prices[coin.id]?.usd,
          price_change_percentage_24h: prices[coin.id]?.usd_24h_change ?? 0,
        },
      }));
    }

    return coins;
  } catch (error) {
    return [];
  }
}

export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const data = await fetcher<{ coins: TrendingCoin[] }>("/search/trending");
    return data.coins || [];
  } catch (error) {
    return [];
  }
}
