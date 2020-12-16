// pages/order/order.js
let app = getApp().globalData;
import api from '../../api/api'
const qiniuUploader = require("../../utils/qiniuUploader");
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
        uploadToken: '',

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
            picList: []
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
            this.debounceGetPrice(price)
            // this.getProjectFromPrice(price)
        }
    },
    // 获取验证码
    getCode() {
        if (!this.data.canSend) { return }
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
                success: (result) => {
                    that.sendCodeLater()
                },

            });
        })
    },
    sendCodeLater() {
        let that = this
        this.setData({
            canSend: false,
        })
        this.countDown(60)
        setTimeout(() => {
            that.setData({
                canSend: true
            })
        }, 60000)
    },
    countDown(sec) {
        if (sec === 0) { return }
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
    bindCreateTimeChange: function (e) {
        this.bindTimeChange('createTime', e.detail.value)
    },
    bindStartTimeChange: function (e) {
        this.bindTimeChange('startTime', e.detail.value)
    },
    bindBuyTimeChange: function (e) {
        this.bindTimeChange('carBuyTime', e.detail.value)
        this.bindTimeChange('oldStartTime', e.detail.value)
        let time = e.detail.value.split('-');
        let oldEndTime = Number(time[0]) + 3 + '-' + time[1] + '-' + time[2]
        this.bindTimeChange('oldEndTime', oldEndTime)
    },
    bindOldStartTimeChange: function (e) {
        this.bindTimeChange('carBuyTime', e.detail.value)
        this.bindTimeChange('oldStartTime', e.detail.value)
    },
    bindOldEndTimeChange: function (e) {
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
    // 预览图片
    previewPic(e) {
        let url = e.currentTarget.dataset.url
        let list = e.currentTarget.dataset.urllist || [url]
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: list || []// 需要预览的图片http链接列表
        })
    },
    getToken() {
        api.get('file/uploadQniuToken', {}).then((res => {
            this.setData({
                uploadToken: res
            })
        }))
    },
    // 上传图片
    uploadPic(tar) {
        var _this = this
        wx.chooseImage({
            count: 1, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {
                const filepath = res.tempFilePaths[0]
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                qiniuUploader.upload(filepath, res => {
                    console.log(res)
                    let list = _this.data.form.picList
                    // list[tar.target.dataset.listno] = ('http://storage.sankinetwork.com' + res.imageURL)
                    list[tar.target.dataset.listno] = {
                        pic: 'http://storage.sankinetwork.com' + res.imageURL,
                        type: Number(tar.target.dataset.listno)
                    }
                    console.log(list);

                    _this.setData({
                        'form.picList': list
                    })
                }, (error) => {
                    console.log('error' + error)
                }, {
                    bucket: 'sanki',
                    region: 'SCN',
                    uptoken: _this.data.uploadToken,
                })
            }
        })
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
            vehicle,
            price } = form
        let params = {
            // code: code,
            memberName: memberName,
            mobile: mobile,
            address: address,
            vin: vin,
            engineNum: engineNum,
            carPrice: carPrice,
            // mileage: mileage,
            vehicle: vehicle,
            projectId: this.data.insuranceId,
            brand: this.data.carBrand,
            carType: this.data.carType,
            price: price,
            carBuyTime: this.formatTime(this.data.carBuyTime), // 购买时间
            oldStartTime: this.formatTime(this.data.oldStartTime),
            oldEndTime: this.formatTime(this.data.oldEndTime),
            createTime: this.formatTime(this.data.createTime), // 延保销售日期
            // startTime: this.formatTime(this.data.startTime), // 延保起期
            // picList: this.data.form.picList // 图片列表跳过校验
        }
        if (!params.projectId) {
            wx.showToast({
                title: '当前车价没有对应的定价，请修改车价',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
            });
            return
        }
        let valid = await this.validate(params)
        if (!valid) { return }
        params.mileage = mileage;// 里程跳过校验
        params.licensePlate = licensePlate // 车牌跳过校验
        params.picList = this.data.form.picList // 图片列表跳过校验

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
                    url: '/pages/index/index',
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
        // 图片校验
        // if (obj.picList.length !== 6) {
        //   wx.showToast({
        //     title: '请上传相关图片',
        //     icon: 'none',
        //     image: '',
        //     duration: 1500,
        //     mask: false,
        //   });
        //   return false
        // }
        // for (let i = 0; i < obj.picList.length; i++) {
        //   const element = obj.picList[i];
        //   if (element === null || element === undefined || element === '') {
        //     return false
        //   }
        // }
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
            vehicle,
            price } = form
        let params = {
            id: this.data.id,
            contractNo: contractNo,
            memberName: memberName,
            mobile: mobile,
            address: address,
            vin: vin,
            engineNum: engineNum,
            carPrice: carPrice,
            vehicle: vehicle,
            projectId: this.data.insuranceId,
            brand: this.data.carBrand,
            carType: this.data.carType,
            price: price,
            carBuyTime: this.formatTime(this.data.carBuyTime), // 购买时间
            oldStartTime: this.formatTime(this.data.oldStartTime),
            oldEndTime: this.formatTime(this.data.oldEndTime),
            createTime: this.formatTime(this.data.createTime), // 延保销售日期
            // startTime: this.formatTime(this.data.startTime), // 延保起期
            // picList: this.data.form.picList,
            status: this.data.orderStatus == '1' ? '0' : this.data.orderStatus, // 不同意的1的话改成0，其余保持
        }
        if (!params.projectId) {
            wx.showToast({
                title: '当前车价没有对应的定价，请修改车价',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
            });
            return
        }
        let valid = await this.validate(params)
        if (!valid) { return }
        params.mileage = mileage;// 里程跳过校验
        params.licensePlate = licensePlate // 车牌跳过校验
        params.picList = this.data.form.picList // 图片列表跳过校验

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
                    url: '/pages/index/index',
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
                    id: element.id,
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
        api.get('sale/getProject', { money: val }).then(res => {
            if (!res) {
                wx.showToast({
                    title: '当前车价没有对应产品定价',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                    mask: false,
                });
                this.setData({
                    insuranceId: '',
                    // insurancePrice: '',
                })
                return
            }
            this.setData({
                insuranceId: res.id || '',
                // insurancePrice: res.priceContract || '',
            })
        })
    },
    debounce(fn, delay) {
        let timer
        return function () { // 这里不能用箭头函数
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
    getContractDetail(id) {
        api.get('sale/contractDetail', { id: id ? id : this.data.id }).then((res => {
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
                startTime,
                picList } = res
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
                picList: handlePicList
            }
            console.log(picList);
            let insuranceNo = 0
            for (let i = 0; i < this.data.insuranceOpt.length; i++) {
                const element = this.data.insuranceOpt[i];
                if (element.id == projectId) {
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
                oldEndTime: this.formatGetTime(oldEndTime),
                carBuyTime: this.formatGetTime(carBuyTime), // 购买时间
                carBrand: brand,
            })
        }))
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getToken()
        this.debounceGetPrice = this.debounce(this.getProjectFromPrice, 500) // 初始化debounce方法
        let id = options.id
        if (id) {
            this.setData({
                id: id,
            })
            // this.getProject(this.getContractDetail)
            this.getContractDetail()
        }
        else {
            // this.getProject()
        }
        let date = new Date()
        let year = date.getFullYear()
        let month = String(date.getMonth() + 1).padStart(2, 0)
        let day = String(date.getDate()).padStart(2, 0)

        this.setData({
            createTime: `${year}-${month}-${day}`
        })
    },


    onShow: function () {
    },

})