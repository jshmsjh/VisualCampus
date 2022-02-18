### 微信小程序说明

相较于更加通用的网页端，微信小程序专用性与便利性都要更强一些，更适合碎片时间使用。不过由于手机性能相对较差，其对模型与代码有着更高的要求。下面对本次课程作业中微信小程序开发部分进行简要介绍。

#### 使用

请下载本项目仓库中的代码，并用最新版[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开即可。

注意，微信小程序计算机视觉部分需要后端服务器支持，请先查看同一仓库的后端代码说明。在后端服务器配置成功后，请将小程序`.\miniprogram\pages\CV\index.js`中的`data.IP`替换为自己的IP地址。之后即可以正常使用计算机视觉功能

#### 小程序结构

小程序主要分为图片展示、模型展示、计算机视觉方法和项目说明四个部分。

##### 1 图片展示

模型图片的主要功能是以图片的形式展示三维重建的结果。在这里我们选择将图片放入到markdown文件中，并通过微信小程序富文本解析插件`towxml`进行解析。

##### 2 模型展示

本项目重建出的三维模型包括**点云**和**白模**两类，在考察了多种Three.js在小程序端的移植版本后，我们最终选用了相对较新且较为轻量的[这个版本](https://github.com/yannliao/threejs.miniprogram)。由于我们在网络上收集到的所有的版本在小程序端都不支持点云文件的展示，因此小程序只展示重建后得到的白模。（事实上，我们也层尝试过将Three.js的Loadply.js移植到小程序上，但最终由于工程量与难度过大而搁置）

在重建白模时，我们考虑到手机端可能的性能不足问题，尽可能的压缩了白模的大小以减小渲染压力。最终版的**白模体积均控制在了1.2Mb以内**，并且可以在小程序端**流畅显示**。

##### 3 计算机视觉

计算机视觉部分，我们搭建了一个展示计算机视觉相关函数效果的页面。用户可以选择将图片上传至云服务器中，并在前端选择需要使用的方法（目前**支持形态学处理等6类共26种方法**）。

云服务器后端方面，我们选用了最为轻量的**Flask**为小程序及网站提供支持。云服务器及计算机视觉相关函数均用python编写。

##### 4 项目说明

项目说明中使用了`towxml`显示markdown，整体小程序的工程目录如下所示：

![tree](https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/img/tree.jpg?sign=f31a2458a8c1f889a734cbf4385d2490&t=1645186376)

### 参考

冈萨雷斯. 数字图像处理[M]. 电子工业出版社, 2007.

https://threejs.org/

https://opencv.org/

https://flask.palletsprojects.com/en/2.0.x/

https://github.com/xiao149/ThreeJsDemo

https://blog.csdn.net/homula123?type=blog

https://github.com/ventusff/neurecon

https://github.com/yannliao/threejs.miniprogram

https://stackoverflow.com/questions/16226693/three-js-show-world-coordinate-axes-in-corner-of-scene

https://threejs.org/docs/#api/en/loaders/ObjectLoader

https://www.daimajiaoliu.com/daima/485ac3014100408

https://github.com/puxiao/threejs-tutorial

https://chowdera.com/2021/12/202112201442507402.html
