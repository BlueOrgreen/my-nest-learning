import { DynamicModule, Module, Type, Provider, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { Configure } from '../config/configure';

import { panic } from '../core/types';

import { CUSTOM_REPOSITORY_METADATA } from './constants';
import {
    DataExistConstraint,
    UniqueConstraint,
    UniqueExistContraint,
    UniqueTreeConstraint,
    UniqueTreeExistConstraint,
} from './constraints';

import { DbOptions } from './types';

@Module({})
export class DatabaseModule {
    // static forRoot(configRegister: () => TypeOrmModuleOptions): DynamicModule {
    //     return {
    //         global: true,
    //         module: DatabaseModule,
    //         imports: [TypeOrmModule.forRoot(configRegister())],
    //     };
    // }
    // static async forRoot(configure: Configure) {
    //     if (!configure.has('database')) {
    //         panic({ message: 'Database config not exists or not right!' });
    //     }
    //     const { connections } = await configure.get<DbOptions>('database');
    //     const imports: ModuleMetadata['imports'] = [];
    //     for (const dbOption of connections) {
    //         imports.push(TypeOrmModule.forRoot(dbOption as TypeOrmModuleOptions));
    //     }
    //     const providers: ModuleMetadata['providers'] = [
    //         AutoMigrate,
    //         DataExistConstraint,
    //         UniqueConstraint,
    //         UniqueExistContraint,
    //         UniqueTreeConstraint,
    //         UniqueTreeExistConstraint,
    //     ];

    //     return {
    //         global: true,
    //         module: DatabaseModule,
    //         imports,
    //         providers,
    //     };
    // }

    // 把需要使用configure实例拿配置的几个模块(配置模块除外)的forRoot全部改成异步执行
    static async forRoot(configure: Configure) {
        if (!configure.has('database')) {
            panic({ message: 'Database config not exists or not right!' });
        }
        const { connections } = await configure.get<DbOptions>('database');
        const imports: ModuleMetadata['imports'] = [];
        console.log('connections===>', connections);

        for (const dbOption of connections) {
            imports.push(TypeOrmModule.forRoot(dbOption as TypeOrmModuleOptions));
        }
        const providers: ModuleMetadata['providers'] = [
            DataExistConstraint,
            UniqueConstraint,
            UniqueExistContraint,
            UniqueTreeConstraint,
            UniqueTreeExistConstraint,
        ];

        return {
            global: true,
            module: DatabaseModule,
            imports,
            providers,
        };
    }

    static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];

        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): InstanceType<typeof Repo> => {
                    const base = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: DatabaseModule,
            providers,
        };
    }
}
