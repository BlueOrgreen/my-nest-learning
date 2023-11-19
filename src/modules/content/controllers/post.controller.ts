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
import { PostService } from '../services/post.service';
import { CreatePostDto, QueryPostDto } from '../dtos/post.dto';

// @UseInterceptors(AppIntercepter)
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(
        @Query()
        options: QueryPostDto,
    ) {
        console.log('获取文章列表', options);
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
        console.log('创建文章', data);
        return this.service.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    async update(
        @Body()
        data: Record<string, any>,
    ) {
        return this.service.update(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['post-list'] })
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.delete(id);
    }

    // @Patch('restore')
    // @SerializeOptions({ groups: ['post-list'] })
    // async restore(
    //     @Body()
    //     data: RestoreDto,
    // ) {
    //     const { ids } = data;
    //     return this.service.restore(ids);
    // }
}
