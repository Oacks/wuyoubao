// pages/orderList/orderList.js
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    selectId: '',
    dialogVisible: false,
    totalCount: 0,
    saleList: [
    ]
  },
  getSaleList(status) {
      api.get('member/myGuarantee', {openId: wx.getStorageSync('openid')}).then(res => {
        let list = []
        if (status == 'add') {
          // 下啦加载更多
          list = this.data.saleList
          list.push(...res)
        }
        else {
          list = res
        }
        this.setData({
          saleList: list
        })
      })
  },
  showDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/errorForm/errorForm?id=' + id+'&ctrl=detail',
    });
  },
  reback(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      dialogVisible: true,
      selectId: id
    })
  },
  // 撤销确认
  rebackConfirm() {
    let id = this.data.selectId
    api.get('member/revoke', {id: id}).then(res => {
      console.log(res);
      wx.showToast({
        title: '撤销成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      this.getSaleList()
    })
  },
  tapDialogButton(e) {
    let text = e.detail.item.text
    if (text == '确认') {
      this.rebackConfirm()
    }
    this.setData({
      dialogVisible: false
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getSaleList()
  },
  // 底部加载更多
  getMoreList() {
    let {totalCount, saleList, pageNo} = this.data
    if (totalCount <= saleList.length) {return}
    this.setData({
      pageNo: Number(pageNo) + 1,
    })
    this.getSaleList('add')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.pageNo
    this.setData({
      pageNo: page + 1
    })
    // this.getMoreList()
  },

})