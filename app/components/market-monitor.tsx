import {MonitorConfigData} from "@/app/data/monitor-config";
import useSWR from "swr";
import {GoodsExchangeItem} from "@/app/data/market";
import {useState} from "react";

interface IMarketMonitor {
    monitorConfig: MonitorConfigData
}

export default function MarketMonitor({monitorConfig}: IMarketMonitor) {
    const [updateTime, setUpdateTime] = useState<Date|null>(null)
    const {
        data,
        error,
        isLoading
    } = useSWR<GoodsExchangeItem[]>(`https://www.simcompanies.com/api/v3/market/0/${monitorConfig.id}/`,
        (url) => fetch(url).then((res) => {
            setUpdateTime(new Date())
            return res.json()
        }), {
            revalidateOnFocus: false,
            refreshWhenHidden: true,
            refreshInterval:   10*1000,
        });
    // 当符合监控策略条件的时候，发送通知
    const notifyTextList = new Array<string>()
    monitorConfig.strategies.forEach((strategy => {
        let goodsCount = 0
        for (let i = 0; data && i < data.length; i++) {
            if (data[i].price > strategy.price) {
                break
            }
            if (data[i].quality >= strategy.quality) {
                goodsCount += data[i].quantity
            }
        }
        if (goodsCount > 0 && goodsCount >= strategy.count) {
            notifyTextList.push(`Q${data?.[0].quality} @${data?.[0].price} ${goodsCount}u`)
        }
    }))
    if (notifyTextList.length > 0) {
        const notifyText = notifyTextList.join("\n")
        if (Notification.permission === "granted") {
            new Notification(monitorConfig.name, {body: notifyText})
        } else {
            Notification.requestPermission().then(() => new Notification(monitorConfig.name, {body: notifyText}))
        }
    }
    return (
        <>
            最近市价: {data && (data.length > 0 ? data?.[0].price : 0) || 0}
            <br/>
            更新时间: {updateTime && (updateTime.toLocaleTimeString('zh-CN', {timeZone: 'GMT'})) || "未开始"}
        </>
    )
}