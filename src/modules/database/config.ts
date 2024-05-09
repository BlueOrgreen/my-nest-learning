import { toNumber } from 'lodash';

import { createConnectionOptions } from '../config/helpers';
import { ConfigureFactory, ConfigureRegister } from '../config/types';
import { deepMerge } from '../core/helpers';

import { DbConfig, DbOptions, TypeormOption } from './types';

/**
 * 创建数据库配置
 * @param options 自定义配置
 */
export const createDbOptions = (options: DbConfig) => {
    const newOptions: DbOptions = {
        common: deepMerge(
            {
                charset: 'utf8mb4',
                logging: ['error'],
            },
            options.common ?? {},
            'replace',
        ),
        connections: createConnectionOptions(options.connections ?? []),
    };
    newOptions.connections = newOptions.connections.map((connection) => {
        const entities = connection.entities ?? [];
        const newOption = { ...connection, entities };
        return deepMerge(
            newOptions.common,
            {
                ...newOption,
                autoLoadEntities: true,
            } as any,
            'replace',
        ) as TypeormOption;
    });
    return newOptions;
};

/**
 * 数据库配置结构器创建
 * @param register
 */
export const createDbConfig: (
    register: ConfigureRegister<RePartial<DbConfig>>,
) => ConfigureFactory<DbConfig, DbOptions> = (register) => ({
    register,
    hook: (configure, value) => createDbOptions(value),
    defaultRegister: () => ({
        common: {
            charset: 'utf8mb4',
            logging: ['error'],
        },
        connections: [],
    }),
});

export const database = createDbConfig((configure) => ({
    common: {
        synchronize: true,
    },
    connections: [
        {
            // 以下为mysql配置
            type: 'mysql',
            host: configure.env.get('DB_HOST', '127.0.0.1'),
            port: configure.env.get('DB_PORT', (v) => toNumber(v), 3306),
            username: configure.env.get('DB_USERNAME', 'root'),
            password: configure.env.get('DB_PASSWORD', '12345678'),
            database: configure.env.get('DB_NAME', 'my-nest-learning'),
            synchronize: true,
            autoLoadEntities: true,
        },
        // {
        // 以下为sqlite配置
        // type: 'better-sqlite3',
        // database: resolve(__dirname, configure.env.get('DB_PATH', '../../database.db')),
        // },
    ],
}));
