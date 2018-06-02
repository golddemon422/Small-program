// pages/game/game.js
const RSA = require('wx_rsa.js');
//密钥定义
const clientPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQChv5KAZjYf680lzWBsKVXYTWG5cQ7cjOCM+wbaE73LbzCfej1/
ADzhFS/RLJiV4NeEfwNL2uOnLBoe+wGIjimIrw4tVhUMVHwz9rubyxGjLakcRYA2
mzi4O5/oZoUj+EzLlMJxPL6KkpHoEOp1y/lEh5wSpD/jNc5QPPW92aMA1QIDAQAB
AoGAbLcHb/fDL0ddNqhIw8owoda49VxRIdoqX3elzlPwgFi2tKoDxWXShXKpFg3E
bRCXqr136Lcxxj31PJd3G2J59QvPZZV6eYp39uUOqF0D5hyfH0WobLf8u7aBYQ5l
J2DlVlQkuZqDfweSAS2Pm3sRRsIFb5KWiCYW0xhnMVOkIc0CQQDWhXuOMHmQNhg0
BYSE4Is3Jm1IEtTFim/+cWxVva6ZOtCEw2PjR15RENot4+fB29UBYQAC/aH6MVXC
pi4aPE9jAkEAwQXk0erv4F1e38RB5i/GCzpVjgk3FNQE9JfBMnfou8fAk5K2M5WP
JEhbTp/14pFVcgos546ACs5+PVIvJXmwZwJBAIOzYX6THh6+Ry+w74HQhUevjMoB
3aUFb+prYhJlqIqkRB4uAuYnC62DRh+EWuV2fBgjoCk147rBjSA6e/VZb3cCQQCo
kA0ThKeWt/NyVmF2M6Ivi/HK6CFB/yWUtDHzcOO9mOOD/EtBIQqwFMAoGWkRQvnr
bRdp3/fReCKmSm8BuxNhAkEAxbdGWT9EZk5XTT3wP3Fgv8lMlvn1sAfBRvshUzCc
OG+KDbc+qK83XDDYKlqgZhxRxHgCCkUymr4F+obizFMwgg==
-----END RSA PRIVATE KEY-----`;

const serverPublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjSETE5bs4LCBWI3JT0oB+/HKV
bwEpR5adoTrtl+CsmS65k3mKv5etXO+EBzRHIsR6pe7SsW0TbpBrMdO6sQgPC94K
lZZN98fW3VurRcAwK/vbCOcNQ3z76dnZ/NokQ2ot8yRp8/wft7PhNeHEWdN4dUc7
kfB9lMfc4HrSRf8rwQIDAQAB
-----END PUBLIC KEY-----
`;
const app = getApp()
let arr = ['go'];
let timer = null
Page({
    /**
     * 页面的初始数据
     */
    data: {
        boxArray: [],  //显示500个格子
        keyArray: [],  //键盘
        numCurrent: 1,  //初始格子
        count2: 1,     //10-99判断计数
        count3: 1,     //100 以上判断计数
        flag: true,    //进入if许可
        clearFlag: true,
        timer: 8,      //初始键盘停留时间
        color: [],     //输入正确后的样式
        errorCount: 0, //输出错误提示计数
        scrollTop: 0,  //区域滚动位置
        bgmSrc: '',    //bgm地址
        action: {},    //播放控制
        gid: 0,        //
        // openid: '',    //
        status: 0,     //0失败，1成功
        isBackButton: true,
        num:0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShareAppMessage: app.onShareAppMessage,
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true //要求小程序返回分享目标信息
        })
        // 初始化主要显示窗口
        for (let i = 1; i <= 40; i++) {
            arr[i] = i.toString()
        }
        this.setData({boxArray: arr});

        // 初始化键盘
        let keyArr = [];
        for (let i = 0; i < 10; i++) {
            keyArr[i] = i
        }
        this.setData({keyArray: keyArr});
        // 初始化背景音乐
        this.setData({bgmSrc: 'http://p3d2b4a3b.bkt.clouddn.com/bgm.mp3'})
        this.setData({
            action: {
                method: 'play'
            }
        });
    },
    //点击输入
    keydown: function (e) {

        let current = this.data.numCurrent;//当前格子

        let temp = this.data.boxArray;  //获取所有格子

        let input = e.target.dataset.sid;//点击的数字

        this.setData({num:current})
        //清除格子中原值
        if (this.data.clearFlag) {
            temp[current] = '';
            this.setData({clearFlag: false})
        }
        // 输入值放入当前格子
        temp[current] += input;
        this.setData({boxArray: temp});

        //滚动到相应位置
        //84rpx每行
        // let col = parseInt(current / 9);
        // this.setData({scrollTop: 84 * (col - 1)});
        // this.setData({scrollTop: e.target.offsetTop});
        //判断每一位数字
        if (current <= 9) {
            if (input != current) {
                this.inputError();//执行错误函数
            }
        }

        //10-99的判断
        if (9 < current && current <= 99) {
            //判断个位
            if (this.data.count2 == 2) {

                if (input != arr[current][1]) {
                    this.inputError();//执行错误函数
                } else {
                    // 正确则判断下一位数字
                    this.setData({count2: 1})
                    this.setData({flag: false})
                }
            }
            //判断十位
            if (this.data.count2 == 1 && this.data.flag) {
                if (input != arr[current][0]) {
                    this.inputError();//执行错误函数
                } else {
                    this.setData({count2: 2})
                }
            }
        }
        //100开始的判断
        if (99 < current) {
            //判断个位
            if (this.data.count3 == 3) {
                if (input != arr[current][2]) {
                    this.inputError();//执行错误函数
                } else {
                    this.setData({count3: 1})
                    this.setData({flag: false})
                }
            }
            //判断十位
            if (this.data.count3 == 2) {
                if (input != arr[current][1]) {
                    this.inputError();//执行错误函数
                } else {
                    this.setData({count3: 3})
                }
            }
            //判断百位
            if (this.data.count3 == 1 && this.data.flag) {
                if (input != arr[current][0]) {
                    this.inputError();//执行错误函数
                } else {
                    this.setData({count3: 2})
                }
            }
        }
        //如果输入正确，继续
        if (temp[this.data.numCurrent] == this.data.numCurrent) {

            if (current % 40 == 0) {
                for (let i = current + 1; i <= current + 40; i++) {
                    arr.push(i.toString())
                }
                this.setData({boxArray: arr});
            }


            //输入正确后改变样式
            let colorArrTemp = this.data.color
            //改成需要的样式
            colorArrTemp[this.data.numCurrent] = 'change-color'
            this.setData({color: colorArrTemp})
            //进入下一个格子
            this.setData({numCurrent: this.data.numCurrent + 1})
            this.setData({flag: true})
            this.setData({clearFlag: true})
        }
        //挑战成功
        if (this.data.numCurrent == 501) {
            //挑战成功后要做的事
            this.setData({isBackButton: false})
            this.keydown = () => {
                //禁用键盘
            };
            this.setData({numCurrent: 500})
            this.setData({status: 1})
            wx.showToast({
                title: '挑战成功！',
            })
            this.sendMessage()
        }
    },
    //输入错误执行的函数
    inputError: function () {
        this.setData({isBackButton: false})
        this.keydown = () => {
            //禁用键盘
        };
        this.setData({status: 0})
        this.setData({bgmSrc: 'http://p3d2b4a3b.bkt.clouddn.com/gameover.mp3'})
        this.setData({
            action: {
                method: 'play'
            }
        })
        //向服务器发送数据
        this.sendMessage()


        //错误后的提示信息
        let errStr = '慢慢来，比较快，人生有很多机会，游戏也是！！'
        //循环定时器
        let errTimer = setInterval(() => {
            let temp = this.data.boxArray;
            //输入错误的背景色
            this.data.color[this.data.numCurrent] = 'red'
            this.setData({color: this.data.color})
            //循环输出错误提示
            temp[this.data.numCurrent + 1] = errStr[this.data.errorCount]
            this.setData({boxArray: temp})
            this.setData({numCurrent: this.data.numCurrent + 1})
            this.setData({errorCount: this.data.errorCount + 1})
            //输出完成，清除定时器
            if (this.data.errorCount == 22) {
                clearInterval(errTimer)
                this.inputError = null
            }
        }, 100)
    },
    //向服务器发送数据
    sendMessage: function () {
        let _this = this
        //获取当前时间戳
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        let message = `end=${this.data.numCurrent}&gid=${this.data.gid}&status=${this.data.status}&timestamp=${timestamp}`

        //加签
        let sign_rsa = new RSA.RSAKey();
        sign_rsa = RSA.KEYUTIL.getKey(clientPrivateKey);

        let Sig = sign_rsa.signString(message, 'sha1');

        Sig = RSA.hex2b64(Sig); // hex 转 b64

        message = message + "&sign=" + Sig

        //拆分
        let mes1 = message.slice(0, 117)
        let mes2 = message.slice(117, 234)
        let mes3 = message.slice(234, message.length)

        //加密
        let encrypt_rsa = new RSA.RSAKey();
        encrypt_rsa = RSA.KEYUTIL.getKey(serverPublicKey);
        let encStr1 = encrypt_rsa.encrypt(mes1)
        let encStr2 = encrypt_rsa.encrypt(mes2)
        let encStr3 = encrypt_rsa.encrypt(mes3)
        //拼接，send
        message = encStr1 + encStr2 + encStr3
        message = RSA.hex2b64(message)
        //发起请求
        wx.request({
            url: app.globalData.baseUrl + '/challenge/deal',
            method: 'POST',
            data: {
                _sign: message
            },
            header: {
                'content-type': 'application/json', // 默认值
                'identity': 'yezhu',
                'Authorization': app.globalData.token
            },
            success: (res) => {
                let timeChange = (_this.data.numCurrent == 501) ? 500 : 2000

                if (_this.data.isBackButton == false) {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: `../gameover/gameover?result=${JSON.stringify(res.data)}`
                        })
                    }, timeChange)
                }
            }
        })
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
        timer = setInterval(function () {
            this.setData({timer: this.data.timer - 1})
            if (this.data.timer < 1) {
                //改变键盘顺序
                this.setData({keyArray: this.data.keyArray.shuffle()})

                this.setData({timer: parseInt(Math.random() * 10)})
            }
        }.bind(this), 1000)
        this.setData({
            action: {
                method: 'play'
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearInterval(timer)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        arr = ['go'];
        this.setData({boxArray: arr})
        let _this = this
        if (this.data.isBackButton == true) {
            _this.sendMessage()
            wx.showModal({
                title: '提示',
                content:'你放弃了挑战(视为失败)',
            })

        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
});
//数组随机排序添加到 Array 上
Array.prototype.shuffle = function () {
    return this.sort(function () {
        // 前一个大于后一个，如果返回整数就是升序排列，相反可得降序排列
        return 0.5 - Math.random();
    })
};