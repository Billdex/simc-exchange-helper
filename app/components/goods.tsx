import Image from "next/image";
import {MonitorConfigItem} from "@/app/data/monitor-config";


export default function Goods(props: MonitorConfigItem) {
    return (
        <>
            <span className={"inline-block w-16"}>{`re-${props.id}`}</span>
            <Image
                className={"inline-block"}
                src={`https://d1fxy698ilbz6u.cloudfront.net/static/images/resources/${props.name_en.replaceAll(" ", "-").toLowerCase()}.png`}
                alt={props.name_en}
                width={50}
                height={50}
            />
            <span className={"inline-block mx-4 w-28"}>{props.name}</span>
            预期品质:<input className={"border mx-4 w-36"} type="number" value={props.quality}/>
            预期价位:<input className={"border mx-4 w-36"} type="number" value={props.price}/>
            预期数量:<input className={"border mx-4 w-36"} type="number" value={props.count}/>
        </>
    )
}