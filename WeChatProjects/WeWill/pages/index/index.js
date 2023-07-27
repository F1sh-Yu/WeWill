// pages/index/index.js

const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    futureDayList:[]
  },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const result = await app.call({
      path:`/memory/list/get/v1/?page=1&size=3&future=1`,
      method:'GET',
      data: {
      }
    })
  console.log(result)
  if (result.code == 0) {
    this.setData({
       futureDayList:result.data.sort(function(a,b){return a.days-b.days})
    })
  }
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