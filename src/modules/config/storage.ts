import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { ensureFileSync } from 'fs-extra';
import { has, isNil, omit, set } from 'lodash';
import YAML from 'yaml';

/**
 * 文件操作的 Storage 用于将 需要长期存储的配置存储到一个文件里
 * 一部分配置不需要通过数据库存取修改，提高应用配置
 */
export class Storage {
    /**
     * 是否开启存储配置功能
     */
    protected _enabled = false;

    /**
     * yaml文件配置路径
     */
    protected _path = resolve(__dirname, '../../..', 'config.yml');

    /**
     * 存储在yaml中的配置对象
     */
    protected _config: Record<string, any> = {};

    get enabled() {
        return this._enabled;
    }

    get path() {
        return this._path;
    }

    get config() {
        return this._config;
    }

    /**
     * 构造函数
     * @param enabled 是否开启存储配置功能
     * @param filePath 存盘配置存放的文件路径
     */
    constructor(enabled?: boolean, filePath?: string) {
        this._enabled = isNil(enabled) ? this._enabled : enabled;
        if (this._enabled) {
            if (!isNil(filePath)) this._path = filePath;
            ensureFileSync(this._path);
            const config = YAML.parse(readFileSync(this._path, 'utf8'));
            this._config = isNil(config) ? {} : config;
        }
    }

    /**
     * 设置存储配置
     * @param key
     * @param value
     */
    set<T>(key: string, value: T) {
        ensureFileSync(this.path);
        set(this._config, key, value);
        writeFileSync(this.path, YAML.stringify(this._config, null, 4));
    }

    /**
     * 删除存储配置
     * @param key
     */
    remove(key: string) {
        this._config = omit(this._config, [key]);
        if (has(this._config, key)) omit(this._config, [key]);
        writeFileSync(this.path, YAML.stringify(this._config, null, 4));
    }
}
