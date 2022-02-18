# 服务器部署

<details>
  <summary> Dependencies (click to expand) </summary>
  - flask
  - socket
  - cv2
  - datetime
  - random
  - copy
  - flask_cors
  - scipy
  - numpy
  - skimage
  - numba
  - </details>
#### 使用

1. 在`app.py`中将`IP`及端口替换为自有服务器的IP与端口，注意需要保证端口开放；
2. 完成网页或小程序端相应的配置；
3. 在控制台根目录下输入`python3 app.py`，打开flask服务

#### 常见问题

如果你使用的是阿里云服务器，可能会遇到flask启动成功但没有相应的情况。如果你已经打开了相应端口，可以在控制台中输入`firewall-cmd --add-port=port/tcp`来将对应的端口开放，其中port为端口号。

#### 参考

https://flask.palletsprojects.com/en/2.0.x/

https://www.cxyzjd.com/article/qq_27575895/82693102

https://zhuanlan.zhihu.com/p/37750930

