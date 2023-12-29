import { MeilliService } from "@/modules/meilisearch/meilli.service";
import { ForbiddenException, Injectable } from "@nestjs/common";
import MeiliSearch from "meilisearch";
import { CategoryRespository, CommentRepository } from "../repositories";
import { isNil } from "lodash";
import { SelectTrashMode } from "@/modules/database/constants";

interface SearchOption {
    trashed?: SelectTrashMode;
    isPublished?: boolean;
    page?: number;
    limit?: number;
}


@Injectable()
export class SearchService {
    index = 'content';

    protected _client: MeiliSearch;

    constructor(
        protected meilliService: MeilliService,
        protected categoryRepository: CategoryRespository,
        protected commentRepository: CommentRepository,
    ) {
        this._client = this.meilliService.getClient();
    }

    get client() {
        if (isNil(this._client)) throw new ForbiddenException('Has not any meilli search client!');
        return this._client;
    }

    async search(text: string, param: SearchOption = {}) {
        await this.client.index(this.index).addDocuments([]);
        this.client.index(this.index).updateFilterableAttributes(['deletedAt', 'publishedAt']);
        this.client.index(this.index).updateSortableAttributes(['updatedAt', 'commentCount']);
    }
}