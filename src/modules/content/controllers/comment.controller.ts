// import { AppIntercepter } from '@/modules/core/providers/app.interceptor';
import {
    Body,
    Controller,
    Delete,
    Get,
    // Param,
    // ParseUUIDPipe,
    // Patch,
    Post,
    Query,
    // UseInterceptors,
    ValidationPipe,
    SerializeOptions,
} from '@nestjs/common';
import { CommentService } from '../services';
import { CreateCommentDto, QueryCommentDto } from '../dtos';
import { DeleteDto } from '@/modules/restful/dtos';


// @UseInterceptors(AppIntercepter)
@Controller('comments')
export class CommentController {
    constructor(protected service: CommentService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['comment-tree'] })
    async tree(
        @Query(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        query: QueryCommentDto,
    ) {
        return this.service.findTrees(query);
    }

    @Get()
    @SerializeOptions({ groups: ['comment-list'] })
    async list(
        @Query(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        query: QueryCommentDto,
    ) {
        return this.service.paginate(query);
    }

    @Post()
    @SerializeOptions({ groups: ['comment-detail'] })
    async store(
        @Body()
        data: CreateCommentDto,
    ) {
        return this.service.create(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['comment-detail'] })
    async delete(
        @Body()
        data: DeleteDto,
    ) {
        const { ids } = data;
        return this.service.delete(ids);
    }
}