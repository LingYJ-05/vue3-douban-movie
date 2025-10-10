// 创建电影类
export default class Movie {
  constructor({ id, title, director, casts, collectCount, rating, image, date, pubdates, subtype }) {
    this.id = id || '';
    this.title = title || '未知电影';
    this.director = director || '未知导演';
    this.casts = casts || '未知演员';
    this.collectCount = collectCount || 0;
    this.rating = rating || 0;
    this.image = image || 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'; // 提供默认图片
    this.date = date || ''; // 用于显示即将上映的电影是否待定
    this.pubdates = pubdates || []; // 改为数组，更安全
    this.subtype = subtype || 'movie'; // 改为 'movie' 或其他默认值，避免空字符串
  }
};

// 创建包含电影类的通用电影信息列表
export function createMovieList(movieList) {
  let ret = [];
  if (!movieList || !Array.isArray(movieList)) {
    return ret; // 如果 movieList 不是数组，直接返回空数组
  }

  movieList.forEach((movie, index) => {
    // 安全访问：检查 movie 和 movie.images 是否存在
    const image = movie.images && typeof movie.images === 'object'
      ? movie.images.large
      : 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster';

    // 安全访问：检查 rating 是否存在
    const rating = movie.rating && typeof movie.rating === 'object'
      ? movie.rating.average
      : 0;

    // 安全访问：检查 directors 是否存在
    const director = movie.directors && Array.isArray(movie.directors) && movie.directors.length > 0
      ? movie.directors[0].name
      : '未知导演';

    // 安全访问：检查 casts 是否存在
    let casts = '未知演员';
    if (movie.casts && Array.isArray(movie.casts) && movie.casts.length > 0) {
      casts = '';
      movie.casts.forEach((item, idx) => {
        if (idx < movie.casts.length - 1) {
          casts += `${item.name}/`;
        } else {
          casts += item.name;
        }
      });
    }

    ret.push(new Movie({
      id: movie.id || '', // 安全访问
      title: movie.title || '未知电影', // 安全访问
      director: director,
      casts: casts,
      collectCount: movie.collect_count || 0, // 安全访问
      rating: rating,
      image: image,
      date: movie.mainland_pubdate || '', // 安全访问
      pubdates: movie.pubdates || [], // 安全访问
      subtype: 'movie' // 默认值
    }));
  });
  return ret;
};

// 创建包含电影类的适合排行榜的电影信息列表
export function createRankList(rankList) {
  let ret = [];
  if (!rankList || !Array.isArray(rankList)) {
    return ret; // 如果 rankList 不是数组，直接返回空数组
  }

  rankList.forEach((item) => {
    item = item.subject ? item.subject : item;

    // 安全访问：检查 item 和 item.images 是否存在
    const image = item.images && typeof item.images === 'object'
      ? item.images.large
      : 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster';

    // 安全访问：检查 rating 是否存在
    const rating = item.rating && typeof item.rating === 'object'
      ? item.rating.average
      : 0;

    // 安全访问：检查 directors 是否存在
    const director = item.directors && Array.isArray(item.directors) && item.directors.length > 0
      ? item.directors[0].name
      : '未知导演';

    // 安全访问：检查 casts 是否存在
    let casts = '未知演员';
    if (item.casts && Array.isArray(item.casts) && item.casts.length > 0) {
      casts = '';
      item.casts.forEach((cast, idx) => {
        if (idx < item.casts.length - 1) {
          casts += `${cast.name}/`;
        } else {
          casts += cast.name;
        }
      });
    }

    ret.push(new Movie({
      id: item.id || '', // 安全访问
      title: item.title || '未知电影', // 安全访问
      director: director,
      casts: casts,
      rating: rating,
      image: image
    }));
  });
  return ret;
};

// 创建包含电影类的适合搜索结果的电影信息列表
export function createSearchList(movieList) {
  let ret = [];
  if (!movieList || !Array.isArray(movieList)) {
    return ret; // 如果 movieList 不是数组，直接返回空数组
  }

  movieList.forEach((movie, index) => {
    // 安全访问：检查 movie 和 movie.images 是否存在
    const image = movie.images && typeof movie.images === 'object'
      ? movie.images.small
      : 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'; // 提供默认图片

    // 安全访问：检查 rating 是否存在
    const rating = movie.rating && typeof movie.rating === 'object'
      ? movie.rating.average
      : 0;

    // 安全访问：检查 directors 是否存在
    const director = movie.directors && Array.isArray(movie.directors) && movie.directors.length > 0
      ? movie.directors[0].name
      : '未知导演';

    // 安全访问：检查 casts 是否存在
    let casts = '未知演员';
    if (movie.casts && Array.isArray(movie.casts) && movie.casts.length > 0) {
      casts = '';
      movie.casts.forEach((item, idx) => {
        if (idx < movie.casts.length - 1) {
          casts += `${item.name}/`;
        } else {
          casts += item.name;
        }
      });
    }

    ret.push(new Movie({
      id: movie.id || '', // 安全访问
      title: movie.title || '未知电影', // 安全访问
      director: director,
      casts: casts,
      rating: rating,
      image: image,
      pubdates: movie.pubdates || [], // 安全访问
      subtype: movie.subtype || 'movie' // 安全访问
    }));
  });
  return ret;
};

// 预处理演员信息
function filterCasts(casts) {
  let ret = '';
  if (!casts || !Array.isArray(casts)) {
    return '未知演员'; // 如果 casts 不是数组，返回默认值
  }
  casts.forEach((item, index) => {
    if (index < casts.length - 1) {
      ret += `${item.name}/`;
    } else {
      ret += item.name;
    }
  });
  return ret;
};

// 预处理导演信息，只获取主导演
function filterDirector(directors) {
  if (!directors || !Array.isArray(directors) || directors.length === 0) {
    return '未知导演'; // 如果 directors 不是数组或为空，返回默认值
  }
  return directors[0].name;
};

// 预处理时间信息
function filterDate(date, pubdates) {
  // 在上映电影列表中出现重映电影的情况
  if (date && new Date().getTime() > new Date(date).getTime()) { // 如果是重映电影
    // 判断该重映电影是否为待定日期
    let reg = /^\d{4}[-]\d{2}[-]\d{2}/;
    if (pubdates && Array.isArray(pubdates)) {
      for (let i = 0; i < pubdates.length; i++) {
        // 如果重映电影的日期数据完整，不需要待定显示
        if (pubdates[i] && pubdates[i].indexOf('中国大陆重映') !== -1 && reg.test(pubdates[i])) {
          return normalizeDate(pubdates[i].match(reg)[0]);
        }
      }
    }
    return findShowTime(pubdates, '中国大陆重映');
  }
  if (!date) { // 电影时间不确定，数据为空返回了undefined
    return findShowTime(pubdates, '中国大陆');
  }
  return normalizeDate(date);
};

// 获取电影上映的待定时间
function findShowTime(pubdates, key) { // 获取待定的月份或年份
  let month = '';
  let year = '';
  if (!pubdates || !Array.isArray(pubdates)) {
    return '';
  }
  pubdates.forEach((item) => {
    if (!item) return;
    let index = item.indexOf(key);
    if (index > -1) {
      if (!item.split('-')[1]) { // 不存在月份信息
        year = item.split('-')[0].substr(0, 4);
      } else {
        month = (item.split('-'))[1].substr(0, 2);
        if (month.substr(0, 1) === '0') { // 月份去零
          month = month.substr(1, 1);
        }
      }
    }
  });
  if (!month) {
    return `${year}年待定`;
  }
  return `${month}月待定`;
}

// 判断是否需要显示年份
function needYear(date) {
  if (!date) return false;
  return parseInt(new Date(date).getFullYear()) > parseInt(new Date().getFullYear());
}

// 格式化日期
function normalizeDate(date) {
  if (!date || typeof date !== 'string') {
    return '';
  }
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let currentWeek = week[new Date(date).getDay()]; // 获取当天星期

  // 安全地分割日期
  const dateParts = date.split('-');
  if (dateParts.length < 3) {
    return date; // 如果日期格式不正确，直接返回原始日期
  }

  let time = `${dateParts[1]}月${dateParts[2]}日`;
  if (time.substr(0, 1) === '0') { // 月份去零
    time = time.substr(1);
  }
  let ret = time + ' ' + currentWeek;
  if (needYear(date)) { // 如果不是本年度电影
    return `${dateParts[0]}年${ret}`;
  }
  return ret;
}