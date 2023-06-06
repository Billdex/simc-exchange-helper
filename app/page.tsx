'use client';

import {useEffect, useState} from "react";
import GoodsMonitorConfig from "@/app/components/goods-monitor-config";
import goodsMetadataList from "./data/goods.json"
import type {MonitorConfigData} from "@/app/data/monitor-config";
import Search from "@/app/components/search";
import {nanoid} from "nanoid";
import MarketMonitor from "@/app/components/market-monitor";

export default function Home() {
    const [defaultMonitorConfigList,] = useState<MonitorConfigData[]>(() => goodsMetadataList.map<MonitorConfigData>(item => {
        return {
            id: item.id,
            name: item.name,
            name_en: item.name_en,
            strategies: [
                {
                    id: nanoid(5),
                    quality: 0,
                    price: 0,
                    count: 0,
                }
            ]
        }
    }) || [])
    const [monitorConfigList, setMonitorConfigList] = useState<MonitorConfigData[]>([]);
    const [onMonitor, setOnMonitor] = useState<boolean>(false)

    useEffect(() => {
        setMonitorConfigList(JSON.parse(localStorage.getItem("monitor-config") || "[]") || [])
    }, [])

    const configuredItemSet: Set<number> = monitorConfigList.reduce<Set<number>>(
        (prev, current) => prev.add(current.id),
        new Set<number>)
    const canSelectItems: MonitorConfigData[] = defaultMonitorConfigList.filter(item => !configuredItemSet.has(item.id))


    return (
        <>
            <div>
                <span></span>
                <button
                    onClick={(e) => {
                        if (Notification.permission == "granted") {
                            new Notification("通知测试")
                            return
                        }
                        Notification.requestPermission().then(r => new Notification("通知测试"))
                    }}
                >通知测试
                </button>
                <button
                    className={onMonitor ? "" : ""}
                    onClick={(e) => {
                        setOnMonitor(monitorState => !monitorState)
                    }}
                >{onMonitor ? "停止监控" : "开始监控"}</button>
            </div>
            <Search
                dataList={canSelectItems}
                onSelect={(item: MonitorConfigData) => {
                    const newMonitorConfig = new Array<MonitorConfigData>().concat(item).concat(monitorConfigList)
                    localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                    setMonitorConfigList(newMonitorConfig)
                }}
            />
            <ul className={"mx-auto"}>
                {
                    monitorConfigList.map(item => {
                        return (
                            <li key={item.id}>
                                <span className={"mx-6 w-96"}>
                                    <GoodsMonitorConfig
                                        monitorConfig={item}
                                        onChange={(changedValue) => {
                                            const newMonitorConfig = monitorConfigList.map(configItem => configItem.id === item.id ? changedValue : configItem)
                                            localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                                            setMonitorConfigList(newMonitorConfig)
                                        }}
                                    />
                                </span>
                                <span className={"mx-6 w-36"}>
                                    {onMonitor && <MarketMonitor monitorConfig={item} />}
                                </span>
                                <button
                                    className={"border px-4 py-2"}
                                    onClick={(e) => {
                                        const newMonitorConfig = monitorConfigList.filter(configItem => configItem.id !== item.id)
                                        localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                                        setMonitorConfigList(newMonitorConfig)
                                    }}
                                >删除
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
