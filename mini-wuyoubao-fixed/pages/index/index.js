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
    if (!wx.getStorageSync('wx-token') || !wx.getStorageSync('mobile')) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user',
        })
      },1000)
    
      return
    }
    api.get('member/contractDetail', {mobile: wx.getStorageSync('mobile')}).then((res => {
      console.log(res);
      if (res.status == 4) {
        let {
          contractNo,
          memberName,
          mobile,
          address,
          vin,
          engineNum,
          licensePlate,
          carPrice,
          mileage,
          vehicle,
          insuranceId,
          brand,
          carType,
          price,
          carBuyTime,
          oldStartTime,
          oldEndTime,
          createTime,
          projectId,
          startTime,} = res
        let form = {
          contractNo: contractNo,
          memberName: memberName,
          mobile: mobile,
          address: address,
          vin: vin,
          engineNum: engineNum,
          licensePlate: licensePlate,
          carPrice: carPrice,
          mileage: mileage,
          vehicle: vehicle,
          insurancePrice: price,
        }
        try {
          let strForm = JSON.stringify(form)
          wx.navigateTo({
            url: '/pages/errorForm/errorForm?form=' + strForm,
          })
          return 
        }
        catch(err) {}
      }
      else {
        wx.showToast({
          title: '当前用户未有生效保单',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        return
      }
     
    
    }))
  },
  

  onLoad: function () {
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
