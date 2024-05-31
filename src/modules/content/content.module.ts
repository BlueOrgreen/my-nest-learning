import { ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Configure } from '../config/configure';
import { DatabaseModule } from '../database/database.module';

import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';
import { PostService } from './services';
import { SanitizeService } from './services/sanitize.service';
import { SearchService } from './services/search.service';
import { PostSubscriber } from './subscribers';
import { ContentConfig, defaultContentConfig } from './types';

// @Module({
//     imports: [
//         TypeOrmModule.forFeature(Object.values(entities)),
//         DatabaseModule.forRepository(Object.values(repositories)),
//     ],
//     controllers: Object.values(controllers),
//     providers: [...Object.values(services), SanitizeService, PostSubscriber],
//     exports: [...Object.values(services), DatabaseModule.forRepository(Object.values(repositories))],
// })
export class ContentModule {
    // static forRoot(configRegister?: () => ContentConfig): DynamicModule {
    //     const config: Required<ContentConfig> = {
    //         searchType: 'against',
    //         ...(configRegister ? configRegister() : {}),
    //     };
    //     const providers: ModuleMetadata['providers'] = [
    //         ...Object.values(services),
    //         SanitizeService,
    //         PostSubscriber,
    //         {
    //             provide: PostService,
    //             inject: [
    //                 repositories.PostRepository,
    //                 repositories.CategoryRespository,
    //                 services.CategoryService,
    //                 repositories.TagRepository,
    //                 { token: services.SearchService, optional: true },
    //             ],
    //             useFactory(
    //                 postRepository: repositories.PostRepository,
    //                 categoryRepository: repositories.CategoryRespository,
    //                 categoryService: services.CategoryService,
    //                 tagRepository: repositories.TagRepository,
    //                 searchService: services.SearchService,
    //             ) {
    //                 return new PostService(
    //                     postRepository,
    //                     categoryRepository,
    //                     categoryService,
    //                     tagRepository,
    //                     searchService,
    //                     config.searchType,
    //                 );
    //             },
    //         },
    //     ];
    //     if (config.searchType === 'meilli') providers.push(services.SearchService);

    //     return {
    //         module: ContentModule,
    //         imports: [
    //             TypeOrmModule.forFeature(Object.values(entities)),
    //             DatabaseModule.forRepository(Object.values(repositories)),
    //         ],
    //         controllers: Object.values(controllers),
    //         providers,
    //         exports: [
    //             ...Object.values(services),
    //             PostService,
    //             DatabaseModule.forRepository(Object.values(repositories)),
    //         ],
    //     };
    // }

    static async forRoot(configure: Configure) {
        const config = await configure.get<ContentConfig>('content', defaultContentConfig);

        const providers: ModuleMetadata['providers'] = [
            ...Object.values(services),
            SanitizeService,
            PostSubscriber,
            {
                provide: PostService,
                inject: [
                    repositories.PostRepository,
                    repositories.CategoryRespository,
                    services.CategoryService,
                    repositories.TagRepository,
                    { token: services.SearchService, optional: true },
                ],
                useFactory(
                    postRepository: repositories.PostRepository,
                    categoryRepository: repositories.CategoryRespository,
                    categoryService: services.CategoryService,
                    tagRepository: repositories.TagRepository,
                    searchService: services.SearchService,
                ) {
                    return new PostService(
                        postRepository,
                        categoryRepository,
                        categoryService,
                        tagRepository,
                        searchService,
                        config.searchType,
                    );
                },
            },
        ];

        const exports: ModuleMetadata['exports'] = [
            ...Object.values(services),
            PostService,
            DatabaseModule.forRepository(Object.values(repositories)),
        ];

        if (config.htmlEnabled) {
            providers.push(SanitizeService);
            exports.push(SanitizeService);
        }

        if (config.searchType === 'meilli') {
            providers.push(SearchService);
            exports.push(SearchService);
        }

        return {
            module: ContentModule,
            imports: [
                TypeOrmModule.forFeature(Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            // controllers: Object.values(controllers),
            providers,
            exports,
        };
    }
}
