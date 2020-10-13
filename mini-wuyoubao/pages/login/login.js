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
  },
  // 返回
  onBack() {
    wx.switchTab({
      url: '/pages/user/user',
    });// 跳到用户页面
    // wx.navigateBack({
    //   delta: 1
    // })
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
    api.post('wx/loginByMobile', {
      mobile: this.data.mobile,
      code: this.data.code,
      type: '0' // 销售0 用户1
    }).then(res => {
      let that = this
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[ pages.length - 2 ];  
      prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        mobile : this.data.mobile
      })
      wx.setStorageSync('mobile', this.data.mobile);
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      
      setTimeout(() => {
        that.onBack()
      }, 1000)
      console.log(res);
    })
  },
  sendCodeLater() {
    let that = this
    this.setData({
      canSend: false
    })
    setTimeout(() => {
      that.setData({
        canSend: true
      })
    }, 60000)
  },
  getCode() {
    if(!this.data.canSend) {return}
    api.get('wx/getSms', {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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