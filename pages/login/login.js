 Page({
  data: {
    username: 'admin',
    password: '123456',
    btname: '登陆'
  },

  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  /* 微信支付 */
  goWxPay: function () {
    var that = this;
    //登陆获取code
    wx.login({
      success: function (res) {
        console.log("获取login code", res.code);
        //获取openid
       // that.getOpenId(res.code);
      }
    });
  },
  
  // 登录 
  login: function () {
     
    if (this.data.username.length == 0 ) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else if (this.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    }
    else {
      // 这里修改成跳转的页面 
      var app = getApp();// 获取全局的变量
      wx.request({ 
        url: app.globalData.token,
        method: "get",
        // data: "grant_type=password&username="+this.data.username+"&password="+this.data.password,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          if (res.statusCode == 200) { 
           
              //缓存 
              wx.showToast({
                title: "登陆成功",
                icon: 'success',
                duration: 2000,
                success: function () {
                 // wx.navigateTo
                 // wx.redirectTo 
                  wx.switchTab({
                    url: '../index/index'
                  })
                 
                }
              })
            
          }
          else{
            console.log(res.statusCode);
            wx.showToast({
              title: '登陆失败',
              icon:"none",
              duration: 2000,
            })
          }

        }
        ,
        fail:function(res)
        {
        console.log(res);
        wx.showToast({
          title: '登陆失败',
          icon: "none",
          duration: 2000,
        })
        }
      })
      
      //console.log(app.globalData.login.url);
     
    }
  }
})