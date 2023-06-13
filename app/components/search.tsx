'use_client'

import {MonitorConfigData} from "@/app/data/monitor-config";
import {FormEvent, useState} from "react";

type SearchProps = {
    dataList: MonitorConfigData[]
    onSelect: (selected: MonitorConfigData) => void;
}

export default function Search(props: SearchProps) {
    const [searchText, setSearchText] = useState("")
    const showItems = (searchText !== "") ? props.dataList.filter(item => item.name.indexOf(searchText) != -1) : []
    const [hoverItem, setHoverItem] = useState<MonitorConfigData>()
    return (
        <div className={""}>
            <input
                className={"border rounded-md w-full px-4 py-2"}
                type={"text"}
                placeholder={"在这里搜索想要添加的产品..."}
                value={searchText}
                onChange={(e: FormEvent<HTMLInputElement>) => {
                    setSearchText(e.currentTarget.value)
                }}
            />
            <ul className="absolute bg-white border rounded shadow-md divide-y group-hover:block">
                {
                    showItems.map(item => (
                        <li
                            key={item.id}
                            className={"px-4 py-2 hover:bg-gray-100"}
                            onMouseOver={(e) => setHoverItem(item)}
                            onMouseOut={(e) => setHoverItem(undefined)}
                            onClick={() => {
                                setSearchText("")
                                props.onSelect(item)
                            }}
                        >
                            <span className={
                                hoverItem && hoverItem.id === item.id ?
                                    "mx-2 text-red-400" :
                                    "mx-2"}>
                                {item.name}
                            </span>
                            <span className={
                                hoverItem && hoverItem.id === item.id ?
                                    "text-red-300" :
                                    "text-gray-400"
                            }>
                                {`re-${item.id}`}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}