// index.js
const app = getApp()

Page({
  data:{
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

  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
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

  async saveMission() {
    const result = await app.call({
      path:'/wish/item/post/v1/',
      method:'POST',
      data: {
          description: this.data.desc,
          category: this.data.presets[this.data.presetIndex].name,
          title:this.data.title
      }
    })
    if(result.code == 0) {
      wx.removeStorage({
        key: 'list',
      })
      wx.navigateBack({
        delta:1
      }
      )
    }
  }
})