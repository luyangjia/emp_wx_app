// pages/index/index.js
 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      ' ../../utils/images/1.png',
      ' ../../utils/images/2.png',
      ' ../../utils/images/3.png'
    ],
    indicatorDots: true, //	是否显示面板指示点
    autoplay: true, //是否自动切换
    circular: true, //是否采用衔接滑动
    vertical: false, //滑动方向是否为纵向
    interval: 3000, //自动切换时间间隔
    duration: 100, //滑动动画时长
    
    listData: [
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "03", "text": "text3", "type": "type3" },
      { "code": "04", "text": "text4", "type": "type4" },
      { "code": "05", "text": "text5", "type": "type5" },
      { "code": "06", "text": "text6", "type": "type6" },
      { "code": "07", "text": "text7", "type": "type7" }
    ]
  
  }
})
