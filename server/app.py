from flask import Flask, current_app, request
import socket
import cv2
from Functions import ImageFunctions
import datetime
import random
import copy
# import ast
from flask_cors import CORS
import json

# change root
app = Flask(__name__)
CORS(app)


class Config(object):
    DEBUG = True

def number_today():
    f = open('./static/record/record.json','w')
    content = f.read()
    a = json.loads(content)
    print(a)
    f.close()
    
def create_id():
    nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # current time
    randomNum = random.randint(0, 100)  # random integer
    if randomNum <= 10:
        randomNum = str(0) + str(randomNum)
    uniqueNum = str(nowTime) + str(randomNum)
    return uniqueNum

app.config.from_object(Config)
ename='jpg'
IP='http://116.62.132.196:5000/'
tmp=''

@app.route('/up_photo', methods=['GET','POST'])
def up_photo():
    rdmm = create_id()
    num=rdmm
    global ename,tmp
    tmp=rdmm
    print('start')
    print(request.files)
    img_req = request.files.get('uploadFile')
    ename = img_req.filename.split('.')[-1]
    filename = num+'.'+ img_req.filename.split('.')[-1]
    img_req.save('static/'+filename)
    savepath = 'static/'+filename
    print(IP+savepath)
    return IP+savepath


@app.route('/receiveOrder',methods=['GET','POST'])     # miniprogram request
def receiveOrder():
    # available methods
    avail_methods=['blur','toGray','toBinary','otsu','MA','adaThresh','equalizeHist','clahe',
                    'sauvola','erode','dilate','opening','brighter','dimmer','edgeRein','USM',
                    'medianBlur','meanBlur','gaussianBlur','maskBlur','sobel','canny','smooth',
                    'laplacian','closing','contour']
    global tmp
    fpath = 'static/' + tmp+'.'+ename
    data=request.get_json()['order']
    function = ImageFunctions(fpath)
    rdmm = create_id()
    tmp=rdmm

    print(data)
    if data in avail_methods:
        # img_new = ast.literal_eval('x.'+data)
        print(data+'()')
        img_new = eval('function.'+data+'()')
        
    cv2.imwrite('static/' + rdmm + '.' + ename, img_new)
    fpath = 'static/' + rdmm + '.' + ename
    print('IP+filepath'+IP+fpath)
    return IP+fpath


if __name__ == '__main__':
    host_name = socket.gethostbyname(socket.gethostname())
    print(host_name)
    app.run(host=host_name, port=5000)
