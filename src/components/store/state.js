import { loadFromLocal } from '../../common/js/store';

// 使用handlers.ts中的mock数据作为默认值
const defaultMovies = [
  {
    id: '1292052',
    title: '肖申克的救赎',
    original_title: 'The Shawshank Redemption',
    directors: [{ id: '1054521', name: '弗兰克·德拉邦特' }],
    casts: [
      { id: '1054523', name: '蒂姆·罗宾斯' },
      { id: '1054524', name: '摩根·弗里曼' }
    ],
    collect_count: 123456,
    rating: { average: 9.7, max: 10, min: 0, stars: '45' },
    images: {
      large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
      medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
      small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
    },
    genres: ['剧情', '犯罪'],
    mainland_pubdate: '1994-09-10',
    pubdates: ['1994-09-10(中国大陆)', '1994-09-23(美国)'],
    year: '1994',
    durations: ['142分钟'],
    countries: ['美国'],
    aka: ['月黑高飞(港)', '刺激1995(台)']
  },
  {
    id: '1291546',
    title: '这个杀手不太冷',
    original_title: 'Léon',
    directors: [{ id: '1047973', name: '吕克·贝松' }],
    casts: [
      { id: '1022682', name: '让·雷诺' },
      { id: '1003045', name: '娜塔莉·波特曼' }
    ],
    collect_count: 112345,
    rating: { average: 9.5, max: 10, min: 0, stars: '45' },
    images: {
      large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
      medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
      small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg'
    },
    genres: ['剧情', '动作', '犯罪'],
    mainland_pubdate: '1994-09-14',
    pubdates: ['1994-09-14(中国大陆)', '1994-09-14(法国)'],
    year: '1994',
    durations: ['110分钟', '133分钟(国际版)'],
    countries: ['法国'],
    aka: ['杀手莱昂(港)', '终极追杀令(台)']
  }
];

const defaultCelebrities = [
  {
    id: '1054523',
    name: '蒂姆·罗宾斯',
    avatars: {
      small: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17526.jpg',
      medium: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17526.jpg',
      large: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17526.jpg'
    },
    gender: '男',
    birthday: '1958-10-16',
    constellation: '天秤座',
    born_place: '美国,加利福尼亚州,西科维纳',
    professions: ['演员', '导演', '制片人', '编剧']
  },
  {
    id: '1054524',
    name: '摩根·弗里曼',
    avatars: {
      small: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17522.jpg',
      medium: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17522.jpg',
      large: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17522.jpg'
    },
    gender: '男',
    birthday: '1937-06-01',
    constellation: '双子座',
    born_place: '美国,田纳西州,孟菲斯',
    professions: ['演员', '导演', '配音', '制片人']
  }
];

const state = {
  movie: {}, // 当前电影信息
  currentCelebrityId: 0,
  currentReviewId: 0,
  currentDiscussionType: '',
  searchHistory: loadFromLocal('search', 'history', []), // 搜索历史,每次刷新从缓存中读取
  watchedMovies: loadFromLocal('movie', 'watched', defaultMovies), // 看过的电影
  wantedMovies: loadFromLocal('movie', 'wanted', defaultMovies), // 想看的电影
  collectedCelebrities: loadFromLocal('celebrity', 'collected', defaultCelebrities), // 收藏的影人
  favoriteComments: loadFromLocal('comment', 'favorite', []) // 点赞的评论
};

export default state;
