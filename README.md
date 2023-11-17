## 我的nest学习记录

参考资料 `3R/course`、 `yf/nestjs`

**nodea版本为: 18**


### 数据的验证和序列化

在`Nest`中流行的是通过 `class-validator` + `管道` 来进行数据验证; 验证后的数据才能通过 `controller` 对数据进行操作.
在数据处理后, 返回响应给前端时, 需要对数据进行序列化, 以确保规避一些不想暴露的敏感数据, `Nest` 通过 `class-transformer` + `拦截器` 来进行序列化

**Nestjs 中的Restful从请求到数据验证, 再到数据操作, 最后再到数据响应**
其流程为 请求 -> 守卫Guard进行权限检测, 没有权限则返回401 -> 管道 `Pipe` 进行数据验证, 验证失败返回 403/500等错误抛出 -> `Controller`接受, 接着会经过由`Provider` 提供的`Service`、`Repositories`等 返回数据 -> 最后是数据经过拦截器后得到响应的报文返回给客户端


### 数据关联与树形结构嵌套()

**需要注意的是，正如typeorm官网文档里说的一样，在定义反向关系的时候我们需要遵循以下规则**
- 多对多关联时，关联的一侧(比如这里的PostEntity的tags)必须加上@JoinTable装饰器
- 一对多关联时(反向关联为多对一)，两侧都不需要加任何东西,比如这里的PostEntity和TagEntity，PostEntity和CommentEntity
- 一对一关联时(本节课没用到)，关联的一侧必须要加上@JoinColumn装饰器