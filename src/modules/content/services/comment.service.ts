import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommentRepository, PostRepository } from "../repositories";
import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from "../dtos";
import { isNil } from "lodash";
import { EntityNotFoundError, In, SelectQueryBuilder } from "typeorm";
import { CommentEntity } from "../entities";
// import { treePaginate } from "@/modules/database/helpers";
import { BaseService } from "@/modules/database/base";


@Injectable()
export class CommentService extends BaseService<CommentEntity, CommentRepository>{
    constructor(protected repository: CommentRepository, protected postRepository: PostRepository) {
        super(repository);
    }

    /**
     * 直接查询评论树
     * @param options
     */
    async findTrees(options: QueryCommentTreeDto = {}) {
        // return this.repository.findTrees({
        //     addQuery: (qb) => {
        //         return isNil(options.post) ? qb : qb.where('post.id = :id', { id: options.post });
        //     },
        // });
        return this.repository.findTrees({
            addQuery: async (qb) => {
                return isNil(options.post) ? qb : qb.where('post.id = :id', { id: options.post });
            },
        });
    }

    /**
     * 查找一篇文章的评论并分页
     * @param options
     */
    async paginate(options: QueryCommentDto) {
        const { post } = options;
        const addQuery = (qb: SelectQueryBuilder<CommentEntity>) => {
            const condition: Record<string, string> = {};
            if (!isNil(post)) condition.post = post;
            return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
        };
        return super.paginate({
            ...options,
            addQuery,
        });
    }

    /**
     * 获取评论所属文章实例
     * @param id
     */
    protected async getPost(id: string) {
        return !isNil(id) ? this.postRepository.findOneOrFail({ where: { id } }) : id;
    }

    /**
     * 新增评论
     * @param data
     * @param user
     */
    async create(data: CreateCommentDto) {
        const parent = await this.getParent(undefined, data.parent);
        if (!isNil(parent) && parent.post.id !== data.post) {
            throw new ForbiddenException('Parent comment and child comment must belong same post!');
        }
        const item = await this.repository.save({
            ...data,
            parent,
            post: await this.getPost(data.post),
        });
        return this.repository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * 删除评论
     * @param id
     */
    async delete(ids: string[]) {
        // 单个删除
        // const comment = await this.repository.findOneOrFail({ where: { id: id ?? null } });
        // return this.repository.remove(comment);

        // 多个删除
        const comments = await this.repository.find({ where: { id: In(ids) } });
        return this.repository.remove(comments);
    }
    

    /**
     * 获取请求传入的父分类
     * @param current 当前分类的ID
     * @param id
     */
    protected async getParent(current?: string, id?: string) {
        if (current === id) return undefined;
        let parent: CommentEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.repository.findOne({
                relations: ['parent', 'post'],
                where: { id },
            });
            if (!parent) {
                throw new EntityNotFoundError(CommentEntity, `Parent comment ${id} not exists!`);
            }
        }
        return parent;
    }
}
