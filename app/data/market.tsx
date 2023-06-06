export declare type GoodsExchangeItem = {
    id: number,                           // 交易信息 id
    kind: number,                       // 商品 id
    quantity: number,                   // 数量
    quality: number,                    // 品质
    price: number,                      // 价格
    seller: GoodsExchangeSellerInfo,    // 卖家信息
    posted: string,                     // 发布时间
    fees: number,                       // 手续费
}

export declare type GoodsExchangeSellerInfo = {
    id: number,
    company: string,
    realmId: number,
    logo: string,
    certificates: number,
    contest_wins: number,
    npc: boolean,
    ip: string
}