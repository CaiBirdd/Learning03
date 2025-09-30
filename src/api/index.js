import request from '@/utils/request'

//登录
export const userLoginAPI = ({userName,passWord})=> request.post('/login',{userName,passWord})
//获取首页数据
export const getHomePageDataAPI = ()=> request.get('/Index/index')

//获取创建订单页的数据
export const getCreateOrderPageDataAPI = ()=> request.get('/h5/companion')