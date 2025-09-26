import axios from 'axios'
import { commonParams } from './config'
import { mockHotMovies, mockComingMovies } from './mock-data';

export function getMovie(start, count) {
    const url = '/v2/movie/in_theaters';
    const data = Object.assign({}, commonParams, {
        start,
        count
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    }).catch((err) => {
        // console.log('获取热映电影失败:', err);
        // 返回模拟数据，确保页面能正常显示
        return Promise.resolve(mockHotMovies);
    });
}

export function getComingMovie(start, count) {
    const url = '/v2/movie/coming_soon';
    const data = Object.assign({}, commonParams, {
        start,
        count
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    }).catch((err) => {
        // console.log('获取即将上映电影失败:', err);
        // 返回模拟数据，确保页面能正常显示
        return Promise.resolve(mockComingMovies);
    });
}

// 为了兼容应用中使用的旧名称
export const getComingSoon = getComingMovie;