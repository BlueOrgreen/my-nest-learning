import { ModuleMetadata, Type, PipeTransform } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import chalk from 'chalk';

import { isNil } from 'lodash';

import { CommandModule } from 'yargs';

import { Configure } from '../config/configure';
import { ConfigStorageOption, ConfigureFactory } from '../config/types';

export type App = {
    // 应用容器实例
    container?: NestFastifyApplication;
    // 配置类实例
    configure: Configure;
    /**
     * 命令列表
     */
    commands: CommandModule<RecordAny, RecordAny>[];
};

/**
 * 应用构建器
 */
export interface ContainerBuilder {
    (params: { configure: Configure; BootModule: Type<any> }): Promise<NestFastifyApplication>;
}

/**
 * 创建应用的选项参数
 */
export interface CreateOptions {
    /**
     * 返回值为需要导入的模块
     */
    modules: (configure: Configure) => Promise<Required<ModuleMetadata['imports']>>;
    /**
     * 应用构建器
     */
    builder: ContainerBuilder;
    /**
     * 全局配置
     */
    globals?: {
        /**
         * 全局管道,默认为AppPipe,设置为null则不添加
         * @param params
         */
        pipe?: (configure: Configure) => PipeTransform<any> | null;
        /**
         * 全局拦截器,默认为AppInterceptor,设置为null则不添加
         */
        interceptor?: Type<any> | null;
        /**
         * 全局过滤器,默认AppFilter,设置为null则不添加
         */
        filter?: Type<any> | null;
    };
    providers?: ModuleMetadata['providers'];
    /**
     * 配置选项
     */
    config: {
        /**
         * 初始配置集
         */
        factories: Record<string, ConfigureFactory<Record<string, any>>>;
        /**
         * 配置服务的动态存储选项
         */
        storage: ConfigStorageOption;
    };
    commands: () => CommandCollection;
}

/**
 * 应用配置
 */
export interface AppConfig {
    /**
     * App名称
     */
    name: string;
    /**
     * 主机地址,默认为127.0.0.1
     */
    host: string;
    /**
     * 监听端口,默认3100
     */
    port: number;
    /**
     * 是否开启https,默认false
     */
    https: boolean;
    /**
     * 语言,默认zh-cn
     */
    locale: string;
    /**
     * 备用语言
     */
    fallbackLocale: string;
    /**
     * 控制台打印的url,默认自动生成
     */
    url?: string;
    /**
     * 由url+api前缀生成的基础api url
     */
    prefix?: string;
}

/**
 * 控制台错误函数panic的选项参数
 */
export interface PanicOption {
    /**
     * 报错消息
     */
    message: string;
    /**
     * 抛出的异常信息
     */
    error?: any;
    /**
     * 是否退出进程
     */
    exit?: boolean;
}

/**
 * 输出命令行错误消息
 * @param option
 */
export async function panic(option: PanicOption | string) {
    console.log();
    if (typeof option === 'string') {
        console.log(chalk.red(`\n❌ ${option}`));
        process.exit(1);
    }
    const { error, message, exit = true } = option;
    !isNil(error) ? console.log(chalk.red(error)) : console.log(chalk.red(`\n❌ ${message}`));
    if (exit) process.exit(1);
}

// 因为在命令中需要启动一个nestjs实例，对于一些即时运行的命令，比如数据迁移等，
// 需要在运行后退出进程。否则，虽然就算实例关闭了，命令窗口还会卡在那边，因为进程没有结束掉
export interface CommandOption<T extends RecordAny, U = RecordAny> extends CommandModule<T, U> {
    /**
     * 是否执行后即退出进程的瞬时应用
     */
    instant?: boolean;
}

export type CommandItem<T = Record<string, any>, U = Record<string, any>> = (
    app: Required<App>,
) => Promise<CommandOption<T, U>>;

export type CommandCollection = Array<CommandItem>;
