var wxpay = require('../../utils/wxpay.js')
Page({
  data: {
    amount: '1', //1分钱
    btname: '缴费', 
  },

  // 获取输入金额 
  amountInput: function (e) {
    this.setData({
      amount: e.detail.value
    })
  },
   

  // 充值 
  login: function () {
    if (this.data.amount.length == 0) {
      wx.showToast({
        title: '金额不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else if (this.data.amount< 1) {
      wx.showToast({
        title: '充值不能小于1块',
        icon: 'loading',
        duration: 2000
      })
    }
    else {
//发起支付  
      wxpay.payRequest(this.data.amount*100); 
    }
  }
})