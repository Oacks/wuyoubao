// pages/user/user.js
let app = getApp().globalData;
import api from '../../api/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasInfo: false,
    avatar: '/images/icon/icon-user.png',
    username: '',
    showActionsheet: false,
    returnIdentity: [], // 返回的身份列表
    page: 0,
    totalList: 0,
    timer: null,
    mobile: wx.getStorageSync('mobile'),
  },

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
        console.log(wx.getStorageSync('sessionKey'));
        console.log(that.data.mobile);
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

  // 授权界面
  auth() {
    // // 已经授权
    // if (this.data.hasInfo) {
    //   return
    // }
    // wx.navigateTo({
    //   url: '/pages/authorization/authorization',
    // });
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
    // wx.navigateTo({
    //   url: '/pages/orderList/orderList',
    // });
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
      app.sessionKey = res.session_key
      wx.hideLoading();

      self.checkAuthorization()
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log(1);
    this.setData({
      page: 0,
      raceList: []
    })
    this.getList()
  },
  // 查询授权
  checkAuthorization() {
    let that = this
    wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                    that.setData({
                      avatar: res.userInfo.avatarUrl,
                      username: res.userInfo.nickName
                    })
                    let {signature, rawData, encryptedData, iv} = res
                    let sessionKey = wx.getStorageSync('sessionKey')
                    console.log(sessionKey);
                    console.log(that.data.mobile);
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 切换tabbar
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    if (wx.getStorageSync('sessionKey')) {
      this.checkAuthorization()
    }
    let that = this
    // 查看是否授权
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        let sessionKey = wx.getStorageSync('sessionKey');
        if (!sessionKey) {
          that.login()
        }
        // 获取配置
        wx.getSetting({
          success: (res)=>{
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    hasInfo: true,
                    avatar: res.userInfo.avatarUrl,
                    username: res.userInfo.nickName
                  })
                }
              })
            }
            else {
              that.setData({
                hasInfo: false
              })
            }
          },
        });
      },
      fail () {
        console.log('session_key 已经失效，需要重新执行登录流程');
        // session_key 已经失效，需要重新执行登录流程
        that.login() //重新登录
      }
    })
  },
  onLoad: function() {
    if(wx.getStorageSync('mobile')) {
      this.setData({
        mobile: wx.getStorageSync('mobile')
      })
    }
  }
})