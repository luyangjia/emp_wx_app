var md5 = require('md5.js')
/*微信支付相关方法*/
/********************** 时间戳产生函数   */
var createTimeStamp= function() {
  return parseInt(new Date().getTime() / 1000) + ''
}
/********************** 随机数 */
var randomString= function() {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  var maxPos = chars.length;
  var value = '';
  for (var i = 0; i < 32; i++) {
    value += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return value;
}
/********************** 获取XML节点信息 */
var getXMLNodeValue=function(node_name, xml) {
  var tmp = xml.split("<" + node_name + ">")
  var _tmp = tmp[1].split("</" + node_name + ">")
  return _tmp[0]
}
/**********************统一支付接口*/
var payRequest= function (amount) {
  var app = getApp();// 获取全局的变量
  var timeStamp = createTimeStamp();
  var randomStr = randomString(); //随机字符串，不长于32位。  
  //统一支付签名
  console.log("wxStore:", app.globalData.wxStore);
  var appid = app.globalData.wxStore.appId;//appid必填
  var openid = app.globalData.wxStore.openId;//openId
  var body = '缴费测试';//商品名必填
  var mch_id = app.globalData.wxStore.mchId;//商户号必填
     
  var notify_url = app.globalData.wxStore.notifyUrl;//通知地址必填
  var total_fee = amount; //价格，1是一分钱
  var trade_type = "JSAPI";
  var key = app.globalData.wxStore.key; //商户key必填，在商户后台获得
  var out_trade_no =createTimeStamp();//自定义订单号必填 
  var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + randomStr + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key; 
  var sign = md5.md5(unifiedPayment).toUpperCase();
  console.log("签名md5", sign); 
  //封装统一支付xml参数
  var formData = "<xml>";
  formData += "<appid>" + appid + "</appid>";
  formData += "<body>" + body + "</body>";
  formData += "<mch_id>" + mch_id + "</mch_id>";
  formData += "<nonce_str>" + randomStr + "</nonce_str>";
  formData += "<notify_url>" + notify_url + "</notify_url>";
  formData += "<openid>" + openid + "</openid>";
  formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
  formData += "<total_fee>" + total_fee + "</total_fee>";
  formData += "<trade_type>" + trade_type + "</trade_type>";
  formData += "<sign>" + sign + "</sign>";
  formData += "</xml>";
  console.log("formData", formData);
  //统一支付
  wx.request({
    url: app.globalData.wxStore.payUrl, 
    method: 'POST',
    head: 'application/x-www-form-urlencoded',
    data: formData, //设置请求的 header
    success: function (res) { 
      var result_code = getXMLNodeValue('result_code', res.data.toString("utf-8")); 
      var resultCode = result_code.split('[')[2].split(']')[0];
      if (resultCode == 'FAIL') {
        var err_code_des = getXMLNodeValue('err_code_des', res.data.toString("utf-8")); 
        var errDes = err_code_des.split('[')[2].split(']')[0];
        wx.showToast({
          title: errDes,
          icon: 'none',
          duration: 3000
        })
      } else {
        //发起支付
        var prepay_id = getXMLNodeValue('prepay_id', res.data.toString("utf-8"));  
        var tmp = prepay_id.split('[');
        var tmp1 = tmp[2].split(']'); 
        //签名  
        var stringSignTemp = "appId=" + appid + "&nonceStr=" + randomStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
        console.log("签名字符串", stringSignTemp);
        var sign = md5.md5(stringSignTemp).toUpperCase();
        console.log("签名2", sign);
        var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + tmp1[0], "paySign": sign, "signType": "MD5", "nonceStr": randomStr }
        console.log("param小程序支付接口参数", param);
         processPay(param);
      }

    },
  })

}
/* 小程序支付 */
var processPay= function (param) {
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: param.signType,
    paySign: param.paySign,
    success: function (res) {
      // success
      console.log("wx.requestPayment返回信息", res);
      wx.showModal({
        title: '支付成功',
        content: '支付成功!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    },
    fail: function () {
      console.log("支付失败");
      wx.showToast({
        title: '支付失败',
        icon: 'loading',
        duration: 2000
      })
    },
    complete: function () {
      console.log("支付完成(成功或失败都为完成)");
    }
  })
}
module.exports = {
  createTimeStamp: createTimeStamp,
  randomString: randomString,
  getXMLNodeValue: getXMLNodeValue,
  payRequest: payRequest
}