import Image from "next/image";
import {MonitorConfigData, MonitorStrategy} from "@/app/data/monitor-config";
import React from "react";
import {nanoid} from "nanoid";

interface IGoodsMonitorConfigProps {
    monitorConfig: MonitorConfigData,
    onChange?: (value: MonitorConfigData) => void
}

// 商品监控配置组件
export default function GoodsMonitorConfigCard({monitorConfig, onChange}: IGoodsMonitorConfigProps) {
    return (
        <div className={"flex border-2 rounded-xl px-6 py-4"}>
            <div className={"w-36"}>
                <Image
                    className={"mx-auto"}
                    src={`https://d1fxy698ilbz6u.cloudfront.net/static/images/resources/${monitorConfig.name_en.replaceAll(" ", "-").toLowerCase()}.png`}
                    alt={monitorConfig.name_en}
                    width={50}
                    height={50}
                />
                <div className={"mx-auto"}>
                    <div className={"text-center"}>{monitorConfig.name}</div>
                    <div className={"text-center text-gray-400"}>{`re-${monitorConfig.id}`}</div>
                </div>
            </div>
            <ul className={"block divide-y w-full"}>
                {monitorConfig.strategies.map(strategy => {
                    return (
                        <li key={strategy.id}
                            className={"py-2 px-4 flex justify-center"}
                        >
                            品质:<input className={"border rounded-md mx-4 ps-2 w-20"}
                                        type="number"
                                        onChange={(e) => onChange?.({
                                            ...monitorConfig,
                                            strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                ...item,
                                                quality: Number(e.currentTarget.value),
                                            } : item),
                                        })}
                                        value={strategy.quality}/>
                            价位:<input className={"border rounded-md mx-4 ps-2 w-20"}
                                        type="number"
                                        onChange={(e) => onChange?.({
                                            ...monitorConfig,
                                            strategies: monitorConfig.strategies.map(item => item.id === strategy.id ? {
                                                ...item,
                                                price: Number(e.currentTarget.value),
                                            } : item),
                                        })}
                                        value={strategy.price}/>
                            数量:<input className={"border rounded-md mx-4 ps-2 w-20"}
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
                                    className={"border w-6 h-6 bg-red-400 rounded-md text-white flex  items-center justify-center"}
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
    )
}