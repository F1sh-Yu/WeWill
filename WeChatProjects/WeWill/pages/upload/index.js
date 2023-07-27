// pages/image/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async onLoad() {
    const that = this
    await wx.chooseMedia({
      count: 1,
      async success(res){
        const result = await that.uploadFile(res.tempFiles[0].tempFilePath, 'test/test.png', function(res){
          console.log(`上传进度：${res.progress}%，已上传${res.totalBytesSent}B，共${res.totalBytesExpectedToSend}B`)
          // if(res.progress > 50){ // 测试文件上传一半就终止上传
          //   return false
          // }
        })
        console.log(result)
      }
    })
  },
  /**
   * 上传文件到微信云托管对象存储
   * @param {*} file 微信本地文件，通过选择图片，聊天文件等接口获取
   * @param {*} path 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
   * @param {*} onCall 上传回调，文件上传过程监听，返回false时会中断上传
   */
  uploadFile(file, path, onCall = () => {}) {
    return new Promise((resolve, reject) => {
      const task = wx.cloud.uploadFile({
        cloudPath: path,
        filePath: file,
        config: {
          env: 'prod-9g3364rpf16bf509' // 需要替换成自己的微信云托管环境ID
        },
        success: res => resolve(res.fileID),
        fail: e => {
          const info = e.toString()
          if (info.indexOf('abort') != -1) {
            reject(new Error('【文件上传失败】中断上传'))
          } else {
            reject(new Error('【文件上传失败】网络或其他错误'))
          }
        }
      })
      task.onProgressUpdate((res) => {
        if (onCall(res) == false) {
          task.abort()
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})