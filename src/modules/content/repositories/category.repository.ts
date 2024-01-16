import { CustomRepository } from "@/modules/database/decorators";
import { CategoryEntity } from "../entities";
import { BaseTreeRepository } from "@/modules/database/base";
import { OrderType } from "@/modules/database/constants";


@CustomRepository(CategoryEntity)
export class CategoryRespository extends BaseTreeRepository<CategoryEntity> {
   protected _qbName = 'category';

   protected orderBy = { name: 'customOrder', order: OrderType.ASC }
}