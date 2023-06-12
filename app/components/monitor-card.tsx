import Image from "next/image";
import {MonitorConfigData, MonitorStrategy} from "@/app/data/monitor-config";
import React, {useState} from "react";
import {nanoid} from "nanoid";
import useSWR from "swr";
import {GoodsExchangeItem} from "@/app/data/market";

interface IMonitorCard {
    monitorConfig: MonitorConfigData,
    isMonitor: boolean,
    onChange?: (value: MonitorConfigData) => void,
    onRemove?: () => void
}

// 商品监控配置组件
export default function MonitorCard({monitorConfig, isMonitor, onChange, onRemove}: IMonitorCard) {
    return (
        <div className={"border-2 rounded-xl min-w-xl shadow"}>
            <div className={"flex justify-start items-center rounded-t-lg h-12 px-4 bg-blue-50"}>
                <div className={"w-1/2"}>
                    <Image
                        className={"mx-auto inline-block"}
                        src={`https://d1fxy698ilbz6u.cloudfront.net/static/images/resources/${monitorConfig.name_en.replaceAll(" ", "-").toLowerCase()}.png`}
                        alt={monitorConfig.name_en}
                        width={40}
                        height={40}
                    />
                    <span className={"mx-2 items-center"}>{monitorConfig.name}</span>
                    <span className={"items-center text-gray-500"}>{`re-${monitorConfig.id}`}</span>
                </div>
                <div className={"flex w-1/2 h-10 justify-end items-center"}>
                    {isMonitor && <PriceSpan
                        monitorConfig={monitorConfig}
                    />}
                </div>
            </div>
            <div className={"px-4 py-2"}>
                <ul className={"block divide-y w-full"}>
                    {monitorConfig.strategies.map(strategy => {
                        return (
                            <li key={strategy.id}
                                className={"py-2 px-4 flex justify-center"}
                            >
                                品质:<input className={"border rounded-md mx-2 ps-2 w-20"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    quality: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.quality}/>
                                价位:<input className={"border rounded-md mx-2 ps-2 w-20"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    price: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.price}/>
                                数量:<input className={"border rounded-md mx-2 ps-2 w-20"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    count: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.count}/>
                                <button
                                    className={"border w-6 h-6 bg-red-500 hover:bg-red-600 rounded-md text-white flex items-center justify-center"}
                                    onClick={(e) => onChange?.({
                                        ...monitorConfig,
                                        strategies: monitorConfig.strategies.filter(item => item.id !== strategy.id),
                                    })}
                                >×</button>
                            </li>
                        )
                    })}
                    {
                        monitorConfig.strategies.length === 0 &&
                        <li key={"remove_item"}
                            className={"py-1"}
                        >
                            <button
                                className={"w-full py-1 border-gray-300 border-slate-300 text-white bg-red-500 rounded-md hover:bg-red-600 flex flex-col items-center justify-center"}
                                onClick={(e) => {
                                    if (onRemove !== null && onRemove !== undefined) {
                                        onRemove()
                                    }
                                }}>
                                删除
                            </button>
                        </li>
                    }
                    <li key={"add_strategy"}
                        className={"py-2"}
                    >
                        <button
                            className={"w-full py-1 border-2 border-dashed border-gray-300 border-slate-300 text-slate-400 rounded-md hover:border-blue-300 hover:border-solid hover:text-blue-400 flex flex-col items-center justify-center"}
                            onClick={(e) => {
                                if (onChange !== null && onChange !== undefined) {
                                    const newConfigItem = {
                                        ...monitorConfig,
                                        strategies: monitorConfig.strategies.concat({
                                            id: nanoid(5),
                                            quality: 0,
                                            price: 0,
                                            count: 0,
                                        }),
                                    }
                                    onChange(newConfigItem)
                                }
                            }}>
                            添加策略
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

interface IPriceSpan {
    monitorConfig: MonitorConfigData
}

function PriceSpan({monitorConfig}: IPriceSpan) {
    const [updateTime, setUpdateTime] = useState<Date>(new Date())
    const [lastNotifyTime, setLastNotifyTime] = useState<Date>(new Date())
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
            refreshInterval:   8*1000,
            shouldRetryOnError: true,
            errorRetryCount: 10,
            errorRetryInterval: 0,
            onErrorRetry: (error, key, config, revalidate,{retryCount,}) => {
                console.log(`fetch ${monitorConfig.name} error: ${error}`)
                setTimeout(() => revalidate({retryCount: retryCount}), config.errorRetryInterval)
            }
        });
    // 当符合监控策略条件的时候，发送通知
    const notifyTextList = new Array<string>()
    monitorConfig.strategies.forEach((strategy => {
        let goodsCount: number = 0
        let minPrice: number = 0
        for (let i = 0; data && i < data.length; i++) {
            if (data[i].price > strategy.price) {
                break
            }
            if (data[i].quality >= strategy.quality) {
                goodsCount += data[i].quantity
                if (minPrice === 0) {
                    minPrice = data[i].price
                }
            }
        }
        if (goodsCount > 0 && goodsCount >= strategy.count) {
            notifyTextList.push(`Q${strategy.quality}+  |  @${minPrice}/${strategy.price}  |  ${goodsCount}u`)
        }
    }))
    if (notifyTextList.length > 0 && (new Date().getTime() - lastNotifyTime?.getTime()) > 25*1000) {
        console.log(`now: ${new Date().getTime()}`)
        console.log(`last notify time: ${lastNotifyTime.getTime()}`)
        const notifyTitle = `re-${monitorConfig.id} ${monitorConfig.name} ${monitorConfig.name_en}`
        const notifyBody = notifyTextList.join("\n")
        if (Notification.permission === "granted") {
            new Notification(notifyTitle, {body: notifyBody})
        } else {
            Notification.requestPermission().then(() => new Notification(notifyTitle, {body: notifyBody}))
        }
        setLastNotifyTime(new Date())
    }

    return (
        <>
            <span>{data && (data.length > 0 ? `$ ${data?.[0].price} (${updateTime && (updateTime.toLocaleTimeString('zh-CN'))})` : 0) || 0}</span>
        </>
    )

}