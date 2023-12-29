import { IsUUID, IsDefined } from "class-validator";
import { DtoValidation } from "@/modules/core/decorators";


/**
 * 批量恢复验证
 */
@DtoValidation()
export class RestoreDto {
    /**
     * 待恢复数据的ID列表·
     */
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误'
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定'
    })
    ids: string[];
}