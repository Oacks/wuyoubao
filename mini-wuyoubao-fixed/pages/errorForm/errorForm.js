// pages/order/order.js
let app = getApp().globalData;
import api from '../../api/api'
const qiniuUploader = require("../../utils/qiniuUploader");
function initQiniu() {
  var options = {
      region: 'SCN',
      // 获取uptoken方法三选一即可，执行优先级为：uptoken > uptokenURL > uptokenFunc。三选一，剩下两个置空。推荐使用uptokenURL，详情请见 README.md
      // 由其他程序生成七牛云uptoken，然后直接写入uptoken
      uptoken: '',
      // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
      uptokenURL: 'https://[yourserver.com]/api/uptoken',
      // uptokenFunc 这个属性的值可以是一个用来生成uptoken的函数，详情请见 README.md
      uptokenFunc: function () { 
          return qiniuUploadToken;
      },
      // bucket 外链域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 fileURL 字段。否则需要自己拼接
      domain: 'http://[yourBucketId].bkt.clouddn.com',
      // qiniuShouldUseQiniuFileName 如果是 true，则文件的 key 由 qiniu 服务器分配（全局去重）。如果是 false，则文件的 key 使用微信自动生成的 filename。出于初代sdk用户升级后兼容问题的考虑，默认是 false。
      // 微信自动生成的 filename较长，导致fileURL较长。推荐使用{qiniuShouldUseQiniuFileName: true} + "通过fileURL下载文件时，自定义下载名" 的组合方式。
      // 自定义上传key 需要两个条件：1. 此处shouldUseQiniuFileName值为false。 2. 通过修改qiniuUploader.upload方法传入的options参数，可以进行自定义key。（请不要直接在sdk中修改options参数，修改方法请见demo的index.js）
      // 通过fileURL下载文件时，文件自定义下载名，请参考：七牛云“对象存储 > 产品手册 > 下载资源 > 下载设置 > 自定义资源下载名”（https://developer.qiniu.com/kodo/manual/1659/download-setting）。本sdk在README.md的"常见问题"板块中，有"通过fileURL下载文件时，自定义下载名"使用样例。
      shouldUseQiniuFileName: false
  };
  // 将七牛云相关配置初始化进本sdk
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    ctrl: '', //查看还是删除
    tempFilePaths: '',
    dialogVisible: false,
    uploadOperate: '',
    formDataCopy: {},
    uploadToken: '',
    logFile: [
    ],
    shopName: '',
    // 详情返回的字段
    form: {
      contractNo: '',
      licensePlate: '',
      memberName: '',
      mobile: '',
      reason: '',
      picList: [],
    },
  },
  
  toSelectBrand() {
    wx.navigateTo({
      url: '/pages/shopList/shopList',
    })
  },
  bindTimeChange(target, val) {
    this.setData({
      [target]: val
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
      contractNo,
      licensePlate,
      memberName,
      mobile,
      reason,
      } = form
    let params = {
      contractNo:contractNo,
      licensePlate:licensePlate,
      memberName:memberName,
      mobile:mobile,
      reason:reason,
      shopName:this.data.shopName,
      picList:this.data.form.picList || [],
    }
    let valid = await this.validate(params)
    if (!valid) {return}
    api.post('member/createGuarantee', params).then(res => {
      // 打开重选列表
      wx.showToast({
        title: '报障结果提交成功,可到”我的报障“处查看',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/errorList/errorList',
        });
      }, 1000)
    })
   
    console.log(form);
  },
  validate(obj) {
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
  // 返回
  onBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取合同详情
  getErrorDetail(id){
    api.get('member/guaranteeDetail', {id: id}).then((result => {
      let res = result.detail
      let logFile = result.logFile
      let file = result.file
      let picList = []
      for (let i = 0; i < file.length; i++) {
        const element = file[i];
        picList.push(element.picUrl)
      }
      let form = {
        contractNo:id,
        licensePlate:res.licensePlate,
        memberName:res.memberName,
        mobile:res.mobile,
        reason: res.reason,
        picList: picList,
      }
      this.setData({
        form: form,
        shopName: res.shopName,
        logFile: logFile
      })
    }))
  },
  getToken() {
    api.get('file/uploadQniuToken', {}).then((res => {
      this.setData({
        uploadToken: res
      })
    }))
  },
  // 上传图片
  uploadPic() {
      var _this = this
      wx.chooseImage({
        count: 1, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function(res) {
          const filepath = res.tempFilePaths[0]
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          qiniuUploader.upload(filepath, res => {
            console.log(res)
            let list = _this.data.form.picList
            list.push('http://storage.sankinetwork.com' + res.imageURL)
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
    // 预览图片
    previewPic(e) {
      console.log(e);
      let url = e.currentTarget.dataset.url
      let list = e.currentTarget.dataset.urllist || [url]
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: list || []// 需要预览的图片http链接列表
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let ctrl = options.ctrl
    console.log(options);
    this.getToken()
    // console.log(id);
    if (id) {
      this.setData({
        ctrl: ctrl,
        id: id
      })
      this.getErrorDetail(id)
      return
    }
    try {
      let form = JSON.parse(options.form)
      this.setData({
        'form.contractNo': form.contractNo,
        'form.licensePlate': form.licensePlate,
        'form.memberName': form.memberName,
        'form.mobile': form.mobile,
      })

    }
    catch (err) {

    }
  },

 
  onShow: function () {
    // this.getProject()
  },

})