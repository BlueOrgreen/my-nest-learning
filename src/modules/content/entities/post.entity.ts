import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    // DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Index,
    // JoinTable,
    // ManyToMany,
    // ManyToOne,
    // OneToMany,
    PrimaryColumn,
    Relation,
    // Relation,
    UpdateDateColumn,
} from 'typeorm';
import { PostBodyType } from '../constants';
import { CategoryEntity } from './category.entity';
import { TagEntity } from './tag.entity';
import { CommentEntity } from './comment.entity';

@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string;

    @Expose()
    @Column({ comment: '文章标题' })
    @Index({ fulltext: true })
    title: string;

    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'text' })
    @Index({ fulltext: true })
    body: string;

    // 修改PostEntity以支持against关键字的全文搜索，为需要支持全文搜索功能的字段添加上@Index({ fulltext: true })索引
    @Expose()
    @Column({ comment: '文章描述', nullable: true })
    @Index({ fulltext: true })
    summary?: string;

    @Expose()
    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Expose()
    @Column({
        comment: '文章类型',
        type: 'varchar',
        // 如果是mysql或者postgresql你可以使用enum类型
        // enum: PostBodyType,
        default: PostBodyType.MD,
    })
    type: PostBodyType;

    @Expose()
    @Column({
        comment: '发布时间',
        type: 'varchar',
        nullable: true,
    })
    publishedAt?: Date | null;

    @Expose()
    @Column({ comment: '自定义文章排序', default: 0 })
    customOrder: number;

    @Expose()
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;

    @Expose()
    @UpdateDateColumn({
        comment: '更新时间',
    })
    updatedAt: Date;

    /**
     * 通过queryBuilder生成的评论数量(虚拟字段)
     */
    @Expose()
    commentCount: number;

    @Expose()
    @ManyToOne(() => CategoryEntity, (category) => category.posts, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    category: Relation<CategoryEntity>
  
    @Expose()
    @ManyToMany(() => TagEntity, (tag) => tag.posts, {
        cascade: true,
    })
    @JoinTable()
    tags: Relation<TagEntity>[];

    @OneToMany(() => CommentEntity, (comment) => comment.post, {
        cascade: true
    })
    comments: Relation<CommentEntity>[]

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date;
}