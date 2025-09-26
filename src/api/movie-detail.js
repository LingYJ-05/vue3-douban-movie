import axios from 'axios'
import { commonParams } from './config'
import { mockMovieDetail, mockMovieComments, mockMovieReviews } from './mock-data'


export function getMovieDetail(id){
    const url=`/v2/movie/subject/${id}`
    const data = Object.assign({}, commonParams, {
        id
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        // console.log('获取电影详情失败:', err);
        // 返回模拟数据，使用传入的id
        const detail = {
            ...mockMovieDetail,
            id: id || mockMovieDetail.id
        };
        return Promise.resolve(detail);
    })
}
export function getMovieReview(id){
    const url=`/v2/movie/subject/${id}/reviews`
    const data = Object.assign({}, commonParams, {
        id
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        // console.log('获取电影影评失败:', err);
        // 返回模拟数据
        return Promise.resolve(mockMovieReviews);
    })
}
export function getAllReviews(id,start,count){
    const url=`/v2/movie/subject/${id}/reviews`
    const data = Object.assign({}, commonParams, {
        start,
        count
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        // console.log('获取所有影评失败:', err);
        // 返回模拟数据
        return Promise.resolve(mockMovieReviews);
    })
}

export function getAllComments(id,start,count){
    const url=`/v2/movie/subject/${id}/comments`
    const data = Object.assign({}, commonParams, {
        start,
        count
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        // console.log('获取电影短评失败:', err);
        // 返回模拟数据
        return Promise.resolve(mockMovieComments);
    })
}