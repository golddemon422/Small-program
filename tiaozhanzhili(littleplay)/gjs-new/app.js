//app.js

const Promise = require('./utils/es6-promise')


App({
    globalData: {
        baseUrl: 'https://api.cfoeu.cn',
        userInfo: {},
        token: ''
    },
    onLaunch: function (ops) {
        let t =this
        t.getToken().then(function () {
            if (ops && ops.scene == 1044) { // 当用户通过带 shareTicket 的分享卡片进入小程序时，小程序才开始读取群聊信息
                console.log(ops,'ops')
                wx.getShareInfo({
                    shareTicket: ops.shareTicket,
                    success: function (shareInfo) {
                        //这儿还有东西没写
                        wx.request({
                            url: t.globalData.baseUrl + '/share/getopengid',
                            method: 'POST',
                            data: {
                                shareInfo
                            },
                            header: {
                                'content-type': 'application/json', // 默认值
                                'identity': 'yezhu',
                                'Authorization': t.globalData.token
                            },
                            success: (opengidRes) => {
                                t.globalData.openGid = opengidRes.data.data.opengid
                                //从分享到群进入，获取群排行榜
                                t.getGroup()
                            }
                        })
                    }
                })
            }
        })
        this.getInfo(ops)
        //token有效期2h
        setTimeout(function () {
            t.globalData.token = ''
            t.getToken()
        },7199999)
    },
    getGroup:function () {
        let t = this
        // **********************群内智力排行榜数据接口--最大写到挑战次数*********************
        wx.request({
            url: "https://api.cfoeu.cn/rank/group_rank",
            method: "POST",
            data: {
                group_openid: t.globalData.openGid || 0,   //分享群后获得的openGID
                // group_openid:'Gj9vL4lE0O5w8FyEwGYW_4r93t9k'
            },
            header: {
                'content-type': 'application/json',// 默认值
                "identity": "yezhu",
                "Authorization": t.globalData.token
            },
            success: groupRank => {
                t.globalData.groupRank = groupRank.data.data
            }
        });
    },
    getToken: function () {
        return new Promise((resolve, reject) => {
            let t = this;
            if (!t.globalData.token) {
                console.log('inssss')
                wx.login({
                    withCredentials: true,
                    success: function (res) {
                        if (res.code) {
                            // 后台使用这个 code 向微信换取 session_key
                            wx.request({
                                //获取openid接口
                                url: t.globalData.baseUrl + '/open/wechat/getopenid',
                                data: {
                                    code: res.code
                                },
                                method: 'POST',
                                success: function (token) {
                                    t.globalData.token = token.data.data.token
                                    resolve('token be ready request')
                                }
                            })
                        }
                    }
                })
            } else {
                resolve('token be ready local')
            }
        })
    },
    getUserInfo: function () {
        let t = this
        return new Promise((resolve, reject) => {
            if (!t.globalData.userInfo.encryptedData) {
                wx.getUserInfo({
                    success: function (userInfo) {
                        t.globalData.userInfo = userInfo
                        resolve('userInfo be ready request')
                    }
                });
            } else {
                resolve('userInfo be ready local')
            }
        })
    },
    getInfo: function (ops) {
        let t = this;
        return new Promise((resolve, reject) => {
            t.getToken().then(function () {
                t.getUserInfo().then(function () {
                    wx.request({
                        url: t.globalData.baseUrl + '/users/upinfo',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json', // 默认值
                            'Authorization': t.globalData.token,
                            'identity': 'yezhu'
                        },
                        data: {
                            userInfo: t.globalData.userInfo
                        },
                        success: (openInfo) => {
                            t.globalData.openInfo = openInfo
                            resolve('openInfo be ready')
                        }
                    })
                })
            })
        })
    },
    //分享函数
    onShareAppMessage: function (res) {
        const t = this
        return {
            // title: res.target.dataset.title || '',
            desc: '挑战你的智力！',
            path: '/pages/index/index?id=3',
            success: function (ticket) {
                wx.getShareInfo({
                    shareTicket: ticket.shareTickets[0],
                    success: function (shareInfo) {
                        wx.request({
                            url: t.globalData.baseUrl + '/share/getopengid',
                            method: 'POST',
                            data: {
                                shareInfo
                            },
                            header: {
                                'content-type': 'application/json', // 默认值
                                'identity': 'yezhu',
                                'Authorization': t.globalData.token
                            },
                            success: (opengidRes) => {
                                t.globalData.openGid = opengidRes.data.data.opengid
                                //获取群排行榜
                                t.getGroup()
                                wx.request({
                                    url: t.globalData.baseUrl + '/share/callback',
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json', // 默认值
                                        'identity': 'yezhu',
                                        'Authorization': t.globalData.token
                                    },
                                    data: {
                                        openGId: opengidRes.data.data.opengid
                                    },

                                    success: function (shareSuccess) {
                                        // 分享成功，增加一次机会
                                        wx.request({
                                            url: t.globalData.baseUrl + '/users/upinfo',
                                            method: 'POST',
                                            header: {
                                                'content-type': 'application/json', // 默认值
                                                'Authorization': t.globalData.token,
                                                'identity': 'yezhu'
                                            },
                                            data: {
                                                userInfo: t.globalData.userInfo
                                            },
                                            success: (openInfo) => {
                                                t.globalData.openInfo = openInfo
                                                wx.reLaunch({
                                                    url: '../index/index'
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
});