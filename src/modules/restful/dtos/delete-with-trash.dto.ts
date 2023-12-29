import { DtoValidation } from "@/modules/core/decorators";
import { DeleteDto } from "./delete.dto";
import { toBoolean } from "@/modules/core/helpers";
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from "class-validator";



/**
 * 带软删除的批量删除验证
 */
@DtoValidation()
export class DeleteWithTrashDto extends DeleteDto {
    /**
     * 是否软删除
     */
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean
}

