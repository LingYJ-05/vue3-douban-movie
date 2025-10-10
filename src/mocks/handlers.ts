// handlers.js
import { http, HttpResponse } from 'msw';

// 新增：模拟标签搜索电影的数据
const tagSearchData = [
  {
    rating: {
      max: 10,
      average: 8.5,
      min: 0
    },
    genres: ["科幻", "冒险"],
    title: "流浪地球2",
    casts: [
      {
        name: "吴京",
        id: "1044706"
      },
      {
        name: "刘德华",
        id: "1044707"
      }
    ],
    directors: [
      {
        name: "郭帆",
        id: "1027143"
      }
    ],
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658539.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658539.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658539.jpg"
    },
    alt: "https://movie.douban.com/subject/35215179/",
    id: "35215179",
    mobile_url: "https://m.douban.com/movie/subject/35215179/"
  },
  {
    rating: {
      max: 10,
      average: 8.8,
      min: 0
    },
    genres: ["科幻", "动作"],
    title: "阿凡达：水之道",
    casts: [
      {
        name: "萨姆·沃辛顿",
        id: "1000001"
      },
      {
        name: "佐伊·索尔达娜",
        id: "1000002"
      }
    ],
    directors: [
      {
        name: "詹姆斯·卡梅隆",
        id: "1000003"
      }
    ],
    year: "2022",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg"
    },
    alt: "https://movie.douban.com/subject/35215167/",
    id: "35215167",
    mobile_url: "https://m.douban.com/movie/subject/35215167/"
  }
];

// 新增：模拟"本周口碑榜"数据
const weeklyMoviesData = [
  {
    rating: {
      max: 10,
      average: 8.9,
      min: 0
    },
    genres: ["剧情", "家庭"],
    title: "奥本海默",
    casts: [
      {
        name: "基里安·墨菲",
        id: "1000004"
      },
      {
        name: "艾米莉·布朗特",
        id: "1000005"
      }
    ],
    directors: [
      {
        name: "克里斯托弗·诺兰",
        id: "1000006"
      }
    ],
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658542.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658542.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658542.jpg"
    },
    alt: "https://movie.douban.com/subject/35215179/",
    id: "35215179",
    mobile_url: "https://m.douban.com/movie/subject/35215179/"
  },
  {
    rating: {
      max: 10,
      average: 8.7,
      min: 0
    },
    genres: ["剧情", "历史"],
    title: "芭比",
    casts: [
      {
        name: "玛格特·罗比",
        id: "1000007"
      },
      {
        name: "瑞恩·高斯林",
        id: "1000008"
      }
    ],
    directors: [
      {
        name: "格蕾塔·葛韦格",
        id: "1000009"
      }
    ],
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658543.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658543.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658543.jpg"
    },
    alt: "https://movie.douban.com/subject/35215171/",
    id: "35215171",
    mobile_url: "https://m.douban.com/movie/subject/35215171/"
  }
];

// 为了模拟不同的数据，我们创建几个数据源
const inTheatersData = [
  {  
    rating: {
      max: 10,
      average: 8.5,
      min: 0
    },
    genres: ["剧情", "科幻", "冒险"],
    title: "流浪地球2",
    casts: [
      {
        name: "吴京",
        id: "1044706"
      },
      {
        name: "刘德华",
        id: "1044707"
      }
    ],
    directors: [
      {
        name: "郭帆",
        id: "1316541"
      }
    ],
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg"
    },
    alt: "https://movie.douban.com/subject/35215167/",
    id: "35215167",
    mobile_url: "https://m.douban.com/movie/subject/35215167/"
  },
  {
    rating: {
      max: 10,
      average: 7.8,
      min: 0
    },
    genres: ["动作", "冒险", "科幻"],
    title: "阿凡达：水之道",
    casts: [
      {
        name: "萨姆·沃辛顿",
        id: "1000001"
      },
      {
        name: "佐伊·索尔达娜",
        id: "1000002"
      }
    ],
    directors: [
      {
        name: "詹姆斯·卡梅隆",
        id: "1000003"
      }
    ],
    year: "2022",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg"
    },
    alt: "https://movie.douban.com/subject/35215168/",
    id: "35215168",
    mobile_url: "https://m.douban.com/movie/subject/35215168/"
  }
];

// 即将上映电影数据
const comingSoonData = [
  {
    rating: {
      max: 10,
      average: 0, // 未上映电影暂无评分
      min: 0
    },
    genres: ["科幻", "冒险"],
    title: "沙丘2",
    casts: [
      {
        name: "提莫西·查拉梅",
        id: "1000004"
      },
      {
        name: "赞达亚",
        id: "1000005"
      }
    ],
    directors: [
      {
        name: "丹尼斯·维伦纽瓦",
        id: "1000006"
      }
    ],
    year: "2024",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg"
    },
    alt: "https://movie.douban.com/subject/35215169/",
    id: "35215169",
    mobile_url: "https://m.douban.com/movie/subject/35215169/"
  },
  {
    rating: {
      max: 10,
      average: 0,
      min: 0
    },
    genres: ["动作", "犯罪"],
    title: "新蝙蝠侠2",
    casts: [
      {
        name: "罗伯特·帕丁森",
        id: "1000007"
      }
    ],
    directors: [
      {
        name: "马特·里夫斯",
        id: "1000008"
      }
    ],
    year: "2025",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658535.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658535.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658535.jpg"
    },
    alt: "https://movie.douban.com/subject/35215170/",
    id: "35215170",
    mobile_url: "https://m.douban.com/movie/subject/35215170/"
  }];

// 正在热映电影数据（用于其他功能）
const anotherMovieData = [
  {
    rating: {
      max: 10,
      average: 8.5,
      min: 0
    },
    genres: ["剧情", "科幻", "冒险"],
    title: "流浪地球2",
    casts: [
      {
        // 注意：豆瓣 API 中演员对象通常没有 avatars 字段，而是有 large/small 等图片字段
        // 这里简化为只包含 name 和 id
        name: "吴京",
        id: "1044706"
      },
      {
        name: "刘德华",
        id: "1044707"
      }
    ],
    directors: [
      {
        name: "郭帆",
        id: "1316541"
      }
    ],
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658532.jpg"
    },
    alt: "https://movie.douban.com/subject/35215167/",
    id: "35215167",
    mobile_url: "https://m.douban.com/movie/subject/35215167/"
  },
  {
    rating: {
      max: 10,
      average: 7.8,
      min: 0
    },
    genres: ["动作", "冒险", "科幻"],
    title: "阿凡达：水之道",
    casts: [
      {
        name: "萨姆·沃辛顿",
        id: "1000001"
      },
      {
        name: "佐伊·索尔达娜",
        id: "1000002"
      }
    ],
    directors: [
      {
        name: "詹姆斯·卡梅隆",
        id: "1054521"
      }
    ],
    year: "2022",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658533.jpg"
    },
    alt: "https://movie.douban.com/subject/27003543/",
    id: "27003543",
    mobile_url: "https://m.douban.com/movie/subject/27003543/"
  },
  {
    rating: {
      max: 10,
      average: 9.0,
      min: 0
    },
    genres: ["剧情", "历史", "战争"],
    title: "长津湖之水门桥",
    casts: [
      {
        name: "吴京",
        id: "1044706"
      },
      {
        name: "易烊千玺",
        id: "1335913"
      }
    ],
    directors: [
      {
        name: "陈凯歌",
        id: "1274261"
      }
    ],
    year: "2022",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658534.jpg"
    },
    alt: "https://movie.douban.com/subject/35215168/",
    id: "35215168",
    mobile_url: "https://m.douban.com/movie/subject/35215168/"
  }
];

const top250Data = [
  {
    rating: {
      max: 10,
      average: 9.7,
      min: 0
    },
    genres: ["剧情", "犯罪"],
    title: "肖申克的救赎",
    casts: [
      {
        name: "蒂姆·罗宾斯",
        id: "1054534"
      },
      {
        name: "摩根·弗里曼",
        id: "1054522"
      }
    ],
    directors: [
      {
        name: "弗兰克·德拉邦特",
        id: "1047973"
      }
    ],
    year: "1994",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658536.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658536.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658536.jpg"
    },
    alt: "https://movie.douban.com/subject/1292052/",
    id: "1292052",
    mobile_url: "https://m.douban.com/movie/subject/1292052/"
  },
  {
    rating: {
      max: 10,
      average: 9.4,
      min: 0
    },
    genres: ["剧情", "爱情", "同性"],
    title: "霸王别姬",
    casts: [
      {
        name: "张国荣",
        id: "1003494"
      },
      {
        name: "张丰毅",
        id: "1050265"
      }
    ],
    directors: [
      {
        name: "陈凯歌",
        id: "1274261"
      }
    ],
    year: "1993",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658537.jpg",
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658537.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658537.jpg"
    },
    alt: "https://movie.douban.com/subject/1291546/",
    id: "1291546",
    mobile_url: "https://m.douban.com/movie/subject/1291546/"
  }
];

// 模拟电影详情数据的函数
const getMovieDetail = (id: string) => {
  // 从现有的数据中查找，如果找不到则返回一个默认结构
  let movieData;
  if (id === "35215167") {
    movieData = inTheatersData.find(m => m.id === id);
  } else if (id === "27003543") {
    movieData = inTheatersData.find(m => m.id === id);
  } else if (id === "1292052") {
    movieData = top250Data.find(m => m.id === id);
  } else if (id === "1291546") {
    movieData = top250Data.find(m => m.id === id);
  }

  if (movieData) {
    // 如果在现有数据中找到，则基于该数据构建详情
    return {
      id: movieData.id,
      title: movieData.title,
      original_title: movieData.title, // 简化处理
      rating: movieData.rating,
      ratings_count: Math.floor(Math.random() * 1000000) + 10000, // 随机生成评分人数
      year: movieData.year,
      images: movieData.images,
      directors: movieData.directors,
      casts: movieData.casts,
      genres: movieData.genres,
      countries: ["美国"], // 简化处理
      summary: `这是电影《${movieData.title}》的简介。`, // 简化处理
      pubdates: [`${movieData.year}-01-01`], // 简化处理
      durations: ["120分钟"], // 简化处理
      aka: [`又名${movieData.title}`] // 简化处理
    };
  }

  // 如果未找到，则返回默认结构
  return {
    id: id,
    title: `电影详情 - ID: ${id}`,
    original_title: `Movie Detail - ID: ${id}`,
    rating: {
      max: 10,
      average: Math.random() * 5 + 5, // 随机评分 5-10
      min: 0,
      stars: "40" // 通常由前端根据 average 计算
    },
    ratings_count: Math.floor(Math.random() * 1000000) + 10000,
    year: "2023",
    images: {
      small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg", // 使用一个固定的示例图片
      large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg",
      medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg"
    },
    directors: [
      {
        id: "1000001",
        name: "导演姓名",
        large: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658539.jpg", // 使用示例头像
        small: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658539.jpg",
        medium: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658539.jpg"
      }
    ],
    casts: [
      {
        id: "1000002",
        name: "演员1",
        large: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658540.jpg",
        small: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658540.jpg",
        medium: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658540.jpg"
      },
      {
        id: "1000003",
        name: "演员2",
        large: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658541.jpg",
        small: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658541.jpg",
        medium: "https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2886658541.jpg"
      }
    ],
    genres: ["剧情", "动作", "冒险"],
    countries: ["中国"],
    summary: "这是一部精彩的电影，讲述了......",
    pubdates: ["2023-01-01"],
    durations: ["120分钟"],
    aka: ["别名1", "别名2"]
  };
};


export const handlers = [
  // 正在热映
  http.get('/api/v2/movie/in_theaters', ({ request }) => {
    const url = new URL(request.url);
    // 模拟分页
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '20');
    const total = inTheatersData.length;

    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = inTheatersData.slice(startIdx, endIdx);

    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: "正在热映"
    });
  }),

  // 即将上映
  http.get('/api/v2/movie/coming_soon', ({ request }) => {
    const url = new URL(request.url);
    // 模拟分页
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '20');
    const total = comingSoonData.length;

    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = comingSoonData.slice(startIdx, endIdx);

    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: "即将上映"
    });
  }),

  // Top250
  http.get('/api/v2/movie/top250', ({ request }) => {
    const url = new URL(request.url);
    // 模拟分页
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '20');
    const total = top250Data.length;

    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = top250Data.slice(startIdx, endIdx);

    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: "豆瓣电影Top250"
    });
  }),

  // 电影详情
  http.get('/api/v2/movie/subject/:id', ({ params }) => {
    const { id } = params;
    // 确保id是字符串类型
    const movieDetail = getMovieDetail(id as string);

    return HttpResponse.json(movieDetail);
  }),

  // 搜索电影
  http.get('/api/v2/movie/search', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';

    // 简单的搜索逻辑，返回包含关键词的模拟数据
    const searchResults = [
      {
        rating: {
          max: 10,
          average: 8.5,
          min: 0
        },
        genres: ["剧情", "科幻"],
        title: `搜索结果: ${q}`,
        casts: [
          {
            name: "演员A",
            id: "1000001"
          }
        ],
        directors: [
          {
            name: "导演A",
            id: "1000002"
          }
        ],
        year: "2023",
        images: {
          small: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg",
          large: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg",
          medium: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886658538.jpg"
        },
        alt: "https://movie.douban.com/subject/1234567/",
        id: "1234567",
        mobile_url: "https://m.douban.com/movie/subject/1234567/"
      }
    ];

    return HttpResponse.json({
      count: searchResults.length,
      start: 0,
      total: searchResults.length,
      subjects: searchResults,
      title: `搜索"${q}"的结果`
    });
  }),
  
  // 新增：处理本周口碑榜请求
  http.get('/api/weekly-movies', () => {
    return HttpResponse.json({
      count: weeklyMoviesData.length,
      start: 0,
      total: weeklyMoviesData.length,
      subjects: weeklyMoviesData,
      title: "本周口碑榜"
    });
  }),
  
  // 新增：处理标签搜索电影的请求
  http.get('/v2/movie/tag', ({ request }) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag') || '科幻'; // 默认认为"科幻"
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '20');
    
    // 模拟分页
    const total = tagSearchData.length;
    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = tagSearchData.slice(startIdx, endIdx);
    
    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: `标签 "${tag}" 下的电影`
    });
  }),
  
  // 新增：处理正在热映电影的请求
  http.get('/v2/movie/in_theaters', ({ request }) => {
    const url = new URL(request.url);
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '10');
    
    // 模拟分页
    const total = inTheatersData.length;
    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = inTheatersData.slice(startIdx, endIdx);
    
    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: "正在热映"
    });
  }),
  
  // 新增：处理即将上映电影的请求
  http.get('/v2/movie/coming_soon', ({ request }) => {
    const url = new URL(request.url);
    const start = parseInt(url.searchParams.get('start') || '0');
    const count = parseInt(url.searchParams.get('count') || '10');
    
    // 模拟分页
    const total = comingSoonData.length;
    const startIdx = Math.min(start, total);
    const endIdx = Math.min(start + count, total);
    const paginatedData = comingSoonData.slice(startIdx, endIdx);
    
    return HttpResponse.json({
      count: paginatedData.length,
      start: start,
      total: total,
      subjects: paginatedData,
      title: "即将上映"
    });
  })
];