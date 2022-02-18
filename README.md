# VisualCampus项目说明

### 整体介绍

VisualCampus 视觉校园是山东大学(威海)数据科学与人工智能实验班开发的校园建筑三维模型展示项目。目前，我们实现了山东大学(威海)校园内商学院、网络楼和学生宿舍五号楼的三维模型重建工作。

在项目第一阶段开发过程中，我们首先利用航拍获取了建筑外形的全方位图片，利用`colmap`与`AA-RMvsnet`重建出建筑的三维点云，做到了无死角、无畸变；我们利用计算机视觉与深度学习相关技术识别并计算出建筑的各项参数，如长宽高、窗户数目、窗户面积等等；我们利用`Swin-Transformer`深度学习模型，训练出自己的人工智能目标检测模型，对建筑外围的树木、灯杆、空调外机等等进行了精准的识别。

在项目第二阶段的开发过程中，我们用参数化的三维几何模型重画了建筑物外表面白模，并且使用了以`WebGL`为基础的3D图形JS库`Three.js`加入了与用户的互动显示功能；我们利用`jquery`框架、`nodejs`运行环境、`momentum`组件等工具搭建了项目成果展示网站；利用`potree`工具实现了在web前端互动性的展示建筑点云，实现反转、测量等一系列功能；我们额外开发了一个在线数字图像处理网站，用户可以在线对自己上传的图片实现边缘检测、滤波等操作。

### 如何使用

本仓库中的文件分为四个部分。`miniprogram`文件夹中是小程序部分文件，`server`中是小程序和网页的后端部分文件，`web`中是网页前端部分文件，`NeuS`是白模制作过程中使用的深度学习方法。每个文件夹中都有相应的使用说明。

#### 项目第一阶段链接

[3d-building-reconstruction](https://github.com/jshmsjh/3d-building-reconstruction)

[building-feature-recognition](https://github.com/jshmsjh/building-feature-recognition) 

[Swin-Transformer-Object-Detection](https://github.com/jshmsjh/Swin-Transformer-Object-Detection)

