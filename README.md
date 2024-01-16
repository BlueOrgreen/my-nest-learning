## 我的nest学习记录

参考资料 `3R/course`、 `yf/nestjs`

### interview
结合了`OOP`
在底层还是基于 `Express`和`Fastify`, 网上进行抽象 

**Nestjs 中的Restful从请求到数据验证, 再到数据操作, 最后再到数据响应**
**nest应用的执行流程** 其流程为 请求 -> 守卫Guard进行权限检测, 没有权限则返回401 -> 管道 `Pipe` 进行数据验证, 验证失败返回 403/500等错误抛出 -> `Controller`接受, 接着会经过由`Provider` 提供的`Service`、`Repositories`等 返回数据 -> 最后是数据经过拦截器后得到响应的报文返回给客户端

**Module**
nest的代码组织是以`Module`为单位的, 使用多个模块来组织代码结构

**Controller**
使用 `@controller()` 来指定控制器, 控制器的请求方法 `@Get`、`@Post`、`@Patch`、`@Put`、`@Delete`、`@Options`、`@Head`自定义请求头 用于下载、导出excel文件

**dto与数据验证**
`dto`用于对请求的数据结构定义一个类 用于aop编程, 常用于对`body`、`query`等请求数据进行验证 常用的数据验证的库是`class-validator`,
- 对于`body`、`query`使用 dto + ValidationPipe来验证
- 对于`param` 使用 ParseUUIDPipe来进行验证

**提供者**
在nestjs中如果要使一个类变成提供者，需要在其顶部添加@Injectale()装饰器; 
创建完提供者后应把提供者类放到模块的providers数组中以注册; 
可以在控制器中通过依赖注入的方式使用该服务了，比如通过constructor注入;
如果两个提供者之间互相依赖，可以通过注入forwardRef来实现

**全局模块**
静态模块通过@Global()装饰器启用为全局模块，动态模块使用isGlobal:true启用全局模块
全局模块启用后，只要在中心模块AppModule导入，其它模块就能使用

### 环境与分支
**nodea版本为: 18**

- main 分支为主分支 沿着课程往下学
- content 分支为内容分支 主要整合了 controller、service、entity、respository content 没有整合数据代码抽象化
- abstract 整合了数据代码抽象化的CRUD框架


### 数据的验证和序列化

在`Nest`中流行的是通过 `class-validator` + `管道` 来进行数据验证; 验证后的数据才能通过 `controller` 对数据进行操作.
在数据处理后, 返回响应给前端时, 需要对数据进行序列化, 以确保规避一些不想暴露的敏感数据, `Nest` 通过 `class-transformer` + `拦截器` 来进行序列化


### 数据关联与树形结构嵌套()

**需要注意的是，正如typeorm官网文档里说的一样，在定义反向关系的时候我们需要遵循以下规则**
- 多对多关联时，关联的一侧(比如这里的PostEntity的tags)必须加上@JoinTable装饰器
- 一对多关联时(反向关联为多对一)，两侧都不需要加任何东西,比如这里的PostEntity和TagEntity，PostEntity和CommentEntity
- 一对一关联时(本节课没用到)，关联的一侧必须要加上@JoinColumn装饰器






### 对课程代码执行数据迁移并初始化

```shell
pnpm cli dbmr
pnpm cli dbs -i

访问 http://127.0.0.1:3100/api/docs-json
将该url导入 Insomnia 中
点击collection 即可看到 接口文档已经导入

设置 Base Environment 添加变量
{
    "base_url": "http://127.0.0.1:3100"
    "bearerToken": "xxx"
}
```