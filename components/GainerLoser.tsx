'use client'

import { fetcher } from "@/lib/coingecko.action";
import { formatPercentage, formatSmallPrice } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const TabContent = ({ list }: { list: TopGainersLosers[] }) => {
    return (
        <ul className="gap-2 flex flex-col">
            {list.map((gainer, index) => (
                <li key={index} className="tabs-content bg-dark-500 rounded-md p-3">
                    <div className="flex gap-3 items-center">
                        <Image src={gainer.image} alt={gainer.name} width={40} height={40} />
                        <div>
                            <p className="text-sm font-medium">{gainer.name}</p>
                            <p className="text-xs uppercase text-purple-100 mt-1">{gainer.symbol}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-0">
                        <p className="text-sm font-medium">{formatSmallPrice(gainer.current_price)}</p>
                        <div className={`flex items-center gap-1 text-xs mt-1 ${gainer.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {gainer.price_change_percentage_24h > 0 ? (
                                <TrendingUp width={16} height={16} />
                            ) : (
                                <TrendingDown width={16} height={16} />
                            )}
                            {formatPercentage(gainer.price_change_percentage_24h)}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

const GainerLoser = () => {
    const [data, setData] = useState<{ gainers: TopGainersLosers[], losers: TopGainersLosers[] }>({ gainers: [], losers: [] })
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers')

    useEffect(() => {
        const func = async () => {
            const coins = await fetcher<TopGainersLosers[]>('coins/markets', {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: false,
            });

            // Sort coins by price change percentage in descending order
            const sortedCoins = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

            // Top 6 are gainers
            const gainers = sortedCoins.slice(0, 6);

            // Bottom 6 are losers, reversed so the worst is first
            const losers = sortedCoins.slice(-6).reverse();

            setData({ gainers, losers });
        }
        func()
    }, [])

    return (
        <div id="top-gainers-losers">
            <div className="tabs-list flex gap-5 items-center justify-evenly">
                <div
                    onClick={() => setActiveTab('gainers')}
                    className={`tabs-trigger cursor-pointer ${activeTab === 'gainers' ? 'active' : ''}`}>
                    Top Gainers
                </div>
                <div
                    onClick={() => setActiveTab('losers')}
                    className={`tabs-trigger cursor-pointer ${activeTab === 'losers' ? 'active' : ''}`}>
                    Top Losers
                </div>
            </div>

            <div className="mt-3">
                {activeTab === 'gainers' && (
                    <TabContent list={data.gainers} />
                )}
                {activeTab === 'losers' && (
                    <TabContent list={data.losers} />
                )}
            </div>
        </div>
    )
}

export default GainerLoser