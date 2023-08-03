const app = getApp()

Page({
  options: {
    addGlobalClass: true
  },
  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    unfinishedList: '',
    finishedList: '', 
    screenWidth: 1000,
    screenHeight: 1000,
    slideButtons: [
      {extClass: 'markBtn', text: '标记', src: "/images/icon_mark.svg"},
      {extClass: 'starBtn', text: '星标', src: "/images/icon_edit.png"},
      {extClass: 'removeBtn', text: '删除', src: '/images/icon_del.svg'}
    ],
  },

  // onLoad(options) {
  //   this.setData({
  //     envId: options.envId
  //   });
  // },
  async onShow() {
    wx.showLoading({
      title: '',
    });
    const result = await app.call({
      path:`/wish/list/get/v1?page=1&size=10`,
      method:'GET',
      data: {
      }
    })
    if (result.code == 0) {
      this.setData({
        unfinishedList: result.data.unfinished_list,
        finishedList:result.data.finished_list,
        haveGetRecord:true
      })
    } else {
      wx.showToast({
        title: '列表加载失败',
        icon: 'error',
        duration: 3000
      })
    }
    wx.hideLoading()
  },

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
    });
  },

  async slideButtonTapUpper(event) {
    this.slideButtonTap(event, true)
  },

  //响应左划按钮事件[下]
  async slideButtonTapLower(event) {
    this.slideButtonTap(event, false)
  },

  async slideButtonTap(event, isUpper){
    const {index} = event.detail

    const missionIndex = event.currentTarget.dataset.index
    const mission = isUpper === true ? this.data.unfinishedList[missionIndex] : this.data.finishedList[missionIndex]

    if (index === 0) {
      if(isUpper) {
          this.finishMission(event)
      }else{
          wx.showToast({
              title: '任务已经完成',
              icon: 'error',
              duration: 2000
          })
      }
    }
    if (index === 1) {
        var id = mission.id
        wx.navigateTo({
          url: '/pages/add/index?type=edit&mission_id='+ id,
        })
    }
    if (index === 2) {
      const result = await app.call({
        path:`wish/item/delete/v1`,
        method:'POST',
        data: {
          id: mission.id
        }
      })
      if (result.code == 0) {
        let tmpFinishedList = this.data.finishedList
        let tmpUnFinishedList = this.data.unfinishedList
        if(isUpper) tmpUnFinishedList.splice(missionIndex, 1) 
        else tmpFinishedList.splice(missionIndex, 1)
        if (tmpUnFinishedList.length === 0 && tmpFinishedList.length === 0) {
          this.setData({
          unfinishedList: [],
          finishedList: []
          })
      } else {
        this.setData({
          finishedList: tmpFinishedList,
          unfinishedList:tmpUnFinishedList
        })
      }
      wx.removeStorage({
        key: "list"
      })
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'error',
          duration: 2000
          })
      }
    }
  },

  async finishMission(event) {
    const missionIndex = event.currentTarget.dataset.index
    const mission = this.data.unfinishedList[missionIndex]

    const result = await app.call({
      path:`wish/item/finish/v1`,
      method:'POST',
      data: {
        id: mission.id,
        finish: 1
      }
    })
    if (result.code == 0) {
      mission.finish = true
      let tmpFinishedList = this.data.finishedList
      let tmpUnFinishedList = this.data.unfinishedList
      tmpFinishedList.push(tmpUnFinishedList[missionIndex])
      tmpUnFinishedList.splice(missionIndex, 1)
      this.setData({
          finishedList: tmpFinishedList,
          unfinishedList:tmpUnFinishedList
      })
      wx.removeStorage({
        key: "list"
      })

      wx.showToast({
        title: '任务完成',
        icon: 'success',
        duration: 2000
    })
    } else {
      wx.showToast({
        title: '任务完成',
        icon: 'success',
        duration: 2000
      })
    }
  },

  async getScreenSize(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },

  async toAddPage() {
    wx.navigateTo({url: '/pages/add/index?type=add'})
  },

  toDetailPageLower(event){
    this.toDetailPage(event, false)
  },

  toDetailPageUpper(event){
    this.toDetailPage(event, true)
  },

  toDetailPage(event, isUpper){
    var that = this
    let data = that.data
    const missionIndex = event.currentTarget.dataset.index
    const mission = isUpper === true ? this.data.unfinishedList[missionIndex] : this.data.finishedList[missionIndex] 

    mission["showDetail"] = !mission["showDetail"]
    that.setData(data)
  }
});
