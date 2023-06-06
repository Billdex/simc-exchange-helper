import Image from "next/image";
import {MonitorConfigData, MonitorStrategy} from "@/app/data/monitor-config";
import React from "react";
import {nanoid} from "nanoid";

interface IGoodsMonitorConfigProps {
    monitorConfig: MonitorConfigData,
    onChange?: (value: MonitorConfigData) => void
}

// 商品监控配置组件
export default function GoodsMonitorConfig({monitorConfig, onChange}: IGoodsMonitorConfigProps) {
    return (
        <>
            <span className={"inline-block w-16"}>{`re-${monitorConfig.id}`}</span>
            <Image
                className={"inline-block"}
                src={`https://d1fxy698ilbz6u.cloudfront.net/static/images/resources/${monitorConfig.name_en.replaceAll(" ", "-").toLowerCase()}.png`}
                alt={monitorConfig.name_en}
                width={50}
                height={50}
            />
            <span className={"inline-block mx-4 w-28"}>{monitorConfig.name}</span>
            <ul className={""}>
                {monitorConfig.strategies.map(strategy => {
                    return (
                        <li key={strategy.id}
                            className={"p-1 w-full"}
                        >
                            预期品质:<input className={"border mx-4 w-36"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    quality: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.quality}/>
                            预期价位:<input className={"border mx-4 w-36"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    price: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.price}/>
                            预期数量:<input className={"border mx-4 w-36"}
                                            type="number"
                                            onChange={(e) => onChange?.({
                                                ...monitorConfig,
                                                strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                    ...item,
                                                    count: Number(e.currentTarget.value),
                                                } : item),
                                            })}
                                            value={strategy.count}/>
                            {monitorConfig.strategies.length > 1 &&
                                <button
                                    className={"border w-6 h-6 p-1 bg-red-400 rounded-md text-white"}
                                    onClick={(e) => onChange?.({
                                        ...monitorConfig,
                                        strategies: monitorConfig.strategies.filter(item => item.id !== strategy.id),
                                    })}
                                >×</button>
                            }
                        </li>
                    )
                })}
                <li key={"add_strategy"}
                    className={"border border-gray-400 text-gray-400 rounded-2xl w-36"}
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
                    }}
                >添加策略
                </li>
            </ul>
        </>
    )
}