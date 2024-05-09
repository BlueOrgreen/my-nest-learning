// import { resolve } from 'path';

import { toNumber } from 'lodash';

import { createDbConfig } from '@/modules/database/config';

// export const database = (): TypeOrmModuleOptions => ({
//     // 以下为mysql配置
//     charset: 'utf8mb4',
//     logging: ['error'],
//     type: 'mysql',
//     host: '127.0.0.1',
//     port: 3306,
//     username: 'root',
//     password: '12345678',
//     database: 'my-nest-learning',
//     // 以下为sqlite配置
//     // type: 'better-sqlite3',
//     // database: resolve(__dirname, '../../back/database6.db'),
//     synchronize: true,
//     autoLoadEntities: true,
// });

export const database = createDbConfig((configure) => ({
    common: {
        synchronize: true,
    },
    connections: [
        {
            // 以下为mysql配置
            charset: 'utf8mb4',
            logging: ['error'],
            type: 'mysql',
            host: configure.env.get('DB_HOST', '127.0.0.1'),
            port: configure.env.get('DB_PORT', (v) => toNumber(v), 3306),
            username: configure.env.get('DB_USERNAME', 'root'),
            password: configure.env.get('DB_PASSWORD', '12345678'),
            database: 'my-nest-learning',
            // 以下为sqlite配置
            // type: 'better-sqlite3',
            // database: resolve(__dirname, '../../back/database6.db'),
            synchronize: true,
            autoLoadEntities: true,
        },
    ],
}));
