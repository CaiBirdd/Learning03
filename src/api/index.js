import request from '@/utils/request'

//登录
export const userLoginAPI = ({userName,passWord})=> request.post('/login',{userName,passWord})
//获取首页数据
export const getHomePageDataAPI = ()=> request.get('/Index/index')

//获取创建订单页的数据
export const getCreateOrderPageDataAPI = ()=> request.get('/h5/companion')

//提交订单接口
export const submitCreateOrderAPI = (data)=> request.post('/createOrder',data)

//订单页面获取订单列表
export const getOrderPageListAPI = (params)=> request.get('/order/list',{params})

//订单详情页
export const getOrderDetailPageAPI = (params)=> request.get('/order/detail',{params})