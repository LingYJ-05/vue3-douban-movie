import axios from 'axios'
import { commonParams } from './config'
import { mockTop250, mockWeeklyRank, mockNewMoviesRank, mockUsRank } from './mock-data'


// 获取Top250排行榜数据
export function top250Rank(start, count) {
    // 直接返回模拟数据，确保排行榜正常显示
    return Promise.resolve(mockTop250);
}

// 获取本周口碑榜数据
export function weeklyRank(start, count) {
    // 直接返回模拟数据，确保排行榜正常显示
    return Promise.resolve(mockWeeklyRank);
}

// 获取新片榜数据
export function newMoviesRank(start, count) {
    // 直接返回模拟数据，确保排行榜正常显示
    return Promise.resolve(mockNewMoviesRank);
}
// 获取北美票房榜数据
export function usRank(start, count) {
    // 直接返回模拟数据，确保排行榜正常显示
    return Promise.resolve(mockUsRank);
}//
