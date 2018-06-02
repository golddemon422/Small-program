// pages/Prize/prize.js.js
const app = getApp();

var that = this;
// let userInformationArr = [];   //存放用户信息数组
Page({
    /****页面的初始数据****/
    data: {
        RealuserInformationArr: null, //页面用户信息指向
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        wx.showShareMenu({
            withShareTicket: true //要求小程序返回分享目标信息
        })

    },
    onShow: function () {
        let t =this
        app.getInfo().then(function () {
            t.setData({
                RealuserInformationArr: app.globalData.openInfo.data.data
            });
        });
        // let _this = this;
        // let userInfoTimer = setInterval(function () {
        //     if (app.globalData.openInfo) {
        //         _this.setData({
        //             RealuserInformationArr: app.globalData.openInfo.data.data
        //         });
        //         clearInterval(userInfoTimer)
        //     }
        // }, 50)
    },
    onPullDownRefresh: function(){
        let t = this
        app.getInfo().then(function () {
            t.setData({
                RealuserInformationArr: app.globalData.openInfo.data.data
            });
        });
        wx.stopPullDownRefresh()
    },
    // 转发功能
    onShareAppMessage: app.onShareAppMessage,
    getChance: function () {
        wx.navigateTo({
            url: `../gameover/gameover`
        })
    }
});