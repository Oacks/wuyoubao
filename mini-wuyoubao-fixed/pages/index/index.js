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
    imgsArr: [{ url: "/images/ui/index-1.png" }, { url: "/images/ui/index-2.png" }, { url: "/images/ui/index-3.png" }],
    currentSwiper: 0,
    previousmargin: '0',//前边距
    nextmargin: '0',//后边距
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
        wx.navigateTo({
          url: '/pages/login/login',
        })
      },1000)
    
      return
    }
    api.get('member/contractDetail', {mobile: wx.getStorageSync('mobile')}).then((res => {
      console.log(res);
      if (!res) {return}
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
  // 查看订单
  checkOrder() {
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },

  // 查看故障单
  checkError() {
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    wx.navigateTo({
      url: '/pages/errorList/errorList',
    });
  },

  onLoad: function () {
    if(wx.getStorageSync('mobile')) {
      this.setData({
        mobile: wx.getStorageSync('mobile')
      })
    }
    let that = this
    // 查看是否授权
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        let sessionKey = wx.getStorageSync('sessionKey');
          that.login()
      },
      fail () {
        console.log('session_key 已经失效，需要重新执行登录流程');
        // session_key 已经失效，需要重新执行登录流程
        that.login() //重新登录
      }
    })
  },
  loginHandler() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  // 登录接口
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        //插入登录的用户的相关信息到数据库
        let {signature, rawData, encryptedData, iv} = e.detail
        if (this.data.mobile) {
          return
        }
        wx.navigateTo({
          url: '/pages/login/login',
        });
        if (!wx.getStorageSync('sessionKey') || !that.data.mobile){return}
        api.post('wx/member/getUserInfo', {
          signature: signature,
          rawData: rawData,
          encryptedData: encryptedData,
          iv: iv,
          mobile: that.data.mobile,
          sessionKey: wx.getStorageSync('sessionKey'),
        }).then(res => {
          console.log("getuserinfo成功！");
        })
      } else {
        //用户按了拒绝按钮
        wx.showModal({
            title:'警告',
            content:'您点击了拒绝授权，将无法执行用户操作!',
            showCancel:false,
            confirmText:'返回授权',
            success:function(res){
                if (res.confirm) {
                    console.log('用户点击了“返回授权”')
                } 
            }
        })
    }
  },
    // 登录
    login (callback) {
      let self = this
      wx.showLoading()
      wx.login({
        success (res) {
          console.log(res)
          if (res.code) {
            // 登录成功，获取用户信息
            self.backendLogin(res.code)
            wx.hideLoading();
          } else {
            // 否则弹窗显示，showToast需要封装
            // showToast()
          }
        },
        fail () {
          // showToast()
        }
      })
    },
    
    // 调用后台登录接口
    backendLogin(code) {
      let self = this
      api.post('wx/member/login', {code: code}).then((res) => {
        if (res.session_key) {
          wx.setStorageSync('sessionKey', res.session_key);
        }
        wx.setStorageSync('openid', res.openId);
        wx.hideLoading();
  
        // self.checkAuthorization()
      })
    },
    // 查询授权
    checkAuthorization() {
      let that = this
      wx.getSetting({
        success: function (res) {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: function (res) {
                    let {signature, rawData, encryptedData, iv} = res
                    let sessionKey = wx.getStorageSync('sessionKey')
                    if (!sessionKey || !that.data.mobile) {return}
                    api.post('wx/member/getUserInfo', {
                      signature: signature,
                      rawData: rawData,
                      encryptedData: encryptedData,
                      iv: iv,
                      mobile: that.data.mobile,
                      sessionKey: sessionKey,
                    }).then((res) => {
                      if (res && res.openId) {wx.setStorageSync('openid', res.openId);}
                      
                    }).catch((error) => {
                      console.log(error);
                    })
                  }
              });
            }
          }
        })
      },
})
