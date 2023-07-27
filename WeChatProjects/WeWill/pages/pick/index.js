const app = getApp()

Page({
  data:{
      item:'',
      allMemoryDays:[],
      pastDayList:[],
      futureDayList:[],
      screenWidth: 1000,
      screenHeight: 1000,
  },

  async onShow() {
    const result = await app.call({
        path:`/memory/list/get/v1/?page=0&size=0&future=0`,
        method:'GET',
        data: {
        }
      })
    console.log(result)
    if (result.code == 0) {
      this.setData({
         allMemoryDays:result.data
      })
      console.log(this.data.allMemoryDays)
      this.filterMission()
    }
    this.getScreenSize()
  },

  filterMission(){
    let memoryDayList = this.data.allMemoryDays
  
    this.setData({
      pastDayList: memoryDayList.filter(item => item.past === 1).sort(function(a,b){return b.days-a.days}),
      futureDayList: memoryDayList.filter(item => item.past === 0).sort(function(a,b){return a.days-b.days}),
    })
  },

  async toAddPage() {
    wx.navigateTo({url: '/pages/addMemoryDay/index'})
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
})