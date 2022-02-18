// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '模型图片',
      tip: '重建出的模型切片',
      showItem: false,
      item: [{
        title: '点云图片',
        page: 'pics/showPointCloud'
      },
       {
        title: '白模图片',
        
        page: 'pics/showBlankModel'
      },
      // {
      //   title: "test",
      //   page: 'pics/test'
      // }

    ]
    }, {
      title: '白模展示',
      tip: '基于WebGL的小程序端模型展示',
      showItem: false,
      item: [{
        title: '商学院',
        page: 'webgl/viewBussinessSchool'
      }, {
        title: '网络楼',
        page: 'webgl/viewInternetBuilding'
      }, {
        title: '学生宿舍5号楼',
        page: 'webgl/viewDorm5'
      }, {
        title: '实验结果',
        page: 'webgl/viewResult'
      }, ]
    }, {
      title: '计算机视觉',
      tip: '用计算机视觉方法处理图片',
      showItem: false,
      item: [{
        title: 'Go！',
        page: 'CV'
      }]
    }, {
      title: '项目说明',
      tip: '有关此项目使用到的技术的简要说明',
      showItem: false,
      item: [{
        title: '深度学习',
        page: 'description/DL'
      }, {
        title: '计算机视觉',
        page: 'description/CV'
      }, {
        title: '白模制作',
        page: 'description/BM'
      }, {
        title: '小程序与网站制作',
        page: 'description/Web'
      }]
    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;

    this.setData({
      powerList
    });

  },

  jumpPage(e) {
    console.log(e.currentTarget.dataset.page)
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index`,
    });
  },
});
