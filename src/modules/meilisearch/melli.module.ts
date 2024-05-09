import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';
import { panic } from '../core/types';

import { MeilliService } from './meilli.service';

@Module({})
export class MeilliModule {
    // static forRoot(configRegister: () => MelliConfig): DynamicModule {
    //     return {
    //         global: true,
    //         module: MeilliModule,
    //         providers: [
    //             {
    //                 provide: MeilliService,
    //                 useFactory: async () => {
    //                     const service = new MeilliService(
    //                         await createMeilliOptions(configRegister()),
    //                     );
    //                     service.createClients();
    //                     return service;
    //                 },
    //             },
    //         ],
    //         exports: [MeilliService],
    //     };
    // }
    static async forRoot(configure: Configure) {
        if (!configure.has('meilli')) {
            panic({ message: 'MeilliSearch config not exists or not right!' });
        }
        return {
            global: true,
            module: MeilliModule,
            providers: [
                {
                    provide: MeilliService,
                    useFactory: async () => {
                        const service = new MeilliService(await configure.get('meilli'));
                        service.createClients();
                        return service;
                    },
                },
            ],
            exports: [MeilliService],
        };
    }
}
