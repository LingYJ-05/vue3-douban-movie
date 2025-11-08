import { mockTop250, mockWeeklyRank, mockNewMoviesRank, mockUsRank } from './mock-data'

// 获取Top250排行榜数据
export function top250Rank(start, count) {
    // 从 mockTop250 的 subjects 数组中截取指定范围的数据
    const data = {
        start: start,
        count: count,
        total: mockTop250.total,
        subjects: mockTop250.subjects.slice(start, start + count)
    };
    return Promise.resolve(data);
}

// 获取本周口碑榜数据
export function weeklyRank(start, count) {
    const data = {
        start: start,
        count: count,
        total: mockWeeklyRank.total,
        subjects: mockWeeklyRank.subjects.slice(start, start + count)
    };
    return Promise.resolve(data);
}

// 获取新片榜数据
export function newMoviesRank(start, count) {
    const data = {
        start: start,
        count: count,
        total: mockNewMoviesRank.total,
        subjects: mockNewMoviesRank.subjects.slice(start, start + count)
    };
    return Promise.resolve(data);
}

// 获取北美票房榜数据
export function usRank(start, count) {
    const data = {
        start: start,
        count: count,
        total: mockUsRank.total,
        subjects: mockUsRank.subjects.slice(start, start + count)
    };
    return Promise.resolve(data);
}