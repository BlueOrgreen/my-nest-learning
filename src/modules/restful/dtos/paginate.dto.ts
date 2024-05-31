import { Transform } from 'class-transformer';

import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { SelectTrashMode } from '@/modules/database/constants';
import { PaginateOptions } from '@/modules/database/types';

/**
 * 分页数据查询验证
 */
@DtoValidation({ type: 'query' })
export class PaginateDto implements PaginateOptions {
    /**
     * 当前页
     */
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page: number = 1;

    /**
     * 每页数据量
     */
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit: number = 10;
}

// src/modules/restful/dtos/paginate-width-trashed.dto.ts
/**
 * 带软删除的分页数据查询验证
 */
@DtoValidation({ type: 'query' })
export class PaginateWithTrashedDto extends PaginateDto {
    /**
     * 根据软删除状态查询
     */
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;
}
