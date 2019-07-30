// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  formSubmit: function (e) {
    // console.log(e.detail.value);
    wx.request({
      // url: 'https://www.lishuming.top/pj/index.php/student/api/login', //仅为示例，并非真实的接口地址
      url: "http://116.62.229.250:84/service/token",
      method: "post",
      data: {
        grant_type: 'password',
        username: e.detail.value.username,
        password: e.detail.value.password
      },
      header: {
        'content-type': 'text' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          //访问正常
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            //缓存
            wx.setStorage({
              key: "student",
              data: res.data.student
            });
            wx.showToast({
              title: "登陆成功",
              icon: 'success',
              duration: 20000,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 2000)
              }
            })
          }
        }

      }
    })
  }
})
