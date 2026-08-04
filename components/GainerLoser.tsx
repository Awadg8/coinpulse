'use client'

import { fetcher } from "@/lib/coingecko.action";
import { useEffect, useState } from "react";

const GainerLoser = () => {
    const [data, setData] = useState<{ gainers: TopGainersLosers[], losers: TopGainersLosers[] }>({ gainers: [], losers: [] })
    useEffect(() => {
        const func = async () => {
            const [gainers, losers] = await Promise.all([
                fetcher<TopGainersLosers[]>('coins/markets', {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    page: 1,
                    sparkline: false,
                }),
                fetcher<TopGainersLosers[]>('coins/markets', {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    page: 2,
                    sparkline: false,
                })
            ])
            setData({ gainers, losers })
        }
        func()
    }, [])

    console.log(data)

    return (
        <div id="top-gainers-losers">
            {/* <div className="gainers">
                <h4>Top Gainers</h4>
                <ul>
                    {data.gainers.map((gainer, index) => (
                        <li key={index}>
                            <p>{gainer.name}</p>
                            <p>{gainer.priceChangePercentage24h}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="losers">
                <h4>Top Losers</h4>
                <ul>
                    {data.losers.map((loser, index) => (
                        <li key={index}>
                            <p>{loser.name}</p>
                            <p>{loser.priceChangePercentage24h}</p>
                        </li>
                    ))}
                </ul>
            </div> */}

            <div className="tabs-list">
                <div className="tabs-trigger">
                    Top 10 Gainers
                </div>
                <div className="tabs-trigger">
                    Top 10 Losers
                </div>
            </div>
        </div>
    )
}

export default GainerLoser