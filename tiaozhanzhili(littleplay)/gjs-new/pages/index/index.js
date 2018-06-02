//index.js
//获取应用实例
const app = getApp();
let moreCount = 0;
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        /***************页面配置---页面中部选项卡*******************/
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        ReallastDataArr: [],       //昨日智力排行榜
        RealStaminaArr: [],         //毅力排行榜
        RealGroupDataArr: [],        //群内智力排行榜
        RealKidsDataArr: [],          //娃娃奖品列表
        RealAlltotal: [],              //总参赛次数
        RealchangeMore: [],            //点击加载更多
        // 定义排名色值表
        defColorArr: ['#FFC701', '#BCD2ED', '#E7AF84', '#D5D7E1', '#D5D7E1'],
        startBackImg: 'https://api.cfoeu.cn/uploads/20180205/55ae62080b639a5720ed63b295b33e69.png',
        baseHeight: 1400, //swiper中项目基础高度
        showModalStatus: false,    //挑战规则模态框显示状态
        RealRuleDataArr: [],       //挑战规则显示规则
        //版本控制
        motto: '简易计算器☞',
        defaultSize: 'default',
        disabled: false,
        iconType: 'info_circle',
        page: 0
    },

    //事件处理函数
    onLoad: function (e) {
        let t = this;
        //要求小程序返回分享目标信息
        wx.showShareMenu({
            withShareTicket: true
        });

        //从微信获取用户信息
        app.getUserInfo().then(function () {
            t.setData({userInfo: app.globalData.userInfo});
        })
        //从weiju刷新用户信息
        app.getInfo().then(function () {
            if (app.globalData.openInfo.data.data.reset_challenges) {
                //还有挑战次数
                t.setData({
                    startBackImg: 'https://api.cfoeu.cn/uploads/20180205/55ae62080b639a5720ed63b295b33e69.png'
                })
            } else {
                //没了挑战次数
                t.setData({
                    startBackImg: 'https://api.cfoeu.cn/uploads/20180206/a1b71e4446c00b2b24615ec4e1b755f5.png'
                })
            }
        })

        //获取各种排行榜数据

        app.getToken().then(function () {
            t.getChallenges(t.data.page)
            t.getData();
        })
        // t.getChallenges(t.data.page)

        wx.getSystemInfo({
            success: function (res) {
                t.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });

        //挑战规则
        wx.request({
            url: app.globalData.baseUrl + "/rule/description",
            method: "GET",
            header: {
                "content-type": "application/json",// 默认值
                "identity": "yezhu",
                "Authorization": app.globalData.token,
            },
            success: res => {
                t.setData({RealRuleDataArr: res.data.data || []})
            }
        })
    },

    onShow: function () {
        app.getInfo()
    },
    //查看更多/上拉
    getMore: function () {
        let t = this
        app.getToken().then(function () {
            t.getChallenges(t.data.page + 1)
            t.setData({page: t.data.page + 1})
        })
    },
    getChallenges: function (page) {
        console.time('challenge')
        wx.showLoading({
            title:'加载中',
            duration:10000
        })
        // 毅力排行榜---连续挑战次数接口
        let t = this
        // app.getToken().then(function () {
        wx.request({
            url: "https://api.cfoeu.cn/rank/challenges_rank",
            method: "POST",
            header: {
                'content-type': 'application/json',// 默认值
                "identity": "yezhu",
                "Authorization": app.globalData.token
            },
            data: {
                page: page || 0
            },
            success: res => {
                console.timeEnd('challenge')
                wx.hideLoading()
                t.setData({RealStaminaArr: t.data.RealStaminaArr.concat(res.data.data)})
            },
        });
        // })
    },
    //请求数据
    getData: function () {
        //
        let t = this;
        //  当前总参赛次数接口
        wx.request({
            url: "https://api.cfoeu.cn/challenge/total",
            method: "POST",
            header: {
                'content-type': 'application/json',// 默认值
                "loginway": "loginway",
                "identity": "yezhu",
                "authorization": app.globalData.token
            },
            success: res => {
                t.setData({RealAlltotal: res.data.data})
            }
        });
        // 智力排行榜接口
        wx.request({
            url: "https://api.cfoeu.cn/rank/prizes_rank",
            method: "GET",
            header: {
                'content-type': 'application/json',// 默认值
                "identity": "yezhu",
                "Authorization": app.globalData.token
            },
            success: res => {
                t.setData({ReallastDataArr: res.data.data})
            }
        });


        // *****************************娃娃奖品列表**************************
        wx.request({
            url: "https://api.cfoeu.cn/shop/prizes",
            method: "POST",
            data: {
                search: ""     //向后台模糊查询数据中间关键字不写
            },
            header: {
                'content-type': 'application/json',// 默认值
                "identity": "yezhu",
                "Authorization": app.globalData.token
            },
            success: res => {
                t.setData({RealKidsDataArr: res.data.data})
            }
        });
    },
    /*******滑动切换tab------页面中部选项卡bar**************/
    bindChange: function (e) {
        // this.setData({currentTab: e.detail.current});
    },
    /******************点击tab切换*********************/
    swichNav: function (e) {
        let t = this;
        let c = e.target.dataset.current
        if (c == 1) {
            t.setData({RealGroupDataArr: app.globalData.groupRank || []})
        }
        if (this.data.currentTab == c) {
            return false;
        } else {
            t.setData({currentTab: c})
        }
    },

    startCha: function () {
        app.getInfo().then(function () {
            if (app.globalData.openInfo.data.data.reset_challenges) {
                wx.navigateTo({
                    url: `../game/game`
                })
            } else {
                wx.navigateTo({
                    url: `../gameover/gameover?msg=您没有挑战机会，您可以：`
                })
            }
        })
    },
    receivePrize: function () {
        if (app.globalData.openInfo.data.data.user_prizes) {
            wx.navigateTo({
                url: '../address/address',
            })
        }
        else {
            wx.showModal({
                title: '提示',
                content: '你还没有奖品哦，快去挑战吧！',
            })
        }
    },

    // *********************挑战规则模态框********************
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
    },
    util: function (currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例
        var animation = wx.createAnimation({
            duration: 80, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭
            if (currentStatu == "close") {
                this.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)

        // 显示
        if (currentStatu == "open") {
            this.setData(
                {
                    showModalStatus: true
                }
            );
        }
    },
    onReachBottom: function () {
        this.getMore()
    },
    onPullDownRefresh: function () {
        let t = this
        app.getInfo().then(function () {
            if (app.globalData.openInfo.data.data.reset_challenges) {
                t.setData({
                    startBackImg: 'https://api.cfoeu.cn/uploads/20180205/55ae62080b639a5720ed63b295b33e69.png'
                })
            } else {
                t.setData({
                    startBackImg: 'https://api.cfoeu.cn/uploads/20180206/a1b71e4446c00b2b24615ec4e1b755f5.png'
                })
            }
        })
        wx.stopPullDownRefresh()
    },
    // ****************************转发功能************************
    onShareAppMessage: app.onShareAppMessage
})
