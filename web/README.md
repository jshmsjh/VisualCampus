# 项目部署

点云文件占用空间较多，本仓库中不包含点云文件，你可以在[这里](https://pan.baidu.com/s/1EXMqSJxVzMy3WA8i3E1QWg)下载网页中展示的点云（提取码：w121）。

## 在本地PC上安装

安装 [node.js](http://nodejs.org/)

安装 package.json 中指定的依赖包

```
npm install
```

## 在本地PC上运行

使用 `npm start` 命令来

- 在 `localhost:1234` 启动一个 Web 服务器。

转到 http://localhost:1234 以浏览该网站项目。

## 在服务器上部署

将该项目所有文件上传到服务器。

在 `./gulpfile.js` 中配置 Web 服务器，如下示例为在 `0.0.0.0:1234`端口启动服务：

```javascript
gulp.task('webserver', gulp.series(async function() {
  server = connect.server({
​    port: 1234,
​    https: false,
     host:'0.0.0.0'
  });
}));
```

其他操作与本地部署相同。

## 显示自己的点云

### 将点云转化为potree格式

下载 [PotreeConverter](https://github.com/potree/PotreeConverter) 并像这样运行它：

```
./PotreeConverter.exe <input> -o <outputDir>
```

将转换后的目录复制到  `./pointclouds/<outputDir>` 。

然后，复制并重命名`./sxy.html`，并将 html 文件中的点云路径在如下位置修改为您自己的点云：

```
    Potree.loadPointCloud("../pointclouds/<outputDir>/cloud.js", "sigeom.sa", e => {
     let scene = viewer.scene;
     let pointcloud = e.pointcloud;     
     let material = pointcloud.material;
     material.size = 1;
     material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
     material.shape = Potree.PointShape.SQUARE;     
     scene.addPointCloud(pointcloud);     
     viewer.fitToScreen();
  });


```

# 访问我们的网站

[VisualCampus 视觉校园](http://www.visualcampus.top/)

