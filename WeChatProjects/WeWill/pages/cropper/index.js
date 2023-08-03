const app = getApp()

Page({
  data: {
      src:'',
      width:400,//宽度
      height: 224,//高度
  },
  onLoad: async function (options) {
//获取到image-cropper实例
      this.cropper = this.selectComponent("#image-cropper");
      this.cropper.disableSize
      this.cropper.upload()
      //开始裁剪
      wx.showLoading({
          title: '加载中'
      })
  },
  cropperload(e){
      console.log("cropper初始化完成");
  },
  loadimage(e){
      console.log("图片加载完成", e.detail);
      this.setData({
        src:e.detail.path
      })
      wx.hideLoading();
      //重置图片角度、缩放、位置
      this.cropper.imgReset();
  },
  clickcut(e) {
      console.log(e.detail);
      //点击裁剪框阅览图片
      wx.previewImage({
          current: e.detail.url, // 当前显示图片的http链接
          urls: [e.detail.url] // 需要预览的图片http链接列表
      })
  },

  async uploadImage() {
      this.cropper.getImg(function(res){
        var pages = getCurrentPages()
        var prevPage = pages[pages.length-2]
        prevPage.setData({
          imgSrc:res.url
        })
        wx.navigateBack({
          delta:1
        })
      })
  }
})