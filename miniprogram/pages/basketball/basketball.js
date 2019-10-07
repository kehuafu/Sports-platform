// pages/basketball/basketball.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    nullMessage: '这里空空如也~',
    list: [],
    acceptStatus: 0,
    acceptText: '邀请',
    indexTab: 0,
    listRecord: [],
    recordStatus: '3',
    recordText: '待确认',
    multiArray: [
      ['2019年', '2020年', '2021年', '2022年', '2023年', '2024年', '2025年'],
      ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        '51', '52', '53', '54', '55', '56', '57', '58', '59'
      ]
    ],
    str_start: "约场的开始时间",
    str_end: "约场的结束时间",
    str_time: "",
    str_time2: "",
    wx_name: '',
    wx_duiwu: '',
    disabled: true,
    oldColumn: 0,
    multiIndex: [, , , , ],
    multiIndex2: [, , , , ],
    strstart: false,
    strend: false,
    orderList: [],
    myOrderList: [],
    index_: 0,
    index_tab: 0,
    str_FullTime: "",
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      token: wx.getStorageSync("token")
    })
    //请求对方发起接口
    wx.cloud.callFunction({ //调用云函数
      name: 'showOrder', //云函数名为showOrder
      data: {
        openId: wx.getStorageSync("openId")
      }
    }).then(res => { //Promise

      console.log(res.result)
      this.setData({
        orderList: res.result.data,
        list: res.result.data
      })
    }).catch(err => {
      console.log(err)
    })
    //请求我的发起接口
    wx.cloud.callFunction({ //调用云函数
      name: 'showMyOrder', //云函数名为showOrder
      data: {
        openId: wx.getStorageSync("openId")
      }
    }).then(res => { //Promise
      console.log(res.result)
      this.setData({
        myOrderList: res.result.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /* 首页 */
  shouye_click(event) {
    console.log("---", event.detail.index)
    this.setData({
      currentIndex: event.detail.index
    })
  },
  /* 约场 */
  yuechang_click(event) {
    console.log("---", event.detail.index)
    this.setData({
      currentIndex: event.detail.index
    })
  },
  /* 记录 */
  jilu_click(event) {
    console.log("---", event.detail.index)
    this.setData({
      currentIndex: event.detail.index
    })
    const list = []
    for (var i = 0; i < this.data.myOrderList.length; i++) {
      if (this.data.myOrderList[i].orderState == 3) {
        list.push(this.data.myOrderList[i])
      }
    }
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].token == this.data.token &&
        this.data.orderList[i].orderState == 3) {
        list.push(this.data.orderList[i])
      }
    }
    this.setData({
      indexTab: 0,
      listRecord: list,
      recordStatus: '3',
      recordText: '待确认'
    })
  },
  /* 计分器 */
  jifenban_click(event) {
    console.log("---", event.detail.index)
    this.setData({
      currentIndex: event.detail.index
    })
  },
  /* 首页tab */
  onClick(event) {
    console.log("---", event.detail.name)
    switch (event.detail.name) {
      /* 对方发起 */
      case 0:
        this.setData({
          list: this.data.orderList,
          acceptStatus: 0,
          index_: 0,
          index_tab: 0,
          acceptText: '邀请'
        })
        break
        /* 我的发起 */
      case 1:
        this.setData({
          list: this.data.myOrderList,
          acceptStatus: 2,
          index_: 1,
          index_tab: 1,
          acceptText: '撤销'
          // nullMessage: '你还没发起约场呢~'
        })
        break
    }
  },
  /* 首页邀请、撤销 */
  inviteItemClick(event) {
    console.log('------', event.detail.index)
    const index = event.detail.index
    const orderId = event.detail.orderId
    const openId = event.detail.openId
    // console.log(orderId, "--------------")
    // console.log(openId, "--------------")
    var that = this
    switch (this.data.acceptStatus) {
      /* 邀请 */
      case 0:
        wx.navigateTo({
          url: '/pages/invite/invite?orderId=' + orderId + '&openId=' + openId,
        })
        break
        /* 撤销 */
      case 2:
        wx.showModal({
          title: '',
          cancelColor: '#353535',
          confirmColor: '#de213a',
          content: '是否撤销你发起的约场？',
          success(res) {
            if (res.confirm) {
              console.log('确认')
              //撤销接口
              wx.cloud.callFunction({ //调用云函数
                name: 'delOrder', //云函数名为delOrder
                data: {
                  orderId: that.data.myOrderList[index].orderId
                }
              }).then(res => { //Promise
                console.log(res.result, "---------")
                if (res.result.message == "SUCCESS") {
                  wx.showToast({
                    title: '撤销成功',
                    icon: 'none'
                  })
                  //请求我的发起接口
                  wx.cloud.callFunction({ //调用云函数
                    name: 'showMyOrder', //云函数名为showOrder
                    data: {
                      openId: wx.getStorageSync("openId")
                    }
                  }).then(res => { //Promise
                    console.log(res.result)
                    that.setData({
                      myOrderList: res.result.data,
                      list: res.result.data
                    })
                  }).catch(err => {
                    console.log(err)
                  })
                } else {
                  wx.showToast({
                    title: '撤销失败',
                    icon: 'none',
                    time: 1500
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
        break
    }
  },
  /* 记录页面 */
  //待确认
  daiqueren_click(e) {
    console.log("+++", e.detail.index)
    const list = []
    for (var i = 0; i < this.data.myOrderList.length; i++) {
      if (this.data.myOrderList[i].orderState == 3) {
        list.push(this.data.myOrderList[i])
      }
    }
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].token == this.data.token &&
        this.data.orderList[i].orderState == 3) {
        list.push(this.data.orderList[i])
      }
    }
    this.setData({
      indexTab: e.detail.index,
      listRecord: list,
      recordStatus: '3',
      recordText: '待确认'
    })

  },
  //进行中
  jinxingzhong_click(e) {
    console.log("+++", e.detail.index)
    const list = []
    for (var i = 0; i < this.data.myOrderList.length; i++) {
      if (this.data.myOrderList[i].orderState == 4) {
        list.push(this.data.myOrderList[i])
      }
    }
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].token == this.data.token &&
        this.data.orderList[i].orderState == 4) {
        list.push(this.data.orderList[i])
      }
    }
    this.setData({
      indexTab: e.detail.index,
      listRecord: list,
      recordStatus: '4',
      recordText: '进行中'
    })
  },
  //已失效
  yishixiao_click(e) {
    console.log("+++", e.detail.index)
    const list = []
    for (var i = 0; i < this.data.myOrderList.length; i++) {
      if (this.data.myOrderList[i].orderState == 5) {
        list.push(this.data.myOrderList[i])
      }
    }
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].token == this.data.token &&
        this.data.orderList[i].orderState == 5) {
        list.push(this.data.orderList[i])
      }
    }
    this.setData({
      indexTab: e.detail.index,
      listRecord: list,
      recordStatus: '5',
      recordText: '已失效'
    })
  },
  //点击进行中的item
  sureClick() {
    console.log('----点击了确认')
    wx.showToast({
      title: '发起成功',
      duration: 2000,
      mask: true,
      icon: 'success'
    })
  },
  //点击进行中的item，跳转到添加好友页面
  onClickToRunning(ev) {
    var list = ev.detail.item
    console.log(list)
    var info = 0
    if (list.openId == wx.getStorageSync("openId")) {
      info = 1
    }
    wx.navigateTo({
      url: '/pages/addfriend/addfriend?myTeamName=' + list.myTeamName + '&teamName=' + list.teamName +
        '&time=' + list.time + '&token=' + list.token + '&weiXin2Id=' + list.weiXin2Id + '&weiXinId=' + list.weiXinId + '&info=' + info,
    })
  },
  //发起约场
  luanchClick(ev) {
    wx.showLoading({
      title: '正在发起...',
    })
    var that = this
    //请求对方发起接口
    wx.cloud.callFunction({ //调用云函数
      name: 'addOrder', //云函数名为addOrder
      data: {
        openId: wx.getStorageSync("openId"),
        wxId: encodeURIComponent(this.data.wx_name),
        myTeamName: encodeURIComponent(this.data.wx_duiwu),
        time: encodeURIComponent(this.data.str_FullTime)
      }
    }).then(res => { //Promise
      console.log(res.result)
      if (res.result.code = 200) {
        wx.hideLoading()
        //请求我的发起接口
        wx.cloud.callFunction({ //调用云函数
          name: 'showMyOrder', //云函数名为showOrder
          data: {
            openId: wx.getStorageSync("openId")
          }
        }).then(res => { //Promise
          console.log(res.result)
          var mylist = res.result.data
          that.setData({
            currentIndex: 0,
            myOrderList: mylist
          })
          if (that.data.index_ == 1) {
            const list = res.result.data
            that.setData({
              list: list
            })
            wx.showToast({
              title: '发起成功',
              duration: 2000,
              mask: true,
              icon: 'success'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: String(err),
        icon: 'none'
      })
    })
  },

  /* 输入微信号 */
  wx_input(event) {
    //console.log(event)
    var name = event.detail.value
    this.setData({
      wx_name: name.replace(/\s+/g, '')
    })
    if (this.data.wx_name != '' && this.data.wx_duiwu != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  bindMultiPickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      // str_start: "",
      str_time: ":"
    })
  },

  bindMultiPickerChange2: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex2: e.detail.value,
      // str_end: "",
      str_time2: ":"
    })
  },
  bindMultiPickerColumnChange: function(e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
      case 1:
        switch (data.multiIndex[0]) {
          case 1:
          case 5:
            switch (data.multiIndex[1]) {
              case 0:
              case 2:
              case 4:
              case 6:
              case 7:
              case 9:
              case 11:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日'];
                break;
              case 1:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日'];
                break;
              case 3:
              case 5:
              case 8:
              case 10:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'];
                break;
            }
            break;
          default:
            switch (data.multiIndex[1]) {
              case 0:
              case 2:
              case 4:
              case 6:
              case 7:
              case 9:
              case 11:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日'];
                break;
              case 1:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日'];
                break;
              case 3:
              case 5:
              case 8:
              case 10:
                data.multiArray[2] = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;

    }
    //console.log(data.multiIndex);
    this.setData(data);
    this.setData({
      strstart: true,
      str_time: ":",
      str_FullTime: this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]] + this.data.multiArray[2][this.data.multiIndex[2]] + this.data.multiArray[3][this.data.multiIndex[3]] + ":" + this.data.multiArray[4][this.data.multiIndex[4]] + "-" + this.data.multiArray[3][this.data.multiIndex2[3]] + ":" + this.data.multiArray[4][this.data.multiIndex2[4]]
    })
    console.log(this.data.str_FullTime)
  },
  bindMultiPickerColumnChange2: function(e) {

    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var  data  =   {      
      multiArray:  this.data.multiArray,
      multiIndex2:  this.data.multiIndex2    
    };    
    data.multiIndex2[e.detail.column]  =  e.detail.value;    
    switch  (e.detail.column)  {      
      case  0:
              
      case  1:
              
      case  2:
         wx.showToast({          
          title:   "约场的起始时间和结束时间须在同一天内",
          mask:  true,
          duration:  1000,
          icon:   "none"
        });        
        data.multiIndex2[0] = this.data.multiIndex[0];        
        data.multiIndex2[1] = this.data.multiIndex[1];        
        data.multiIndex2[2] = this.data.multiIndex[2];        
        break;      
      case  3:
        if (data.multiIndex2[e.detail.column] < this.data.multiIndex[e.detail.column]) {          
          data.multiIndex2[e.detail.column] = this.data.multiIndex[e.detail.column]
        }      
      case  4:
        if (data.multiIndex2[3] == this.data.multiIndex[3]) {
          if (data.multiIndex2[e.detail.column] < this.data.multiIndex[e.detail.column]) {
            data.multiIndex2[e.detail.column] = this.data.multiIndex[e.detail.column]
          }
        }
    }
    //console.log(data.multiIndex2);
    this.setData(data);
    this.setData({
      strend: true,
      str_time2: ":",
      str_FullTime: this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]] + this.data.multiArray[2][this.data.multiIndex[2]] + this.data.multiArray[3][this.data.multiIndex[3]] + ":" + this.data.multiArray[4][this.data.multiIndex[4]] + "-" + this.data.multiArray[3][this.data.multiIndex2[3]] + ":" + this.data.multiArray[4][this.data.multiIndex2[4]]
    })
    console.log(this.data.str_FullTime)
  },
  /* 输入班级/队伍名 */
  duiwu_input(event) {
    //console.log(event)
    var wx_duiwu = event.detail.value
    this.setData({
      wx_duiwu: wx_duiwu.replace(/\s+/g, '')
    })
    if (this.data.wx_name != '' && this.data.wx_duiwu != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    //请求对方发起接口
    wx.cloud.callFunction({ //调用云函数
      name: 'showOrder', //云函数名为showOrder
      data: {
        openId: wx.getStorageSync("openId")
      }
    }).then(res => { //Promise

      console.log(res.result)
      this.setData({
        orderList: res.result.data,
        list: res.result.data
      })
    }).catch(err => {
      console.log(err)
    })
    //请求我的发起接口
    wx.cloud.callFunction({ //调用云函数
      name: 'showMyOrder', //云函数名为showOrder
      data: {
        openId: wx.getStorageSync("openId")
      }
    }).then(res => { //Promise
      console.log(res.result)
      this.setData({
        myOrderList: res.result.data
      })
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.log(err)
    })
  }
})