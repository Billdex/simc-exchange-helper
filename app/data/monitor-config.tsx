// 监控商品配置项
export declare type MonitorConfigData = {
    id: number,         // 商品 id，与游戏内对应
    name: string,       // 商品名称
    name_en: string,    // 商品名称（英文）
    strategies: MonitorStrategy[] // 策略组
}

// 监控策略
export declare type MonitorStrategy = {
    id: string,         // 策略 id, 由 nanoid 生成
    quality: number,    // 商品品质等级
    price: number,      // 最高价格
    count: number,      // 符合条件的最低数量
}