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
    orderStatus: '', // 订单状态
    // 详情返回的字段

    insuranceId: '', // 所选卡券
    insurancePrice: '',
    carType: 0, // 车类型
    insuranceNo: '',
    startTime: '', // 延保起期
    createTime: '', // 延保销售日期
    oldStartTime: '',
    oldEndTime: '',
    carBuyTime: '', // 购买时间
    carBrand: '',
    canSend: true,
    sendLater: 60,
    form: {
      contractNo: '',
      memberName: '',
      mobile: '',
      address: '',
      vehicle: '',
      carType: 0,
      vin: '',
      engineNum: '',
      licensePlate: '',
      carPrice: '',
      insuranceNo: '',
      mileage: '',
      code: '',
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
  mobileInput(e) {
    this.setData({
      'form.mobile': e.detail.value
    })
  },
  // 修改车价
  carPriceChange(e) {
    console.log(e.detail.value);
    let price = e.detail.value 
    if (price) {
      // this.debounceGetPrice(price)
      this.getProjectFromPrice(price)
    }
  },
  // 获取验证码
  getCode() {
    if(!this.data.canSend) {return}
    api.get('wx/getSms2', {
      type: 1, // 客户端
      mobile: this.data.form.mobile
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
  sendCodeLater() {
    let that = this
    this.setData({
      canSend: false
    })
    this.countDown()
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
  async order(form) {
    let {
      memberName,
      mobile,
      address,
      vin,
      engineNum,
      licensePlate,
      carPrice,
      mileage,
      code,
      vehicle} = form
    let params = {
      code: code,
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
      // startTime: this.formatTime(this.data.startTime), // 延保起期
    }
    let valid = await this.validate(params)
    if (!valid) {return}
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
  validate(obj) {
    console.log(obj);

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (element === null || element === undefined || element === '') {
          wx.showToast({
            title: '请完成各项表单项的填写',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
          return false
        }
      }
    }
    return true
  },
  // 更新订单
  async updateOrder(form) {
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
      status: '0',
      // startTime: this.formatTime(this.data.startTime), // 延保起期
    }
    console.log(params);
    let valid = await this.validate(params)
    if (!valid) {return}
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
      console.log(list);
      this.setData({
        insuranceOpt: list
      })
      fn && fn()
    })
  },
  // 车价获取方案
  getProjectFromPrice(val) {
    console.log(val);
    api.get('sale/getProject', {money: val}).then(res => {
      if (!res) {
        // wx.showToast({
        //   title: '当前车价没有对应产品价钱',
        //   icon: 'none',
        //   image: '',
        //   duration: 1500,
        //   mask: false,
        // });
        this.setData({
          insuranceId: '',
          insurancePrice: '',
        })
        return
      }
      this.setData({
        insuranceId: res.id || '',
        insurancePrice: res.priceContract || '',
      })
    })
  },
  debounce(fn, delay) {
    let timer
    return () => {
      let context = this
      let args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
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
    api.get('sale/contractDetail', {id: id ? id : this.data.id}).then((res => {
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
        status,
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

      }
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
        orderStatus: status,
        insuranceId: projectId, // 所选卡券
        insurancePrice: price,
        carType: carType, // 车类型
        insuranceNo: insuranceNo,
        // startTime: this.formatGetTime(startTime), // 延保起期
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
    // this.debounceGetPrice = this.debounce(this.getProjectFromPrice, 500) // 初始化debounce方法
    let id = options.id
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