'use client';

import Image from 'next/image'
import {useEffect, useState} from "react";
import Goods from "@/app/components/goods";
import goodsMetadataList from "./data/goods.json"
import type {MonitorConfigItem} from "@/app/data/monitor-config";
import Search from "@/app/components/search";

export default function Home() {
    const [defaultMonitorConfigList,] = useState<MonitorConfigItem[]>(() => goodsMetadataList.map<MonitorConfigItem>(item => {
        return {
            id: item.id,
            name: item.name,
            name_en: item.name_en,
            quality: 0,
            price: 0,
            count: 0,
        }
    }) || [])
    const [monitorConfigList, setMonitorConfigList] = useState<MonitorConfigItem[]>([]);
    const configuredItemSet: Set<number> = monitorConfigList.reduce<Set<number>>(
        (prev, current) => prev.add(current.id),
        new Set<number>)
    const canSelectItems: MonitorConfigItem[] = defaultMonitorConfigList.filter(item => !configuredItemSet.has(item.id))
    useEffect(() => {
        setMonitorConfigList(JSON.parse(localStorage.getItem("monitor-config") || "[]") || [])
    }, [])


    return (
        <>
            <Search
                dataList={canSelectItems}
                onSelect={(item: MonitorConfigItem) => {
                    const newMonitorConfig = new Array<MonitorConfigItem>().concat(item).concat(monitorConfigList)
                    localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                    setMonitorConfigList(newMonitorConfig)
                }}
            />
            <ul className={"mx-auto"}>
                {
                    monitorConfigList.map(item => {
                        return (
                            <li key={item.id}>
                                <span className={"mx-6"}>
                                <Goods
                                    id={item.id}
                                    name={item.name}
                                    name_en={item.name_en}
                                    quality={item.quality}
                                    price={item.price}
                                    count={item.count}
                                />
                                </span>
                                <button
                                    className={"border"}
                                    onClick={(e) => {
                                        const newMonitorConfig = monitorConfigList.filter(value => value.id !== item.id)
                                        localStorage.setItem("monitor-config", JSON.stringify(newMonitorConfig))
                                        setMonitorConfigList(newMonitorConfig)
                                    }}
                                >删除</button>
                            </li>)
                    })
                }
            </ul>
        </>
    )
}

