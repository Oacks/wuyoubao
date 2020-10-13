//index.js
//获取应用实例
const app = getApp()
import api from '../../api/api'

Page({
  data: {
    timer: null,
    userInfo: {},
    hasUserInfo: false,
    currentSwiper: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page: 0,
    totalList: 0, // 总数
    raceList: [
   
    ]
  },
  // 下拉加载更多
  onReachBottom() {
    this.getMoreList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 0,
      raceList: []
    })
    this.getList()
  },

  swiperChange: function (e) {
    let { source } = e.detail
    if (source === 'autoplay' || source === 'touch') {
      this.setData({
        currentSwiper: e.detail.current
      })
    }
  },
  // 展示详情
  order(evt){
      if (!wx.getStorageSync('wx-token')) {
        wx.showToast({
          title: '请先授权登录',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{
            wx.switchTab({
              url: '/pages/user/user',
            })
          }
        });
      
        return
      }
      wx.navigateTo({
        url: '/pages/order/order',
      })
  },
  // 获取赛事列表
  debounceGetList() {
    clearTimeout(this.data.timer)
    let timer = setTimeout(() => {
      this.getList()
    }, 1000)
    this.setData({
      timer: timer
    })
  },
  // 获取当前页
  getList() {
    console.log('当前页' + this.data.page);
    wx.showLoading({
      mask: true,
    });
    let that = this
    api.post('event/list', {
      page: this.data.page,
      pageSize: 10,
    }).then(res => {
      let arr = res.records
      arr.forEach(ele => {
        ele.beginTime = ele.beginTime.slice(0, 10)
        ele.endTime = ele.endTime.slice(0, 10)
      });
      let orginArr = that.data.raceList
      orginArr.push(...arr)
      that.setData({
        totalList: res.total, 
        raceList: orginArr
      })
      wx.stopPullDownRefresh()
      wx.hideLoading();
    })
  },
  // 底部加载更多
  getMoreList() {
    let {totalList, raceList, page} = this.data
    if (totalList <= raceList.length) {return}
    this.setData({
      page: Number(page) + 1,
    })
    this.debounceGetList()
  },

  onLoad: function () {
    // this.getList()
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  }
})
