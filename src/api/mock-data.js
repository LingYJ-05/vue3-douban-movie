// 模拟数据集合 - 豆瓣电影API

// 模拟热门电影数据
export const mockHotMovies = {
    start: 0,
    count: 10,
    total: 30,
    subjects: [
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
        },
        {
            id: '1292720',
            title: '阿甘正传',
            original_title: 'Forrest Gump',
            directors: [{ id: '1054525', name: '罗伯特·泽米吉斯' }],
            casts: [
                { id: '1003774', name: '汤姆·汉克斯' },
                { id: '1000004', name: '罗宾·怀特' }
            ],
            collect_count: 109876,
            rating: { average: 9.4, max: 10, min: 0, stars: '45' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg'
            },
            genres: ['剧情', '爱情'],
            mainland_pubdate: '1994-07-06',
            pubdates: ['1994-07-06(中国大陆)', '1994-07-06(美国)'],
            year: '1994',
            durations: ['142分钟'],
            countries: ['美国'],
            aka: ['福雷斯特·冈普']
        },
        {
            id: '1292063',
            title: '泰坦尼克号',
            original_title: 'Titanic',
            directors: [{ id: '1054528', name: '詹姆斯·卡梅隆' }],
            casts: [
                { id: '1011969', name: '莱昂纳多·迪卡普里奥' },
                { id: '1015947', name: '凯特·温丝莱特' }
            ],
            collect_count: 98765,
            rating: { average: 9.3, max: 10, min: 0, stars: '45' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg'
            },
            genres: ['剧情', '爱情', '灾难'],
            mainland_pubdate: '1998-04-03',
            pubdates: ['1998-04-03(中国大陆)', '1997-12-19(美国)'],
            year: '1997',
            durations: ['194分钟'],
            countries: ['美国'],
            aka: ['铁达尼号(港/台)']
        },
        {
            id: '1295644',
            title: '千与千寻',
            original_title: '千と千尋の神隠し',
            directors: [{ id: '1023514', name: '宫崎骏' }],
            casts: [
                { id: '1042081', name: '柊瑠美' },
                { id: '1025716', name: '入野自由' }
            ],
            collect_count: 87654,
            rating: { average: 9.4, max: 10, min: 0, stars: '45' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg'
            },
            genres: ['剧情', '动画', '奇幻'],
            mainland_pubdate: '2001-07-20',
            pubdates: ['2001-07-20(中国大陆)', '2001-07-20(日本)'],
            year: '2001',
            durations: ['125分钟'],
            countries: ['日本'],
            aka: ['神隐少女(台)', '千与千寻的神隐']
        }
    ]
};

// 模拟即将上映的电影
export const mockComingMovies = {
    start: 0,
    count: 10,
    total: 20,
    subjects: [
        {
            id: '1300234',
            title: '沙丘2',
            original_title: 'Dune: Part Two',
            directors: [{ id: '1001433', name: '丹尼斯·维伦纽瓦' }],
            casts: [
                { id: '1005228', name: '提莫西·查拉梅' },
                { id: '1016673', name: '丽贝卡·弗格森' }
            ],
            collect_count: 87654,
            rating: { average: 9.2, max: 10, min: 0, stars: '45' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg'
            },
            genres: ['科幻', '冒险'],
            mainland_pubdate: '2024-03-01',
            pubdates: ['2024-03-01(中国大陆)'],
            year: '2024',
            durations: ['166分钟'],
            countries: ['美国'],
            aka: ['沙丘：第二部']
        },
        {
            id: '1312583',
            title: '奥本海默',
            original_title: 'Oppenheimer',
            directors: [{ id: '1025401', name: '克里斯托弗·诺兰' }],
            casts: [
                { id: '1019395', name: '基里安·墨菲' },
                { id: '1014837', name: '艾米丽·布朗特' }
            ],
            collect_count: 76543,
            rating: { average: 9.0, max: 10, min: 0, stars: '45' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg'
            },
            genres: ['剧情', '传记', '历史'],
            mainland_pubdate: '2024-04-15',
            pubdates: ['2024-04-15(中国大陆)'],
            year: '2023',
            durations: ['180分钟'],
            countries: ['美国', '英国'],
            aka: ['奥本海默传', '原子弹之父']
        },
        {
            id: '1320561',
            title: '变形金刚：起源',
            original_title: 'Transformers One',
            directors: [{ id: '1034567', name: '乔什·库雷' }],
            casts: [
                { id: '1056789', name: '克里斯·海姆斯沃斯' },
                { id: '1067890', name: '布莱恩·泰里·亨利' }
            ],
            collect_count: 65432,
            rating: { average: 8.8, max: 10, min: 0, stars: '40' },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg'
            },
            genres: ['动画', '科幻', '冒险'],
            mainland_pubdate: '2024-07-12',
            pubdates: ['2024-07-12(中国大陆)'],
            year: '2024',
            durations: ['118分钟'],
            countries: ['美国'],
            aka: ['变形金刚：初代', '变形金刚：赛博坦纪元']
        }
    ]
};

// 模拟搜索结果数据
export const mockSearchResults = {
    start: 0,
    count: 10,
    total: 156,
    subjects: [
        {
            id: '1292052',
            title: '肖申克的救赎',
            original_title: 'The Shawshank Redemption',
            rating: { average: 9.7 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
            },
            year: '1994',
            directors: [{ name: '弗兰克·德拉邦特' }],
            casts: [{ name: '蒂姆·罗宾斯' }, { name: '摩根·弗里曼' }]
        },
        {
            id: '1291546',
            title: '这个杀手不太冷',
            original_title: 'Léon',
            rating: { average: 9.5 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg'
            },
            year: '1994',
            directors: [{ name: '吕克·贝松' }],
            casts: [{ name: '让·雷诺' }, { name: '娜塔莉·波特曼' }]
        },
        {
            id: '1292720',
            title: '阿甘正传',
            original_title: 'Forrest Gump',
            rating: { average: 9.4 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg'
            },
            year: '1994',
            directors: [{ name: '罗伯特·泽米吉斯' }],
            casts: [{ name: '汤姆·汉克斯' }, { name: '罗宾·怀特' }]
        }
    ]
};

// 模拟标签搜索结果数据
export const mockTagSearchResults = {
    start: 0,
    count: 10,
    total: 89,
    subjects: [
        {
            id: '1292063',
            title: '泰坦尼克号',
            original_title: 'Titanic',
            rating: { average: 9.3 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg'
            },
            year: '1997',
            directors: [{ name: '詹姆斯·卡梅隆' }],
            casts: [{ name: '莱昂纳多·迪卡普里奥' }, { name: '凯特·温丝莱特' }]
        },
        {
            id: '1295644',
            title: '千与千寻',
            original_title: '千と千尋の神隠し',
            rating: { average: 9.4 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1606726631.jpg'
            },
            year: '2001',
            directors: [{ name: '宫崎骏' }],
            casts: [{ name: '柊瑠美' }, { name: '入野自由' }]
        }
    ]
};

// 模拟电影详情数据
export const mockMovieDetail = {
    id: '1292052',
    title: '肖申克的救赎',
    original_title: 'The Shawshank Redemption',
    rating: {
        average: 9.7,
        max: 10,
        min: 0,
        stars: '45'
    },
    genres: ['剧情', '犯罪'],
    countries: ['美国'],
    languages: ['英语'],
    durations: ['142分钟'],
    pubdates: ['1994-09-23(美国)', '1994-10-14(加拿大)'],
    mainland_pubdate: '1994-09-10',
    aka: ['月黑高飞(港)', '刺激1995(台)', '地狱诺言', '铁窗岁月', '消香克的救赎'],
    summary: '20世纪40年代末，小有成就的青年银行家安迪（蒂姆·罗宾斯 Tim Robbins 饰）因涉嫌杀害妻子及她的情人而锒铛入狱。在这座名为肖申克的监狱内，希望似乎虚无缥缈，终身监禁的惩罚无疑注定了安迪接下来灰暗绝望的人生。未过多久，安迪尝试接近囚犯中颇有声望的瑞德（摩根·弗里曼 Morgan Freeman 饰），请求对方帮自己搞来小锤子。以此为契机，二人逐渐熟稔，安迪也仿佛在鱼龙混杂、罪恶横生、黑白混淆的牢狱中找到属于自己的求生之道。他利用自身的专业知识，帮助监狱管理层逃税、洗黑钱，同时凭借与瑞德的交往在犯人中间也渐渐受到礼遇。表面看来，他已如瑞德那样对那堵高墙从憎恨转变为处之泰然，但是对自由的渴望仍促使他朝着心中的希望和目标前进。而关于其罪行的真相，似乎更使这一切朝前推进了一步……',
    images: {
        large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
        medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
        small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
    },
    directors: [
        {
            id: '1054521',
            name: '弗兰克·德拉邦特',
            avatars: {
                large: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17525.jpg'
            }
        }
    ],
    casts: [
        {
            id: '1054523',
            name: '蒂姆·罗宾斯',
            avatars: {
                large: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17527.jpg'
            }
        },
        {
            id: '1054524',
            name: '摩根·弗里曼',
            avatars: {
                large: 'https://img2.doubanio.com/view/celebrity/s_ratio_celebrity/public/p15263.jpg'
            }
        }
    ],
    comments_count: 500000,
    reviews_count: 20000,
    wish_count: 150000,
    collect_count: 123456
};

// 模拟电影短评数据
export const mockMovieComments = {
    start: 0,
    count: 20,
    total: 500000,
    comments: [
        {
            id: '1',
            content: '希望是美好的，也许是人间至善，而美好的事物永不消逝。',
            rating: 5,
            author: {
                name: '电影爱好者',
                avatar: 'https://img2.doubanio.com/icon/u12345678-10.jpg'
            },
            create_time: '2023-10-15 14:30:22',
            likes_count: 12345
        },
        {
            id: '2',
            content: '一部关于希望、自由和救赎的经典之作，每一帧都充满力量。',
            rating: 5,
            author: {
                name: '影评人小明',
                avatar: 'https://img2.doubanio.com/icon/u23456789-12.jpg'
            },
            create_time: '2023-10-14 09:15:45',
            likes_count: 9876
        },
        {
            id: '3',
            content: '摩根·弗里曼的旁白太有魅力了，整个故事结构紧凑，看完让人回味无穷。',
            rating: 4,
            author: {
                name: '电影学生',
                avatar: 'https://img2.doubanio.com/icon/u34567890-8.jpg'
            },
            create_time: '2023-10-13 19:22:38',
            likes_count: 7654
        }
    ]
};

// 模拟电影影评数据
export const mockMovieReviews = {
    start: 0,
    count: 20,
    total: 20000,
    reviews: [
        {
            id: '1',
            title: '肖申克的救赎：被囚禁的自由',
            content: '当我第一次观看《肖申克的救赎》时，我被深深震撼了。这部电影不仅仅是一个关于越狱的故事，更是一个关于希望、友谊和救赎的寓言。安迪在监狱中度过了二十年，但他从未放弃对自由的渴望和对美好事物的追求...',
            author: {
                name: '资深影评人',
                avatar: 'https://img2.doubanio.com/icon/u45678901-15.jpg'
            },
            create_time: '2023-09-30 16:45:12',
            likes_count: 8901,
            comments_count: 1234
        },
        {
            id: '2',
            title: '论安迪的精神胜利法',
            content: '安迪的故事告诉我们，即使在最绝望的环境中，我们仍然可以保持自己的尊严和希望。他用一把小锤子，二十年如一日地挖掘自由之路，这种毅力和智慧令人钦佩...',
            author: {
                name: '文学研究者',
                avatar: 'https://img2.doubanio.com/icon/u56789012-20.jpg'
            },
            create_time: '2023-09-25 11:30:55',
            likes_count: 6789,
            comments_count: 890
        }
    ]
};

// 模拟Top250排行榜数据
export const mockTop250 = {
    start: 0,
    count: 20,
    total: 250,
    subjects: [
        {
            id: '1292052',
            title: '肖申克的救赎',
            original_title: 'The Shawshank Redemption',
            rating: { average: 9.7 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
            },
            year: '1994',
            directors: [{ name: '弗兰克·德拉邦特' }],
            casts: [{ name: '蒂姆·罗宾斯' }, { name: '摩根·弗里曼' }],
            genres: ['剧情', '犯罪'],
            collect_count: 123456
        },
        {
            id: '1291546',
            title: '这个杀手不太冷',
            original_title: 'Léon',
            rating: { average: 9.5 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg'
            },
            year: '1994',
            directors: [{ name: '吕克·贝松' }],
            casts: [{ name: '让·雷诺' }, { name: '娜塔莉·波特曼' }],
            genres: ['剧情', '动作', '犯罪'],
            collect_count: 112345
        },
        {
            id: '1292720',
            title: '阿甘正传',
            original_title: 'Forrest Gump',
            rating: { average: 9.4 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg'
            },
            year: '1994',
            directors: [{ name: '罗伯特·泽米吉斯' }],
            casts: [{ name: '汤姆·汉克斯' }, { name: '罗宾·怀特' }],
            genres: ['剧情', '爱情'],
            collect_count: 109876
        }
    ]
};

// 模拟本周口碑榜数据
export const mockWeeklyRank = {
    start: 0,
    count: 20,
    total: 50,
    subjects: [
        {
            id: '1300234',
            title: '沙丘2',
            original_title: 'Dune: Part Two',
            rating: { average: 9.2 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg'
            },
            year: '2024',
            directors: [{ name: '丹尼斯·维伦纽瓦' }],
            casts: [{ name: '提莫西·查拉梅' }, { name: '丽贝卡·弗格森' }],
            genres: ['科幻', '冒险'],
            collect_count: 87654
        },
        {
            id: '1312583',
            title: '奥本海默',
            original_title: 'Oppenheimer',
            rating: { average: 9.0 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg'
            },
            year: '2023',
            directors: [{ name: '克里斯托弗·诺兰' }],
            casts: [{ name: '基里安·墨菲' }, { name: '艾米丽·布朗特' }],
            genres: ['剧情', '传记', '历史'],
            collect_count: 76543
        }
    ]
};

// 模拟新片榜数据
export const mockNewMoviesRank = {
    start: 0,
    count: 20,
    total: 30,
    subjects: [
        {
            id: '1320561',
            title: '变形金刚：起源',
            original_title: 'Transformers One',
            rating: { average: 8.8 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg'
            },
            year: '2024',
            directors: [{ name: '乔什·库雷' }],
            casts: [{ name: '克里斯·海姆斯沃斯' }, { name: '布莱恩·泰里·亨利' }],
            genres: ['动画', '科幻', '冒险'],
            collect_count: 65432
        },
        {
            id: '1320562',
            title: '毒液3',
            original_title: 'Venom: The Last Dance',
            rating: { average: 8.5 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg'
            },
            year: '2024',
            directors: [{ name: '凯莉·马塞尔' }],
            casts: [{ name: '汤姆·哈迪' }, { name: '朱诺·坦普尔' }],
            genres: ['动作', '科幻', '惊悚'],
            collect_count: 54321
        }
    ]
};

// 模拟北美票房榜数据
export const mockUsRank = {
    start: 0,
    count: 20,
    total: 30,
    subjects: [
        {
            id: '1300234',
            title: '沙丘2',
            original_title: 'Dune: Part Two',
            rating: { average: 9.2 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2807468793.jpg'
            },
            year: '2024',
            directors: [{ name: '丹尼斯·维伦纽瓦' }],
            casts: [{ name: '提莫西·查拉梅' }, { name: '丽贝卡·弗格森' }],
            genres: ['科幻', '冒险'],
            box: {
                date: '2024-03-01',
                week: 1,
                gross: 80000000,
                total: 80000000
            }
        },
        {
            id: '1312583',
            title: '奥本海默',
            original_title: 'Oppenheimer',
            rating: { average: 9.0 },
            images: {
                large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg',
                small: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2821465296.jpg'
            },
            year: '2023',
            directors: [{ name: '克里斯托弗·诺兰' }],
            casts: [{ name: '基里安·墨菲' }, { name: '艾米丽·布朗特' }],
            genres: ['剧情', '传记', '历史'],
            box: {
                date: '2024-03-01',
                week: 2,
                gross: 45000000,
                total: 130000000
            }
        }
    ]
};