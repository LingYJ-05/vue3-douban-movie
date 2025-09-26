import { http, HttpResponse } from 'msw'

export const handlers = [
  // 正在热映
  http.get('/api/v2/movie/in_theaters', () => {
    return HttpResponse.json({
      headers: {
        'Content-Type': 'application/json'
      },
      count: 20,
      start: 0,
      total: 20,
      subjects: [
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "吴京",
              id: "1044706"
            },
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "刘德华",
              id: "1044707"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "郭帆",
              id: "1316541"
            }
          ],
          year: "2023",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "萨姆·沃辛顿",
              id: "1000001"
            },
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "佐伊·索尔达娜",
              id: "1000002"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "詹姆斯·卡梅隆",
              id: "1054521"
            }
          ],
          year: "2022",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "吴京",
              id: "1044706"
            },
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "易烊千玺",
              id: "1335913"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "陈凯歌",
              id: "1274261"
            }
          ],
          year: "2022",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
          },
          alt: "https://movie.douban.com/subject/35215168/",
          id: "35215168",
          mobile_url: "https://m.douban.com/movie/subject/35215168/"
        }
      ],
      title: "正在热映"
    })
  }),

  // 即将上映
  http.get('/api/v2/movie/coming_soon', () => {
    return HttpResponse.json({
      headers: {
        'Content-Type': 'application/json'
      },
      count: 20,
      start: 0,
      total: 20,
      subjects: [
        {
          rating: {
            max: 10,
            average: 0,
            min: 0
          },
          genres: ["科幻", "动作", "冒险"],
          title: "速度与激情10",
          casts: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "范·迪塞尔",
              id: "1044701"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "路易斯·莱特里尔",
              id: "1044702"
            }
          ],
          year: "2023",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
          },
          alt: "https://movie.douban.com/subject/35215169/",
          id: "35215169",
          mobile_url: "https://m.douban.com/movie/subject/35215169/"
        }
      ],
      title: "即将上映"
    })
  }),

  // Top250
  http.get('/api/v2/movie/top250', () => {
    return HttpResponse.json({
      headers: {
        'Content-Type': 'application/json'
      },
      count: 20,
      start: 0,
      total: 250,
      subjects: [
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "蒂姆·罗宾斯",
              id: "1054534"
            },
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "摩根·弗里曼",
              id: "1054522"
            }
          ],

          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "弗兰克·德拉邦特",
              id: "1047973"
            }
          ],
          year: "1994",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "张国荣",
              id: "1003494"
            },
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "张丰毅",
              id: "1050265"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "陈凯歌",
              id: "1274261"
            }
          ],
          year: "1993",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
          },
          alt: "https://movie.douban.com/subject/1291546/",
          id: "1291546",
          mobile_url: "https://m.douban.com/movie/subject/1291546/"
        }
      ],
      title: "豆瓣电影Top250"
    })
  }),

  // 电影详情
  http.get('/api/v2/movie/subject/:id', ({ params }) => {
    const { id } = params

    const movieDetail = {
      id: id,
      title: "示例电影详情",
      original_title: "Example Movie",
      rating: {
        max: 10,
        average: 8.0,
        min: 0,
        stars: "40"
      },
      ratings_count: 123456,
      year: "2023",
      images: {
        small: "https://via.placeholder.com/100x150",
        large: "https://via.placeholder.com/300x450",
        medium: "https://via.placeholder.com/150x225"
      },
      directors: [
        {
          id: "1000001",
          name: "导演姓名",
          avatars: {
            small: "https://via.placeholder.com/48x64",
            large: "https://via.placeholder.com/120x160",
            medium: "https://via.placeholder.com/72x96"
          }
        }
      ],
      casts: [
        {
          id: "1000002",
          name: "演员1",
          avatars: {
            small: "https://via.placeholder.com/48x64",
            large: "https://via.placeholder.com/120x160",
            medium: "https://via.placeholder.com/72x96"
          }
        },
        {
          id: "1000003",
          name: "演员2",
          avatars: {
            small: "https://via.placeholder.com/48x64",
            large: "https://via.placeholder.com/120x160",
            medium: "https://via.placeholder.com/72x96"
          }
        }
      ],
      genres: ["剧情", "动作", "冒险"],
      countries: ["中国"],
      summary: "这是一部精彩的电影，讲述了......",
      pubdates: ["2023-01-01"],
      durations: ["120分钟"],
      aka: ["别名1", "别名2"]
    }

    return HttpResponse.json(movieDetail, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  // 搜索电影
  http.get('/api/v2/movie/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') || ''

    return HttpResponse.json({
      headers: {
        'Content-Type': 'application/json'
      },
      count: 10,
      start: 0,
      total: 10,
      subjects: [
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
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "演员A",
              id: "1000001"
            }
          ],
          directors: [
            {
              alt: "",
              avatars: {
                small: "https://via.placeholder.com/48x64",
                large: "https://via.placeholder.com/120x160",
                medium: "https://via.placeholder.com/72x96"
              },
              name: "导演A",
              id: "1000002"
            }
          ],
          year: "2023",
          images: {
            small: "https://via.placeholder.com/100x150",
            large: "https://via.placeholder.com/300x450",
            medium: "https://via.placeholder.com/150x225"
          },
          alt: "https://movie.douban.com/subject/1234567/",
          id: "1234567",
          mobile_url: "https://m.douban.com/movie/subject/1234567/"
        }
      ],
      title: `搜索"${q}"的结果`
    })
  })
]