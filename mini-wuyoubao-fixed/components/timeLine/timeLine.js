// components/process/process.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {type: Boolean, default: false},
    list: {type: Array, default: []},
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bigPic(e) {
     let data = e.currentTarget.dataset
    wx.previewImage({
      current: data.url, // 当前显示图片的http链接
      urls: [data.url] // 需要预览的图片http链接列表
    })
   }
  }
})
