'use client'
import { useCoinGeckoWebsocket } from "@/hooks/useCoinGeckoWebSocket"
import CandlestickChart from "./CandlestickChart"
import { Separator } from "./ui/separator"
import { formatCurrency, timeAgo } from "@/lib/utils"
import DataTable from "./DataTable"

const LiveDataWrapper = ({ coinId, poolId, coin, coinOHLCData, children }: LiveDataProps) => {
    const { trades } = useCoinGeckoWebsocket({
        coinId,
        poolId
    })

    const tradeColumns: DataTableColumn<Trade>[] = [
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (trade) => trade.price ? formatCurrency(trade.price) : '-'
        },
        {
            header: 'Amount',
            cellClassName: 'amount-cell',
            cell: (trade) => trade.amount?.toFixed(4) ?? '-'
        },
        {
            header: 'Value',
            cellClassName: 'value-cell',
            cell: (trade) => trade.value ? formatCurrency(trade.value) : '-'
        },
        {
            header: 'Buy/Sell',
            cellClassName: 'type-cell',
            cell: (trade) => (
                <span className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type === 'b' ? 'Buy' : 'Sell'}
                </span>
            )
        },
        {
            header: 'Time',
            cellClassName: 'time-cell',
            cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-')
        },
    ]

    return (
        <section id="live-data-wrapper">
            <h2>Live Data Wrapper</h2>

            <Separator className="divider" />

            <div className="trend">
                <CandlestickChart
                    coinId={coinId}
                    data={coinOHLCData}
                >
                    <h4>Trend Overview</h4>
                </CandlestickChart>
            </div>

            <Separator className="divider" />

            {tradeColumns && (
                <div className="trades">
                    <h4>Resent Trades</h4>

                    <DataTable
                        columns={tradeColumns}
                        data={trades}
                        rowKey={(_, index) => index}
                        tableClassName="trades-table"
                        />
                </div>
            )}
        </section>
    )
}

export default LiveDataWrapper