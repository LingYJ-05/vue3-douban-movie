# 电影搜索API接口文档

## 项目背景说明
由于豆瓣电影API v2版本已经不可用，当前项目使用基于模拟数据的API实现来替代真实接口，确保页面能够正常展示电影内容。

## API文件位置
`src/api/movie-search.js`

## 可用API函数

### 1. movieSearch - 按关键词搜索电影

#### 函数签名
```javascript
movieSearch(query, start = 0, count = 10)
```

#### 参数说明
- `query`: (字符串) 搜索关键词，用于匹配电影标题或类型
- `start`: (数字，可选，默认0) 起始位置，用于分页
- `count`: (数字，可选，默认10) 返回结果数量

#### 返回数据格式
```javascript
{
  subjects: [ // 电影列表
    {
      id: 'string', // 电影ID
      title: 'string', // 电影标题
      subtype: 'movie', // 类型，固定为'movie'
      image: 'string', // 电影海报URL
      rating: { value: number }, // 评分
      pubdate: ['string'], // 上映日期
      genres: ['string'] // 电影类型
    },
    // ...更多电影项
  ],
  total: number, // 符合条件的电影总数
  start: number, // 起始位置
  count: number // 返回数量
}
```

#### 使用示例
```javascript
import { movieSearch } from '../api/movie-search';

// 搜索关键词为"肖申克"的电影
movieSearch('肖申克', 0, 10)
  .then(data => {
    console.log('搜索结果:', data.subjects);
    console.log('总数量:', data.total);
  })
  .catch(error => {
    console.error('搜索失败:', error);
  });
```

### 2. tagSearch - 按标签搜索电影

#### 函数签名
```javascript
tagSearch(tag, start = 0, count = 10)
```

#### 参数说明
- `tag`: (字符串) 标签名称，支持电影类型、国家、特殊标签等
- `start`: (数字，可选，默认0) 起始位置，用于分页
- `count`: (数字，可选，默认10) 返回结果数量

#### 返回数据格式
与`movieSearch`函数相同

#### 特殊标签处理
- 包含"经典"或"高分"的标签：返回按评分排序的电影
- 包含"冷门"的标签：返回后5部电影（模拟冷门电影）
- 其他标签：按类型或电影标题匹配

#### 使用示例
```javascript
import { tagSearch } from '../api/movie-search';

// 搜索剧情类型的电影
tagSearch('剧情', 0, 10)
  .then(data => {
    console.log('标签搜索结果:', data.subjects);
  });

// 搜索高分电影
tagSearch('豆瓣高分', 0, 5)
  .then(data => {
    console.log('高分电影:', data.subjects);
  });
```

## 模拟数据说明

### 包含的电影
当前模拟数据包含10部经典电影：
1. 肖申克的救赎 (9.7分)
2. 霸王别姬 (9.6分)
3. 阿甘正传 (9.5分)
4. 这个杀手不太冷 (9.4分)
5. 盗梦空间 (9.3分)
6. 泰坦尼克号 (9.2分)
7. 千与千寻 (9.4分)
8. 星际穿越 (9.4分)
9. 美丽人生 (9.6分)
10. 辛德勒的名单 (9.5分)

### 数据字段说明
每个电影对象包含以下字段：
- `id`: 电影在豆瓣的实际ID
- `title`: 电影中文名称
- `subtype`: 类型，统一为'movie'
- `image`: 电影海报URL（使用豆瓣真实图片）
- `rating`: 包含评分的对象
- `pubdate`: 上映日期数组
- `genres`: 电影类型数组

## 注意事项
1. 模拟API会模拟300ms的网络延迟
2. 搜索时不区分大小写
3. 标签搜索支持特殊标签（如"经典"、"高分"、"冷门"）
4. 所有API函数都返回Promise
5. 由于是模拟数据，实际搜索结果可能与真实情况有所不同

## 项目集成说明
项目中主要在以下位置使用这些API：
- `src/components/suggest/suggest.vue`: 用于显示搜索建议和电影列表
- `src/components/search/search.vue`: 处理搜索逻辑

## 未来扩展建议
1. 如果将来需要接入真实API，可以修改`movie-search.js`文件中的函数实现
2. 可以根据需要扩展模拟数据库，添加更多电影
3. 考虑添加电影详情页的模拟数据和API

## 更新记录
- 2023-xx-xx: 替换不可用的豆瓣API，实现基于模拟数据的API接口
- 2023-xx-xx: 优化搜索和标签筛选逻辑