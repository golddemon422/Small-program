// pages/gameover/gameover.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    result:'',
    emojiSrc: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //分享
  onShareAppMessage: app.onShareAppMessage,
  //载入页面
  onLoad: function (o) {
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    if (o.result){
      if (JSON.parse(o.result).data.challenge_res) {
        this.setData({ result: '成功' })
        this.setData({ emojiSrc: '../../image/successemoji.png' })
        console.log('成功')
      } else {
        this.setData({ result: '失败' })
        this.setData({ emojiSrc: '../../image/failedemoji.png' })
        console.log('失败')
      }
    }
    if (o.msg){
      this.setData({ result: o.msg })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  toIndex:function(){
      wx.reLaunch({
      url: '../index/index',
    })
  },
  onUnload:function(){
   
  }
})