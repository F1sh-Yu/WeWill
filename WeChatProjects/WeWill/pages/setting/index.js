// pages/setting/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgSrc:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  chooseImg() {
    wx.navigateTo({url: '/pages/cropper/index'})
  },

  async uploadImg() {
      const result = await app.uploadFile(this.data.imgSrc, 'src/index/', '1.jpg' , function(res){
        console.log(`上传进度：${res.progress}%，已上传${res.totalBytesSent}B，共${res.totalBytesExpectedToSend}B`)
      })
      if(result=='error') {
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration : 3000, 
        })
      } else {
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration : 3000, 
        })
        this.resetImg()
      }
  },

  resetImg() {
    this.setData({
      imgSrc:''
    })
  }
})