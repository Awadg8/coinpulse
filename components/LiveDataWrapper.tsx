"use client";
import { useState } from "react";
import DataTable from "./DataTable";
import CandlestickChart from "./CandlestickChart";
import { useCoinGeckoWebsocket } from "@/hooks/useCoinGeckoWebSocket";
import { Separator } from "./ui/separator";
import { formatCurrency, formatSmallPrice, timeAgo } from "@/lib/utils";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({
  coinId,
  poolId,
  coin,
  coinOHLCData,
  children,
}: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1s");
  const { trades, ohlcv, price } = useCoinGeckoWebsocket({
    coinId,
    poolId,
    liveInterval,
  });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatSmallPrice(trade.price) : "-"),
    },
    {
      header: "Quantity",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span
          className={trade.type === "b" ? "text-green-500" : "text-red-500"}
        >
          {trade.type === "b" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  const exchangeListings: DataTableColumn<ExchangeListings>[] = [
    {
      header: "Exchange",
      cellClassName: "price-cell",
      cell: (coin) => (
        <span className="text-green-500">
          {coin.market?.name}
        </span>
      ),
    },
    {
      header: "Pair",
      cellClassName: "amount-cell",
      cell: (coin) => {
        const coinbase = coin.base ? `${coin.base.length > 12 ? coin.base?.slice(0, 12) + "..." : coin.base}` : "-";
        const cointarget = coin.target ? `${coin.target.length > 12 ? coin.target?.slice(0, 12) + "..." : coin.target}` : "-";
        return coinbase + " / " + cointarget
      },
    },
    {
      header: "Price",
      cellClassName: "value-cell",
      cell: (coin) => (formatSmallPrice(coin.last)),
    },
    {
      header: "Last Traded",
      cellClassName: "time-cell",
      cell: (coin) => (coin.last_traded_at ? timeAgo(coin.last_traded_at) : "-"),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd}
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_percentage_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}

      {exchangeListings && (
        <div className="trades">
          <h4>Exchange Listings</h4>

          <DataTable
            columns={exchangeListings}
            data={coin.tickers.slice(0, 7)}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
