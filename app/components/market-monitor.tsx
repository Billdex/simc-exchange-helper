import {MonitorConfigData} from "@/app/data/monitor-config";
import useSWR from "swr";
import {GoodsExchangeItem} from "@/app/data/market";
import {useEffect, useState} from "react";

interface IMarketMonitor {
    monitorConfig: MonitorConfigData
}

export default function MarketMonitor({monitorConfig}: IMarketMonitor) {
    const [updateTime, setUpdateTime] = useState<Date>(new Date())
    const {
        data,
        error,
        isLoading
    } = useSWR<GoodsExchangeItem[]>(`https://www.simcompanies.com/api/v3/market/0/${monitorConfig.id}/`,
        (url) => fetch(url, {
            referrer: "",
            referrerPolicy: "no-referrer",
        }).then((res) => {
            setUpdateTime(new Date())
            return res.json()
        }), {
            revalidateOnFocus: true,
            refreshWhenHidden: true,
            refreshWhenOffline: true,
            refreshInterval:   10*1000,
            shouldRetryOnError: true,
            errorRetryCount: 10,
            errorRetryInterval: 5*1000,
            onErrorRetry: (error, key, config, revalidate,{retryCount,}) => {
                console.log(`fetch ${monitorConfig.name} error: ${error}`)
                setTimeout(() => revalidate({retryCount: retryCount}), config.errorRetryInterval)
            }
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
            notifyTextList.push(`Q${strategy.quality}+  |  @${data?.[0].price}/${strategy.price}  |  ${goodsCount}u`)
        }
    }))
    if (notifyTextList.length > 0 && (new Date().getTime() - updateTime?.getTime()) > 25) {
        const notifyTitle = `re-${monitorConfig.id} ${monitorConfig.name} ${monitorConfig.name_en}`
        const notifyBody = notifyTextList.join("\n")
        if (Notification.permission === "granted") {
            new Notification(notifyTitle, {body: notifyBody})
        } else {
            Notification.requestPermission().then(() => new Notification(notifyTitle, {body: notifyBody}))
        }
    }
    return (
        <>
            最近市价: {data && (data.length > 0 ? data?.[0].price : 0) || 0}
            <br/>
            更新时间: {updateTime && (updateTime.toLocaleTimeString('zh-CN')) || "未开始"}
        </>
    )
}