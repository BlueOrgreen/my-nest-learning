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
    SerializeOptions,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators/depends.decorator';
import { DeleteWithTrashDto, RestoreDto } from '@/modules/restful/dtos';

import { ContentModule } from '../content.module';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos/post.dto';
import { PostService } from '../services/post.service';

// @UseInterceptors(AppIntercepter)
@ApiTags('文章操作')
@Depends(ContentModule)
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(
        @Query()
        options: QueryPostDto,
    ) {
        return this.service.paginate(options);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
    async store(
        @Body()
        data: CreatePostDto,
    ) {
        return this.service.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    async update(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.service.update(data);
    }

    @Delete()
    @SerializeOptions({ groups: ['post-list'] })
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data;
        return this.service.delete(ids, trash);
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['post-list'] })
    async restore(
        @Body()
        data: RestoreDto,
    ) {
        const { ids } = data;
        return this.service.restore(ids);
    }
}
