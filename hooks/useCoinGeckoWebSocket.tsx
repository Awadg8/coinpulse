'use client'

import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebsocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());
  // Pending set_pools payloads to send once confirm_subscription arrives
  const pendingPoolData = useRef<Map<string, Record<string, unknown>>>(new Map());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) =>
      ws.send(JSON.stringify(payload));

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);
      // console.log("WebSocket Message Received:", msg);

      if (msg.type === "ping") {
        send({ event: "pong" });
        return;
      }

      if (msg.type === "confirm_subscription") {
        const { channel } = JSON.parse(msg?.identifier ?? "");
        subscribed.current.add(channel);

        // Send the set_pools message now that the channel is confirmed
        const pending = pendingPoolData.current.get(channel);
        if (pending) {
          send({
            command: "message",
            identifier: JSON.stringify({ channel }),
            data: JSON.stringify(pending),
          });
          pendingPoolData.current.delete(channel);
        }
      }

      if (msg.c === "C1") {
        setPrice({
          usd: msg.p ?? 0,
          coin: msg.i,
          price: msg.p,
          change24h: msg.pp,
          marketCap: msg.m,
          volume24h: msg.v,
          timestamp: msg.t,
        });
      }

      if (msg.c === "G2") {
        const newTrade: Trade = {
          price: msg.pu,
          value: msg.vo,
          timestamp: msg.t ?? 0,
          type: msg.ty,
          amount: msg.to as unknown as number,
        };

        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }

      if (msg.ch === "G3") {
        const timestamp = msg.t ?? 0;

        const candle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsWsReady(true);

    ws.onmessage = handleMessage;

    ws.onclose = () => setIsWsReady(false);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!isWsReady) return;

    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, unknown>) =>
      ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: "unsubscribe",
          identifier: JSON.stringify({ channel }),
        });
      });

      subscribed.current.clear();
      pendingPoolData.current.clear();
    };

    // Subscribes to a channel and queues data to be sent after confirm_subscription
    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (data) {
        pendingPoolData.current.set(channel, data);
      }

      send({
        command: "subscribe",
        identifier: JSON.stringify({ channel }),
      });
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      subscribe("CGSimplePrice", {
        coin_id: [coinId],
        action: "set tokens",
      });

      const poolAddress = poolId.replace("_", ":");

      if (poolAddress) {
        subscribe("OnchainTrade", {
          "network_id:pool_addresses": [poolAddress],
          action: "set_pools",
        });

        subscribe("OnchainOHLCV", {
          "network_id:pool_addresses": [poolAddress],
          interval: liveInterval ?? "1m",
          token: "base",
          action: "set_pools",
        });
      }
    });
  }, [coinId, poolId, isWsReady, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
};
