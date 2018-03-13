//index.js
//获取应用实例
const app = getApp()
var titleStr = "手机设备信息";
var shareDesc = "信息来自微信小程序“手机设备信息”";
Page({
  data: {
    
    userInfo: {},
    hasUserInfo: false,
    hasNetworkType: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    systemInfo: {},
    otherInfo:null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      // var that = this
    }
    this.getSystemInfo();
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       systemInfo: res,
    //     })
    //     that.update()
    //   }
    // })
    this.getNetworkType();
    if (options) {
      this.setData({
        otherInfo: options
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getNetworkType: function () {
    var that = this
    wx.getNetworkType({
      success: function (res) {
        console.log(res)
        that.setData({
          hasNetworkType: true,
          networkType: res.subtype || res.networkType
        })
        // that.update()
      }
    })
  },
  getSystemInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        // that.update() 
        wx.showToast({
          title: "刷新成功",
          duration: 400
        })
      }
    })
  },
  onShareAppMessage: function () {
    var userInfo = this.data.userInfo;
    var systemInfo = this.data.systemInfo;
    if (userInfo.nickName){
      titleStr = userInfo.nickName + "的手机与你PK"
    }
    var path = "/pages/index/index?name=" + userInfo.nickName + "&brand=" + systemInfo.vrand + "&model=" + systemInfo.model;
    console.log(path)
    return {
      title: titleStr,
      desc: shareDesc,
      path:path ,
     
      success: function (res) {
        wx.showToast({
          title: "转发成功",
          duration: 400
        })
        // 转发成功
      },
      fail: function (res) {
        wx.showToast({
          title: "转发失败",
          icon:"none",
          duration: 400
        })
        // 转发失败
      }
    }
   
  }
})
