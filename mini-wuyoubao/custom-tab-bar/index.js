Component({
  data: {
    selected: '',
    color: "#fff",
    selectedColor: "#fff",
    backgroundColor: "#fff",
    list: []
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      console.log(
        data.index
      )
      this.setData({
        selected: data.index
      })
    }
  }
})