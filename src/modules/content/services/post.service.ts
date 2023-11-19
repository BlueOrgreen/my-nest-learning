import { Injectable } from '@nestjs/common';
import { EntityNotFoundError, In, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import { CategoryRespository, PostRepository, TagRepository } from '../repositories';
import { PaginateOptions, QueryHook } from '../../database/types';
import { PostEntity } from '../entities';
import { PostOrderType } from '../constants';
import { isArray, isFunction, isNil, omit } from 'lodash';
import { paginate } from '@/modules/database/helpers';
import { CategoryService } from './category.service';
import { CreatePostDto } from '../dtos';


@Injectable()
export class PostService {
    constructor(
        protected repository: PostRepository,
        protected categoryRepository: CategoryRespository,
        protected categoryService: CategoryService,
        protected tagRepository: TagRepository,
    ) {}

    /**
     * 获取分页数据
     * @param options 分页选项
     * @param callback 添加额外的查询
     */
    async paginate(options: PaginateOptions, callback?: QueryHook<PostEntity>) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    /**
     * 查询单篇文章
     * @param id
     * @param callback 添加额外的查询
     */
    async detail(id: string, callback?: QueryHook<PostEntity>) {
        let qb = this.repository.buildBaseQB();
       qb.where(`post.id = :id`, { id });
       qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
       const item = await qb.getOne();
       if (!item) throw new EntityNotFoundError(PostEntity, `The post ${id} not exists!`);
       return item;
   }

    /**
     * 创建文章
     * @param data
     */
    // async create(data: Record<string, any>) {
    //     const item = await this.repository.save(data);
    //     return this.detail(item.id);
    // }
    async create(data: CreatePostDto) {
        const createPostDto = {
            ...data,
            // 文章所属分类
            // 在创建新文章时，如果有传入的关联分类ID数组，
            // 则把这些关联分类给查询出来并给文章实例设置一下
            category: !isNil(data.category)
                ? await this.categoryRepository.findOneOrFail({ where: { id: data.category } })
                : null,
            // 文章关联的标签
            tags: isArray(data.tags)
                ? await this.tagRepository.findBy({
                      id: In(data.tags),
                  })
                : [],
            };
        const item = await this.repository.save(createPostDto);
        return this.detail(item.id);
    }


    /**
     * 更新文章
     * @param data
     */
    async update(data: Record<string, any>) {
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }


    /**
     * 删除文章
     * @param id
     */
    async delete(id: string) {
        const item = await this.repository.findOneByOrFail({ id });
        return this.repository.remove(item);
    }

    /**
     * 构建文章列表查询器
     * @param qb 初始查询构造器
     * @param options 排查分页选项后的查询选项
     * @param callback 添加额外的查询
     */
    protected async buildListQuery(
        qb: SelectQueryBuilder<PostEntity>,
        options: Record<string, any>,
        callback?: QueryHook<PostEntity>,
    ) {
        const { category, orderBy, isPublished, tag } = options;
        let newQb = qb;
        if (typeof isPublished === 'boolean') {
            newQb = isPublished
                ? newQb.where({
                      publishedAt: Not(IsNull()),
                  })
                : newQb.where({
                      publishedAt: IsNull(),
                  });
        }
        this.queryOrderBy(qb, orderBy);
        if (category) await this.queryByCategory(category, qb);
        // 查询某个标签关联的文章
        if (tag) qb.where('tags.id = :id', { id: tag });
        if (callback) return callback(qb);
        return newQb;
    }

    /**
     *  对文章进行排序的Query构建
     * @param qb
     * @param orderBy 排序方式
     */
    protected queryOrderBy(qb: SelectQueryBuilder<PostEntity>, orderBy?: PostOrderType) {
        switch (orderBy) {
            case PostOrderType.CREATED:
                return qb.orderBy('post.createdAt', 'DESC');
            case PostOrderType.UPDATED:
                return qb.orderBy('post.updatedAt', 'DESC');
            case PostOrderType.PUBLISHED:
                return qb.orderBy('post.publishedAt', 'DESC');
            case PostOrderType.CUSTOM:
                return qb.orderBy('customOrder', 'DESC');
            default:
                return qb
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC');
        }
    }


    /**
     * 查询出分类及其后代分类下的所有文章的Query构建
     * @param id
     * @param qb
     */
    protected async queryByCategory(id: string, qb: SelectQueryBuilder<PostEntity>) {
        const root = await this.categoryService.detail(id);
        const tree = await this.categoryRepository.findDescendantsTree(root);
        const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
        const ids = [tree.id, ...flatDes.map((item) => item.id)];
        return qb.where('category.id IN (:...ids)', {
            ids,
        });
    }

}