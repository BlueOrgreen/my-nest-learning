import { CustomRepository } from "@/modules/database/decorators";
import { CommentEntity } from "../entities";
import { SelectQueryBuilder, TreeRepository } from "typeorm";


@CustomRepository(CommentEntity)
export class CommentRepository extends TreeRepository<CommentEntity> {
    /**
     * 构建基础查询器
     */
    buildBaseQB(qb: SelectQueryBuilder<CommentEntity>): SelectQueryBuilder<CommentEntity> {
        return qb
            .leftJoinAndSelect(`comment.parent`, 'parent')
            .leftJoinAndSelect(`comment.post`, 'post')
            .orderBy('comment.createdAt', 'DESC');
    }
}

