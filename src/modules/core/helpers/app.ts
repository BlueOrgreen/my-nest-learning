import { Configure } from "@/modules/config/configure";
import { App, CreateOptions } from "../types";
import { BadGatewayException } from "@nestjs/common";
import { useContainer } from "class-validator";


export const createApp = (options: CreateOptions) => async (): Promise<App> => {
    const { config, builder } = options;
    // 设置app的配置中心实例
    const app: App = { configure: new Configure() };
    // 初始化配置实例
    await app.configure.initilize(config.factories, config.storage);
    // 如果没有app配置则使用默认配置
    if (!app.configure.has('app')) {
        throw new BadGatewayException('App config not exists!');
    }
    // 创建启动模块
    const BootModule = await createBootModule(app.configure, options);
    // 创建app的容器实例
    app.container = await builder({
        configure: app.configure,
        BootModule,
    });

    // 为class-validator添加容器以便在自定义约束中可以注入dataSource等依赖
    useContainer(app.container.select(BootModule), {
        fallbackOnErrors: true,
    });
    return app;
}