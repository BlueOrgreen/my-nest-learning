import { ConfigureFactory, ConfigureRegister } from '../config/types';

export type SearchType = 'mysql' | 'like' | 'against' | 'meilli';
export interface ContentConfig {
    searchType?: SearchType;
    htmlEnabled: boolean;
}

export const defaultContentConfig: ContentConfig = {
    searchType: 'mysql',
    htmlEnabled: false,
};

// 为内容模块编写一个配置构造器创建函数
export const createContentConfig: (
    register: ConfigureRegister<RePartial<ContentConfig>>,
) => ConfigureFactory<ContentConfig> = (register) => ({
    register,
    defaultRegister: () => defaultContentConfig,
});
