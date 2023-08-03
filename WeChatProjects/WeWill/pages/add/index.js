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
    buttonType:'',
    missionId:0,
    imageUrl:''
  },

   onLoad: async function(options) {
      this.setData({
        buttonType: options.type,
      })
      if(this.data.buttonType=='edit') {
        const result = await app.call({
          path:'/wish/item/get/v1/',
          method:'GET',
          data: {
              id:options.mission_id
          }
        })
        if (result.code < 0) {
            wx.showToast({
              title: '加载数据失败，请返回重试',
              icon:'error',
              duration:3000,
            })
        } else {
          var index = 0
          for (let key in this.data.presets) {
            if(this.data.presets[key].name == result.data.category) {
               index = key
            }
          }
          console.log(result)
            this.setData({
                missionId:result.data.id,
                title: result.data.title,
                desc:result.data.description,
                imageUrl:result.data.image,
                presetIndex:index
              })
        }
      }
  },

  onPresetChange(e){
    this.setData({
      presetIndex:e.detail.value
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

  async handleTap(e) {
    if (e.currentTarget.dataset.type=='add'){
      await this.saveMission();
    } else {
      await this.updateMission();
    }
  },

  async saveMission() {
    const result = await app.call({
      path:'/wish/item/post/v1/',
      method:'POST',
      data: {
          description: this.data.desc,
          category: this.data.presets[this.data.presetIndex].name,
          title:this.data.title,
          image:this.data.imageUrl
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
  },

  async updateMission() {
    const result = await app.call({
      path:'/wish/item/update/v1/',
      method:'POST',
      data: {
          id: this.data.missionId,
          description: this.data.desc,
          category: this.data.presets[this.data.presetIndex].name,
          title:this.data.title,
          image:this.data.imageUrl
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
    } else {
        wx.showToast({
          title: '保存失败，请重新尝试',
          icon: 'error',
          duration: 3000
        })
    }
  },

  async uploadImage() {
    const that = this
    wx.chooseMedia({
      count: 1,
      async success(res){
        const result = await app.uploadFile(res.tempFiles[0].tempFilePath, 'wish/', '' , function(res){
          console.log(`上传进度：${res.progress}%，已上传${res.totalBytesSent}B，共${res.totalBytesExpectedToSend}B`)
        })
        if(result=='error') {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration : 3000, 
          })
        } else {
            that.setData({
              imageUrl:result
            })
          }
        }
    })
  },
})