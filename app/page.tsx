'use client';

import {useEffect, useState} from "react";
import GoodsMonitorConfigCard from "@/app/components/goods-monitor-config-card";
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
        <div className={"w-10/12 mx-auto py-5"}>
            <div>
                <button
                    className={onMonitor ? "border rounded-md w-28 h-10 mx-2 bg-green-500 text-white hover:bg-red-500" : "border rounded-md w-28 h-10 mx-2 hover:bg-green-500 hover:text-white"}
                    onClick={(e) => {
                        setOnMonitor(monitorState => !monitorState)
                    }}
                >{onMonitor ? "监控中" : "开始监控"}</button>
                <button
                    className={"border rounded-md w-28 h-10 mx-2 hover:bg-gray-200"}
                    onClick={(e) => {
                        if (Notification.permission == "granted") {
                            new Notification("通知测试")
                            return
                        }
                        Notification.requestPermission().then(r => new Notification("通知测试"))
                    }}
                >通知测试
                </button>
            </div>
            <div className={"my-5"}>
                <Search
                    dataList={canSelectItems}
                    onSelect={(item: MonitorConfigData) => {
                        const newMonitorConfig = new Array<MonitorConfigData>().concat(item).concat(monitorConfigList)
                        localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                        setMonitorConfigList(newMonitorConfig)
                    }}
                />
            </div>
            <ul className={"mx-auto"}>
                {
                    monitorConfigList.map(item => {
                        return (
                            <li className={"flex my-2 py-2"} key={item.id}>
                                <div className={"w-9/12"}>
                                    <GoodsMonitorConfigCard
                                        monitorConfig={item}
                                        onChange={(changedValue) => {
                                            const newMonitorConfig = monitorConfigList.map(configItem => configItem.id === item.id ? changedValue : configItem)
                                            localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                                            setMonitorConfigList(newMonitorConfig)
                                        }}
                                    />
                                </div>
                                <div className={"mx-6 w-2/12"}>
                                    {onMonitor && <MarketMonitor monitorConfig={item}/>}
                                </div>
                                <div className={"w-1/12"}>
                                    <button
                                        className={"border px-4 py-2"}
                                        onClick={(e) => {
                                            const newMonitorConfig = monitorConfigList.filter(configItem => configItem.id !== item.id)
                                            localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                                            setMonitorConfigList(newMonitorConfig)
                                        }}
                                    >删除
                                    </button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
