// pages/order/order.js
let app = getApp().globalData;
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    formDataCopy: {},
    uploadOperate: '',
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
    dialogVisible: false,
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
    let id = this.data.insuranceOpt[e.detail.value].id
    let price = this.data.insuranceOpt[e.detail.value].price
    this.setData({
      insuranceNo: e.detail.value, // 展示用,不传后台
      insuranceId: id,
      insurancePrice: price,
    })
  },
  formSubmit(e) {
    this.setData({
      dialogVisible: true,
      uploadOperate: e.detail.target.dataset.operate, // cerate, update
      formDataCopy: e.detail.value
    })
  },
  tapDialogButton(e) {
    let text = e.detail.item.text
    if (text == '确认') {
      if (this.data.uploadOperate == 'create') {
        this.order(this.data.formDataCopy)
      }
      if (this.data.uploadOperate == 'update') {
        this.updateOrder(this.data.formDataCopy)
      }
    }
    this.setData({
      dialogVisible: false
    })
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
      projectId: this.data.insuranceId,
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
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user',
        });
      }, 1000)
    })
  },
  // 更新订单
  updateOrder(form) {
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
      id: this.data.id,
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
      projectId: this.data.insuranceId,
      brand: this.data.carBrand,
      carType: this.data.carType,
      price: this.data.insurancePrice,
      carBuyTime: this.formatTime(this.data.carBuyTime), // 购买时间
      oldStartTime: this.formatTime(this.data.oldStartTime),
      oldEndTime: this.formatTime(this.data.oldEndTime),
      createTime: this.formatTime(this.data.createTime), // 延保销售日期
      startTime: this.formatTime(this.data.startTime), // 延保起期
    }
    api.post('sale/updateContract', params).then(res => {
      // 打开重选列表
      wx.showToast({
        title: '修改成功',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user',
        });
      }, 1000)
    })
  },
  // 获取无忧保邮品方案
  getProject(fn) {
    api.get('sale/getProject').then(res => {
      let list = []
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        list.push({
          id:element.id,
          name: `车价：${element.priceCarStart}-${element.priceCarEnd}(${element.insuranceName})`,
          cardName: element.insuranceName,
          price: element.priceContract,
          priceCarStart: element.priceCarStart,
          priceCarEnd: element.priceCarEnd,
        })
      }
      this.setData({
        insuranceOpt: list
      })
      fn && fn()
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
  getContractDetail(){
    api.get('member/contractDetail', {mobile: wx.getStorageSync('mobile')}).then((res => {
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
        startTime,
        picList} = res
        let handlePicList = []
        for (let i = 0; i < picList.length; i++) {
          const element = picList[i];
          if (element.type) {
            handlePicList[Number(element.type)] = element
          }
        }
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
        picList: handlePicList
      }
      console.log(picList);
      let insuranceNo = 0
      for (let i = 0; i < this.data.insuranceOpt.length; i++) {
        const element = this.data.insuranceOpt[i];
        if(element.id == projectId) {
          insuranceNo = i
          break
        }
      }
      this.setData({
        form: form,
        insuranceId: insuranceId, // 所选卡券
        insurancePrice: price,
        carType: carType, // 车类型
        insuranceNo: insuranceNo,
        startTime: this.formatGetTime(startTime), // 延保起期
        createTime: this.formatGetTime(createTime), // 延保销售日期
        oldStartTime: this.formatGetTime(oldStartTime),
        oldEndTime: this.formatGetTime(oldEndTime) ,
        carBuyTime: this.formatGetTime(carBuyTime), // 购买时间
        carBrand: brand,
      })
    }))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.getContractDetail()
    if (id) {
      this.setData({
        id: id
      })
      // this.getProject(this.getContractDetail)
      this.getContractDetail()
    }
    else {
      // this.getProject()
    }
  },

 
  onShow: function () {
  },

})