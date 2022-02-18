// pages/CV/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '正常',
    IP:'www.visualcampus.top:5000',
    tabCur: 0,
    tabs: [{
      name: '常用',
      id: 0
    },{
      name: '滤波',
      id: 1
    },{
      name: '边缘检测',
      id: 2
    },{
      name: '阈值处理',
      id: 3
    },{
      name: '形态学处理',
      id: 4
    },{
      name: '均衡化/图像增强',
      id: 5
    },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log('device info:',res.screenHeight,res.screenWidth)
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  saveCanvas: function(){
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: info => {
            console.log(info);
          },
          fail: err => {
            console.log(err);
          }
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  },


  drawCanvasMap: function () {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas')
    console.log('pic：',that.data.canvasURL)
    wx.getImageInfo({
      src: that.data.canvasURL,
      success: res => {
        wx.setStorageSync('pic', {
          path: res.path,
          width: res.width,
          height: res.height
        });
      }
    });
    let picObj = wx.getStorageSync('pic');
    wx.clearStorage();
    if (picObj && picObj.path) {
      ctx.drawImage(picObj.path, 0, 0, 300, 400);
      ctx.draw(true);
    }
  },

  uploadImg: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#black",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImageShop('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImageShop('camera')
          }
        }
      }
    })
  },
  chooseWxImageShop: function (type) {
    var that = this;
    var API_URL = 'http://' + that.data.IP + '/up_photo'
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
            that.data.shopImage = res.tempFilePaths[0],
            that.upload_file(API_URL, res.tempFilePaths[0])
            console.log('A_URL:',API_URL)
            console.log('FPS:', res.tempFilePaths[0])
      }
    })
  },

  upload_file: function (url, filePath) {
    var that = this;
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'uploadFile',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: { 'shopId': wx.getStorageSync('shopId') }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        wx.showToast({
          title: "图片上传成功",
          icon: 'success',
          duration: 700
        })
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      },
      fail: function (res) {
        that.setData({
          status: '未连接'
        })
      }
    })
  },

  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 2) * 200
    })
  },

  equalizeHist: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'equalizeHist',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  clahe: function () {
    var that = this;
    var origindata=that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP +'/receiveOrder',
      data: {
        order: 'clahe',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  blur: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'blur',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  smooth: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'smooth',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  USM: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'USM',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  edgeRein: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'edgeRein',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  contour: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'contour',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  otsu: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'otsu',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  // moving average
  MA: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'MA',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  adaThresh: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'adaThresh',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  sauvola: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'sauvola',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  erode: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'erode',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  dilate: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'dilate',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  opening: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'opening',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  closing: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'closing',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  brighter: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'brighter',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  dimmer: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'dimmer',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  meanBlur: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'meanBlur',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  medianBlur: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'medianBlur',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  gaussianBlur: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'gaussianBlur',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  maskBlur: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'maskBlur',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  toGray: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'toGray',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  toBinary: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'toBinary',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  sobel: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'sobel',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  laplacian: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'laplacian',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  canny: function () {
    var that = this;
    var origindata = that.data.canvasURL;
    wx.request({
      url: 'http://' + that.data.IP + '/receiveOrder',
      data: {
        order: 'canny',
      },
      method: "post",
      success(res) {
        that.setData({
          canvasURL: res.data,
        })
        that.drawCanvasMap();
      }
    })
  },

  saveImg: function(){
    var that=this;
    console.log(that.data.canvasURL)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('storage authorized')
            }
          })
        }
      }
    })
    wx.downloadFile({
      url: that.data.canvasURL,
      success: function (res) {
        // console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存图片成功！',
            })
          },
          fail(res) {
            console.log(res)
            wx.showToast({
              title: '保存图片失败！',
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '无法保存图片',
          icon: 'error'
        })
      }
    })
  },
})