const app = getApp()
Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
    modalMsg: {
      type: String,
      value: ' ',
    }
  },
  data: {
    // 这里是一些组件内部数据  
    text: 's',
    list:[]
  },
  methods: {
    // 这里放置自定义方法  
    //点击支付
    payForChance: function (e) {
      console.log(e.currentTarget.dataset.sid,'e.currentTarget.dataset.sid')
      wx.request({
        url: app.globalData.baseUrl +'/pay/create',
        method: 'POST',
        data: {
          goods_id: e.currentTarget.dataset.sid
        },
        header: {
          'content-type': 'application/json', // 默认值
          'identity': 'yezhu',
          'loginway':'weixin',
          'Authorization':app.globalData.token
        },
        success: (res) => {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon:'success',
                duration: 1300
              })
            },
            'fail': function (res) {
              console.log(res,'---2')
            }
          })
        }
      })
    }
  },
  attached: function (e) {
    wx.request({
      url: app.globalData.baseUrl + '/goods/list',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'identity': 'yezhu',
        'loginway': 'weixin',
        'Authorization': app.globalData.token
      },
      success:(res)=>{
        this.setData({list:res.data.data.list})
      }
    })
  }
})