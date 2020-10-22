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
    mobile: '',
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
        }, 1000)
        return
      }
      wx.navigateTo({
        url: '/pages/order/order',
      })
  },

  checkOrder() {
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
      }, 1000)
      return
    }
    wx.navigateTo({
      url: '/pages/orderList/orderList',
    })
  },
  

  onLoad: function () {
    // user方法
    if(wx.getStorageSync('mobile')) {
      this.setData({
        mobile: wx.getStorageSync('mobile')
      })
    }
  },
  loginHandler() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  // 登录操作
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
        api.post('wx/sale/getSalerInfo', {
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
    api.post('wx/sale/login', {code: code}).then((res) => {
      wx.setStorageSync('sessionKey', res.session_key);
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
                    console.log(sessionKey);
                    if (!sessionKey || !that.data.mobile) {return}
                    api.post('wx/sale/getSalerInfo', {
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
  onShow: function() {
    // user方法
    if (wx.getStorageSync('sessionKey')) {
      this.checkAuthorization()
    }
    let that = this
    
    // 查看是否授权
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        let sessionKey = wx.getStorageSync('sessionKey');
        // if (!sessionKey) {
           that.login() // 获取wx-token
        // }
   
      },
      fail () {
        console.log('session_key 已经失效，需要重新执行登录流程');
        // session_key 已经失效，需要重新执行登录流程
        that.login() //重新登录
      }
    })
  }
})
