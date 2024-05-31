export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';
/**
 * 软删除数据查询类型
 */
export enum SelectTrashMode {
    /**
     * 全部数据
     */
    ALL = 'all',
    /**
     * 只查询回收站中的
     */
    ONLY = 'only',
    /**
     * 只查询没有被软删除的
     */
    NONE = 'none',
}

/**
 * 文章排序类型
 */
export enum PostOrderType {
    /**
     * 最新创建
     */
    CREATED = 'createdAt',
    /**
     * 最近更新
     */
    UPDATED = 'updatedAt',
    /**
     * 最新发布
     */
    PUBLISHED = 'publishedAt',
    /**
     * 评论数量
     */
    COMMENTCOUNT = 'commentCount',
    /**
     * 自定义排序
     */
    CUSTOM = 'custom',
}

/**
 * 排序方式
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

/**
 * 树形模型在删除父级后子级的处理方式
 */
export enum TreeChildrenResolve {
    DELETE = 'delete',
    UP = 'up',
    ROOT = 'root',
}
