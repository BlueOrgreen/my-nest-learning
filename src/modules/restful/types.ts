import { Type } from '@nestjs/common';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * 标签选项
 */
export interface TagOption {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}

/**
 * 总配置,版本,路由中用于swagger的选项
 */
export interface ApiDocSource {
    title?: string;
    description?: string;
    auth?: boolean;
    tags?: (string | TagOption)[];
}

// VersionOption是版本配置类型，版本类型继承ApiDocSource类型，所以每个版本也可以拥有自己的文档配置，
// 而routes则是路由集列表 RouteOption是路由集配置，也可以配置自己的Swagger文档选项
// name: 用于指定当前路由集的名称
// path: 指定当前路由集的路径前缀，由于我们支持嵌套路由，所以这个是总前缀
// controllers：指定控制器列表
// children: 用于指定嵌套的子路由集
// doc: 用于指定路由集的Swagger文档配置

/**
 * 路由配置
 */
export interface RouteOption {
    name: string;
    path: string;
    controllers: Type<any>[];
    children?: RouteOption[];
    doc?: ApiDocSource;
}

/**
 * 版本配置
 */
export interface VersionOption extends ApiDocSource {
    routes?: RouteOption[];
}

/**
 * API配置
 */
// ApiConfig就是我们整个路由系统（即RestfulModule）的配置，其继承自ApiDocSource
export interface ApiConfig extends ApiDocSource {
    docuri?: string; // 用于指定Open API的文档前缀，比如api/docs
    default: string; // 用于指定默认的API版本
    enabled: string[]; // 用于指定启用的版本号列表，其中默认版本无需再加入该数组
    versions: Record<string, VersionOption>; // 每个API版本的具体配置
}

/**
 * swagger选项
 */
export interface SwaggerOption extends ApiDocSource {
    version: string;
    path: string;
    // 该文档包含的路由模块
    include: Type<any>[];
}

/**
 * API与swagger整合的选项
 */
export interface ApiDocOption {
    default?: SwaggerOption;
    routes?: { [key: string]: SwaggerOption };
}
