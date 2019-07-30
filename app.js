//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        //获取openid
        var that=this;
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.wxStore.appId + '&secret=' + that.globalData.wxStore.appSecret +'&js_code=' + res.code + '&grant_type=authorization_code',
          method: "get",
          success: function (res) {
            console.log("success:", res.data.openid);
            that.globalData.wxStore.openId = res.data.openid;
          },
          fail: function (res) {
            console.log("fail:", res);
          }
        }); 

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
               
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo:null,
    token:'***/serverwx/api/account/CheckUkeyCode',
    server: '***/serverwx', 
    wxStore: {
      openId: '', //登录微信号
      appId: 'wxb4eac1592267c9cc', //小程序号
      appSecret: '****', //小程序secret
      key:'****', //商户平台key
      mchId: '****',//商户平台：商户号必填
      notifyUrl: '***/serverwx/Payover',//通知地址
      tradeType:'JSAPI',
      payUrl:'https://api.mch.weixin.qq.com/pay/unifiedorder' //微信统一支付接口
    },
  }
})