// pages/login/login.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    code: '',
    canSend: true,
    sendLater: 60,
    mobileFocus: false,
    codeFocus: false,
  },
  // 返回
  onBack() {
    wx.switchTab({
      url: '/pages/index/index',
    });// 跳到用户页面
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  login () {
    let that = this
    api.post('wx/loginByMobile', {
      mobile: this.data.mobile,
      code: this.data.code,
      type: '0' // 销售0 用户1
    }).then(res => {
      wx.setStorageSync('mobile', this.data.mobile);
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.wxlogin()
      setTimeout(() => {
        this.onBack()
      }, 1000)
      console.log(res);
    })
  },
  wxlogin (callback) {
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
        }
      },
      fail () {
      }
    })
  },
  backendLogin(code) {
    let self = this
    api.post('wx/sale/login', {code: code}).then((res) => {
      wx.setStorageSync('sessionKey', res.session_key);
      wx.hideLoading();

      self.checkAuthorization()
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
                      // let sessionKey = wx.getStorageSync('sessionKey')
                      if (!wx.getStorageSync('sessionKey') || !wx.getStorageSync('mobile')) {return}
                      api.post('wx/sale/getSalerInfo', {
                        signature: signature,
                        rawData: rawData,
                        encryptedData: encryptedData,
                        iv: iv,
                        mobile: wx.getStorageSync('mobile'),
                        sessionKey: wx.getStorageSync('sessionKey'),
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
  sendCodeLater() {
    let that = this
    this.setData({
      canSend: false
    })
    this.countDown(60)
    setTimeout(() => {
      that.setData({
        canSend: true
      })
    }, 60000)
  },
  countDown(sec) {
    if (sec === 0) {return}
    let second = sec || 60
    this.setData({
      sendLater: second
    })
    setTimeout(() => {
      let time = this.data.sendLater
      this.countDown(time - 1)
    }, 1000)
  },
  getCode() {
    if(!this.data.canSend) {return}
    api.get('wx/getSms', {
      type: 0, // 销售端
      mobile: this.data.mobile
    }).then(res => {
      let that = this
      wx.showToast({
        title: '发送成功，请查看手机',
        icon: 'none',
        duration: 1500,
        mask: false,
        success: (result)=>{
          that.sendCodeLater()
        },
       
      });
    })
  },
  getPhoneNumber(e) {
    let {encryptedData, iv} = e.detail
    this.setData({
      encryptedData: encryptedData,
      iv: iv,
    })
    api.login(this.requestPhone)
  },
  focusMobile () {
    this.setTrue('mobileFocus')
  },
  blurMobile () {
    this.setFalse('mobileFocus')
  },
  focusCode () {
    this.setTrue('codeFocus')
  },
  blurCode () {
    this.setFalse('codeFocus')
  },
  setTrue(tar) {
    this.setData({
      [tar]: true
    })
  },
  setFalse(tar) {
    this.setData({
      [tar]: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})