// pages/address/address.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    prizeCount: 0,
    getPrzieCount:0,
    addAddressMsg:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.chooseAddress({
      success: function (res) {
        _this.setData({address:res})
        _this.setData({ addAddressMsg:'设置地址成功'})
      },
      fail:function(res){
        _this.setData({ addAddressMsg: '设置地址失败，请关闭此页重试' })
      }
    })
  },
  submit:function(){
   
    if(this.data.address){
      if ((this.data.getPrzieCount > app.globalData.openInfo.data.data.user_prizes) || (this.data.getPrzieCount <= 0)){
        wx.showModal({
          title: '提示',
          content: '输入数量错误',
          success: function (showModalRes) {
          }
        })
      }else{
        wx.request({
          url: app.globalData.baseUrl + '/address/address',
          // url:'https://weiju-api.greatsir.com/address/address',
          data: {
            user_id: app.globalData.openInfo.data.data.user_id,
            contacts: this.data.address.userName,
            mobile: this.data.address.telNumber,
            province: this.data.address.provinceName,
            city: this.data.address.cityName,
            country: this.data.address.countyName,
            address: this.data.address.detailInfo,
            prizes: this.data.getPrzieCount
          },
          method: "POST",
          header: {
            'content-type': 'application/json',// 默认值
            "identity": "yezhu",
            "authorization": app.globalData.token
          },
          success: function (addressRes) {
            console.log(addressRes,'addressRes')
            wx.showModal({
              title: '领取结果',
              content: '领取成功，我们将尽快为您发货',
              success: function (showModalRes) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            })
          }
        })
      }
      
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择或输入地址',
        success: function (showModalRes) {
        }
      })
    }
  },
  bindInput:function(e){
    this.setData({ getPrzieCount: e.detail.value})
    
  },
  onShow:function(){
    this.setData({ prizeCount: app.globalData.openInfo.data.data.user_prizes})
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  }
})