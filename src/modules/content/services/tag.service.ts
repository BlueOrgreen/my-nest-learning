import { Injectable } from "@nestjs/common";
import { TagRepository } from "../repositories";
import { CreateTagDto, QueryTagDto, UpdateTagDto } from "../dtos/tag.dto";
import { paginate } from "@/modules/database/helpers";
import { isNil, omit } from "lodash";
import { In, SelectQueryBuilder } from "typeorm";
import { SelectTrashMode } from "@/modules/database/constants";
import { QueryHook } from "@/modules/database/types";
import { TagEntity } from "../entities";



@Injectable()
export class TagService {
    constructor(protected repository: TagRepository) {}

    /**
     * 获取标签数据
     * @param options 分类选项
     * @param callback 添加额外的查询
     */
    async paginate(options: QueryTagDto, callback?: QueryHook<TagEntity>) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    /**
     * 查询单个标签信息
     * @param id
     * @param callback 添加额外的查询
     */
    async detail(id: string) {
        const qb = this.repository.buildBaseQB();
        qb.where(`tag.id = :id`, { id });
        return qb.getOneOrFail();
    }

    /**
     * 创建标签
     * @param data
     */
    async create(data: CreateTagDto) {
        const item = await this.repository.save(data);
        return this.detail(item.id);
    }

    /**
     * 更新标签
     * @param data
     */
    async update(data: UpdateTagDto) {
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }

     /**
     * 删除Tag
     * @param ids[]
     */
    async delete(ids: string[], trash: boolean) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true
        });
        if (trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt));
            const softs = items.filter((item) => isNil(item.deletedAt));
            return [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(softs))
            ]
        }
        return this.repository.remove(items);
    }

    /**
     * 恢复Tag  
     * @param ids[]
     */
    async restore(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true
        });
        // 过滤掉不在回收站中的数据
        const trasheds = items.filter((item) => !isNil(item.deletedAt)).map((it) => it.id);
        if(trasheds.length < 1) return []
        await this.repository.restore(trasheds);
        const qb = this.repository.buildBaseQB().where({ id: In(trasheds) });
        return qb.getMany();
    }

    /**
     * 构建Tag查询器
     */
    protected async buildListQuery(
        qb: SelectQueryBuilder<TagEntity>,
        options: Record<string, any>,
        callback?: QueryHook<TagEntity>,
    ) {
        const { trashed = SelectTrashMode.NONE } = options;
        // 是否查询回收站
        if (trashed === SelectTrashMode.ALL || SelectTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === SelectTrashMode.ONLY) qb.where(`tag.deletedAt is not null`);
        }
        if (callback) return callback(qb);
        qb.withDeleted();
        return qb;
    }
}
