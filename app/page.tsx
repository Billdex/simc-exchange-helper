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
            quality: 0,
            price: 0,
            count: 0,
        }
    }) || [])
    const [monitorConfigList, setMonitorConfigList] = useState<MonitorConfigItem[]>([]);
    const configuredItemSet: Set<number> = monitorConfigList.reduce<Set<number>>(
        (prev, current) => prev.add(current.id),
        new Set<number>)
    const canSelectItems: MonitorConfigItem[] = defaultMonitorConfigList.filter(item => configuredItemSet.has(item.id))
    useEffect(() => {
        setMonitorConfigList(JSON.parse(localStorage.getItem("monitor-config")) || [])
    }, [])

    return (
        <>
            <Search
                dataList={canSelectItems}
                onSelect={(item: MonitorConfigItem) => {
                    setMonitorConfigList(config => [item].concat(config))
                }}
            />
            {
                monitorConfigList.map(item => {
                    return <Goods
                        id={item.id}
                        name={item.name}
                        quality={item.quality}
                        price={item.price}
                        count={item.count}
                    />
                })
            }
        </>
    )
}

