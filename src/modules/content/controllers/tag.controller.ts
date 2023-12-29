import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    // UseInterceptors,
    ValidationPipe,
    SerializeOptions,
} from '@nestjs/common';
import { TagService } from '../services';
import { CreateTagDto, QueryTagDto, UpdateTagDto } from '../dtos';
import { DeleteWithTrashDto, RestoreDto } from '@/modules/restful/dtos';

// @UseInterceptors(AppIntercepter)
@Controller('tags')
export class TagController {
    constructor(protected service: TagService) {}

    @Get()
    @SerializeOptions({ groups: ['tag-list'] })
    async list(
        @Query()
        options: QueryTagDto,
    ) {
        return this.service.paginate(options);
    }

    @Get(':id')
    @SerializeOptions({})
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    @Post()
    @SerializeOptions({})
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['create'],
            }),
        )
        data: CreateTagDto,
    ) {
        return this.service.create(data);
    }

    @Patch()
    @SerializeOptions({})
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdateTagDto,
    ) {
        return this.service.update(data);
    }

    @Delete()
    @SerializeOptions({ groups: ['tag-list'] })
    async delete(
        @Body()
        data: DeleteWithTrashDto
    ) {
        const { ids, trash } = data;
        return this.service.delete(ids, trash);
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['tag-list'] })
    async restore(
        @Body()
        data: RestoreDto
    ) {
        const { ids } = data;
        return this.service.restore(ids);
    }
}