// pages/Report/report.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        radio: [
            {name: "Cheat", value: "欺诈"},
            {name: "Erotic", value: "色情"},
            {name: "Political rumor", value: "政治谣言"},
            {name: "Common sense rumors", value: "常识性谣言"},
            {name: "Induced sharing", value: "诱导分享"},
            {name: "Malicious marketing", value: "恶意营销"},
            {name: "Privacy collection", value: "隐私收集"},
            {name: "Other infringements", value: "其他侵权类(冒名、诽谤、抄袭、)"},
        ],
        radio_Value: "",
        phone: '',
        weixin: '',
        flag: false
    },
    // 单选框radio
    radio_btn: function (e) {
        this.setData({
            radio_Value: e.currentTarget.dataset.item
        })
        this.setData({flag: true})
    },
    phone: function (e) {
        this.setData({phone: e.detail.value})
    },
    weixin: function (e) {
        this.setData({weixin: e.detail.value})
    },
    // 提交按钮
    submitBtn: function (e) {
        let value = this.data.radio_Value
        let _this = this
        // 举报接口
        if (this.data.flag) {
            wx.request({
                url: app.globalData.baseUrl + '/user/report',
                method: "post",
                data: {
                    "content": value,
                    "red_id": _this.data.red_id,
                    "phone": _this.data.phone,
                    "weixin": _this.data.weixin,
                },
                header: {
                    'content-type': 'application/json',
                    Authorization: app.globalData.token,
                    identity: 'yezhu'
                },
                success: () => {
                    wx.reLaunch({
                        url: '../reportresult/reportresult',
                        success: res => {
                        }
                    })
                }
            })
        } else {
            wx.showModal({
                title: '请选择举报原因'
            })
        }
    },
    onLoad: function (e) {
        //改动tabBar对应页面头部标题
        wx.setNavigationBarTitle({
            title: "举报"
        });
        this.setData({red_id: e.red_id})
    }
})