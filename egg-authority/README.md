# egg-authority

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org

### 问题

- 1.as 重命名的字段无法使用 get 方法改变值
- 2.如何给查出来的 model 增加新属性
- 3.事务失效？
- 4.如何把联查里的属性放在外层
- 5.如何处理不必穿参数