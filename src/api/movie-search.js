import axios from 'axios'
import { commonParams } from './config'
import { mockSearchResults, mockTagSearchResults } from './mock-data'

export function movieSearch(query, start, count) {
    const url = '/v2/movie/search'
    const data = Object.assign({}, commonParams, {
        q: query,
        start,
        count
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log('搜索电影失败:', err)
        // 返回模拟数据
        return Promise.resolve(mockSearchResults)
    })
}

export function tagSearch(tag, start, count) {
    const url = '/v2/movie/search'
    const data = Object.assign({}, commonParams, {
        tag: tag, // 豆瓣 API 支持 tag 参数
        start,
        count
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log('标签搜索失败:', err)
        // 返回模拟数据
        return Promise.resolve(mockTagSearchResults)
    })
}