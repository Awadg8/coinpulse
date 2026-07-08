import { formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";

const CoinHeader = ({
    name,
    image,
    livePrice,
    livePriceChangePercentage24h,
    priceChangePercentage30d,
    priceChange24h
}: LiveCoinHeaderProps) => {
    const isTrendingUp = livePriceChangePercentage24h > 0;
    const isThirtyDayUp = priceChangePercentage30d > 0;
    const isPriceChangeUp = priceChange24h > 0;

    const stats = [
        {
            label: 'Today',
            value: livePriceChangePercentage24h,
            isUp: isTrendingUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: '30 Days',
            value: priceChangePercentage30d,
            isUp: isThirtyDayUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: 'Price Change (24h)',
            value: priceChange24h,
            isUp: isPriceChangeUp,
            formatter: formatCurrency,
            showIcon: false
        }
    ]
    return (
        <div id="coin-header">
            <h3>{name}</h3>

            <div className="info">
                <Image src={image} alt={name} width={77} height={77} />

                <div className="price-row">
                    <h1>{formatCurrency(livePrice)}</h1>
                </div>
            </div>
        </div>
    )
}

export default CoinHeader