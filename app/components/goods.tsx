import Image from "next/image";
import {MonitorConfigItem} from "@/app/data/monitor-config";


export default function Goods(props: MonitorConfigItem) {

    return (
        <>
            <span>{props.id}</span>
            <Image src={""} alt={""} />
            <span>{props.name}</span>
            预期品质:<input type="number" value={props.quality}/>
            预期价位:<input type="number" value={props.price}/>
            预期数量:<input type="number" value={props.count}/>
        </>
    )
}