import { DynamicModule, Module, Type, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from './constants';

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
