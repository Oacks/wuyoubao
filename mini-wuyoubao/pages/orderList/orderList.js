// pages/orderList/orderList.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    totalCount: 0,
    saleList: [
    ]
  },
  getSaleList() {
      api.get('sale/mySale', {page: this.data.pageNo, pageSize: this.data.pageSize, memberName: ''}).then(res => {
        console.log(res);
        this.setData({
          totalCount: res.total
        })
      })
  },
  showDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/order?id=' + id,
    });
  },
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageNo: 1
    })
    this.getSaleList()
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
  // 底部加载更多
  getMoreList() {
    let {totalCount, saleList, pageNo} = this.data
    if (totalCount <= saleList.length) {return}
    this.setData({
      pageNo: Number(pageNo) + 1,
    })
    this.getSaleList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.pageNo
    this.setData({
      pageNo: page + 1
    })
    this.getSaleList()
  },

})