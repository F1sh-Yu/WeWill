// index.js
const app = getApp()

Page({
  data:{
    curDate:"2023-03-17",
    presetIndex: 0,
    presets:[{
      name:'想要一起做的事'
    },
    {
      name:'想要一起去的地方'
    },
    {
      name:'想要一起吃的东西'
    }],
  },

   async formSubmit(e) {
    const result = await app.call({
      path:'/memory/day/post/v1/',
      method:'POST',
      data: {
          title:e.detail.value.title,
          description: e.detail.value.desc,
          date:e.detail.value.date,
      }
    })
    console.log(result)
  },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
    })
  },

  onTimeChange(e){
      this.setData({
          curDate: e.detail.value,
      })
  },

  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  async handleTap() {
    await this.saveMission();
  },

  async saveMission(e) {
    const result = await app.call({
      path:'/memory/day/post/v1/',
      method:'POST',
      data: {
          title:this.data.title,
          description: this.data.description,
          date:this.data.curDate,
      }
    })
    if (result.code == 0 ) {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
    })
    }
  }
})