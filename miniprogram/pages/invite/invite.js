// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    wx_name: '',
    wx_duiwu: '',
    orderId: 0,
    openId: '',
    formId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId,
      openId: options.openId
    })
  },
  //formId，用于发送模板
  formSubmit(ev) {
    //console.log(ev.detail.formId)
    this.setData({
      formId: ev.detail.formId
    })
  },
  /* 确认按钮 */
  sureClick() {
    console.log('----点击了确认')
    //加载中...
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({ //调用云函数
      name: 'inviteOrder', //云函数名为inviteOrder
      data: {
        orderId: this.data.orderId,
        wx_id: encodeURIComponent(this.data.wx_name),
        teamName: encodeURIComponent(this.data.wx_duiwu),
        state: 3,
        token: wx.getStorageSync("token")
      }
    }).then(res => { //Promise
      console.log(res.result)
      if (res.result.message == "SUCCESS") {
        //模板消息推送
        wx.cloud.callFunction({ //调用云函数
          name: 'send', //云函数名为push
          data: {
            formId: this.data.formId,
            openId: this.data.openId
          }
        }).then(res => { //Promise
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/invitesuccess/invitesuccess',
        })
      } else if (res.result.code == 400) {
        wx.hideLoading()
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: String(err),
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
  }
})