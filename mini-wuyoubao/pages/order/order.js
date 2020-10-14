// pages/order/order.js
let app = getApp().globalData;
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',


    // 详情返回的字段

    insuranceId: '', // 所选卡券
    insurancePrice: '',
    carType: '', // 车类型
    insuranceNo: '',
    startTime: '', // 延保起期
    createTime: '', // 延保销售日期
    oldStartTime: '',
    oldEndTime: '',
    carBuyTime: '', // 购买时间
    carBrand: '',
    form: {
      contractNo: '',
      memberName: '',
      mobile: '',
      address: '',
      vehicle: '',
      carType: '',
      vin: '',
      engineNum: '',
      licensePlate: '',
      carPrice: '',
      insuranceNo: '',
      mileage: '',
    },

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
    this.bindTimeChange('carBuyTime', e.detail.value)
  },
  bindOldStartTimeChange: function(e) {
    this.bindTimeChange('oldStartTime', e.detail.value)
  },
  bindOldEndTimeChange: function(e) {
    this.bindTimeChange('oldEndTime', e.detail.value)
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
      carBuyTime: this.formatTime(this.data.carBuyTime), // 购买时间
      oldStartTime: this.formatTime(this.data.oldStartTime),
      oldEndTime: this.formatTime(this.data.oldEndTime),
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
      wx.switchTab({
        url: '/pages/user/user',
      });
    })
    console.log(form);
  },
  // 获取无忧保邮品方案
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
  // 获取时候截取时间
  formatGetTime(time) {
    if (time) {
      return time.slice(0, 10)
    }
    return ''
  },
  // 获取合同详情
  getContractDetail(id){
    api.get('sale/contractDetail', {id: id}).then((res => {
      console.log(res);
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
        insuranceId: insuranceId,
        brand: carBrand,
        carType: carType,
        price: insurancePrice,
        carBuyTime: this.formatGetTime(carBuyTime), // 购买时间
        oldStartTime: this.formatGetTime(oldStartTime),
        oldEndTime: this.formatGetTime(oldEndTime),
        createTime: this.formatGetTime(createTime), // 延保销售日期
        startTime: this.formatGetTime(startTime), // 延保起期
      }
      this.setData({
        form: form
      })
    }))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    if (id) {
      this.setData({
        id: id
      })
      this.getContractDetail(id)
    }
  },

 
  onShow: function () {
    this.getProject()
  },

})