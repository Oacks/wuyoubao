// pages/authorization/authorization.js
let app = getApp().globalData;
import api from '../../api/api'
// import list from '../../utils/brandList'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    brandList: '',
  },
  chooseBrand(event) {
    let brand = event.currentTarget.dataset.shopname
    console.log(brand);
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];  
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      shopName : brand
    })
    this.onBack()
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  getBrandList() {
    api.get('member/getBand', {}).then(res => {
      console.log(res);
      this.setData({
        brandList: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(list.brandList);
    // this.setData({
    //   brandList: list.brandList
    // })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBrandList()
  },




})