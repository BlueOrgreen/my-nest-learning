import { MelliConfig } from "./types";

// 辅助函数用于根据传入的配置生成最终提供给MeilliService的配置，主要目的是判断默认(default)节点
export const createMeilliOptions = async (
    config: MelliConfig
): Promise<MelliConfig | undefined> => {
    if (config.length <= 0) return config;
    let options: MelliConfig = [...config];
    const names = options.map(({ name }) => name);
    if (!names.includes('default')) options[0].name = 'default';
    else if (names.filter((name) => name === 'default').length > 0) {
        options = options.reduce(
            (o, n) => (o.map(({ name }) => name).includes('default') ? o : [...o, n]),
            [],
        );
    }
    return options;
}