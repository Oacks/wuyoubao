// pages/order/order.js
let app = getApp().globalData;
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carType: '', // 车类型
    buyTime: '', // 购买时间
    oldTime: '',
    createTime: '', // 延保销售日期
    startTime: '', // 延保起期
    carBrand: '',
    insuranceId: '', // 所选卡券
    insuranceNo: '',
    insurancePrice: '',
    carTypeOpt: [
      {
        id: 0,
        name: '新车'
      },
      {
        id: 1,
        name: '旧车'
      },
    ],
    insuranceOpt: [],

  },
  toSelectBrand() {
    wx.navigateTo({
      url: '/pages/brand/brand',
    })
  },
  bindTimeChange(target, val) {
    this.setData({
      [target]: val
    })
  },
  bindCreateTimeChange: function(e) {
    this.bindTimeChange('createTime', e.detail.value)
  },
  bindStartTimeChange: function(e) {
    this.bindTimeChange('startTime', e.detail.value)
  },
  bindBuyTimeChange: function(e) {
    this.bindTimeChange('buyTime', e.detail.value)
  },
  bindOldTimeChange: function(e) {
    this.bindTimeChange('oldTime', e.detail.value)
  },
  //
  bindCarTypeChange(e) {
    this.setData({
      carType: e.detail.value
    })
  },
  bindInsuranceChange(e) {
    console.log(e.detail.value);
    let id = this.data.insuranceOpt[e.detail.value].id
    let price = this.data.insuranceOpt[e.detail.value].price
    console.log(price);
    this.setData({
      insuranceNo: e.detail.value, // 展示用,不传后台
      insuranceId: id,
      insurancePrice: price,
    })
  },
  formSubmit(e) {
    this.order(e.detail.value)
  },
  formatTime(str) {
    return str + ' 00:00:00'
  },
  // 下单
  order(form) {
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
      vehicle} = form
    let params = {
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
      insuranceId: this.data.insuranceId,
      brand: this.data.carBrand,
      carType: this.data.carType,
      price: this.data.insurancePrice,
      buyTime: this.formatTime(this.data.buyTime), // 购买时间
      oldTime: this.formatTime(this.data.oldTime),
      createTime: this.formatTime(this.data.createTime), // 延保销售日期
      startTime: this.formatTime(this.data.startTime), // 延保起期
    }
    api.post('sale/createContract', params).then(res => {
      // 打开重选列表
      wx.showToast({
        title: '创建成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    })
    console.log(form);
  },
  // 获取无忧宝邮品方案
  getProject() {
    api.get('sale/getProject').then(res => {
      console.log(res);
      let list = []
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        list.push({
          id:element.id,
          name:element.insuranceName,
          price: element.priceContract
        })
      }
      this.setData({
        insuranceOpt: list
      })
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

 
  onShow: function () {
    this.getProject()
  },

})