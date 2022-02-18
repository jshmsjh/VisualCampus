import cv2
import matplotlib.pyplot as plt
import numpy as np
import math
import sys
import copy
from scipy.signal import lfilter
from skimage.data import page
from skimage.filters import (threshold_otsu, threshold_niblack,threshold_sauvola)
from numba import jit
import time

time.clock = time.time
class ImageFunctions(object):

    def __init__(self,filepath):
        print(filepath)
        self.img=cv2.imread(filepath)
        self.img=cv2.cvtColor(self.img,cv2.COLOR_RGB2BGR)
        if len(self.img.shape)==3:
            print('3D')
            # 直接把BGR转RGB
            self.b, self.g, self.r = cv2.split(self.img)
            self.img = cv2.merge([self.r, self.g, self.b])
        elif len(self.img.shape)==2:
            print('2D')
            self.b, self.g, self.r = self.img, self.img, self.img
            self.img=cv2.merge([self.img,self.img,self.img])

    def show(self,img,title=None):
        if title in ['gray','binary','edgeGet','saveInk']:
            plt.imshow(img,cmap='gray')
        else:
            plt.imshow(img)
        plt.axis('off')
        plt.title(title)
        plt.show()

    # 常用
    def brighter(self):
        rate=1.1
        img_bright=rate*self.img
        img_bright[img_bright>255]=255
        img_bright=np.round(img_bright)
        img_bright=img_bright.astype(np.uint8)
        return img_bright

    def dimmer(self):  
        rate=0.9
        img_dim=self.img*rate
        img_dim=np.round(img_dim)
        img_dim=img_dim.astype(np.uint8)
        return img_dim

    def toGray(self):  # 灰度图
        img_gray=0.2126*self.r+0.7152*self.g+0.0722*self.b
        return img_gray

    def toBinary(self):  # 黑白图
        img_gray = 0.299 * self.r + 0.587 * self.g + 0.114 * self.b
        img_gray=img_gray.astype(np.uint8)
        blur = cv2.GaussianBlur(img_gray, (5, 5), 0)
        ret,img_bi=cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return img_bi
    
    def blur(self):  # 模糊
        kernel=np.array([[1/16,  1/16,  1/16,  1/16,  1/16],
                         [1/16,  0/16,  0/16,  0/16,  1/16],
                         [1/16,  0/16,  0/16,  0/16,  1/16],
                         [1/16,  0/16,  0/16,  0/16,  1/16],
                         [1/16,  1/16,  1/16,  1/16,  1/16]],
                        dtype=np.float32)
        dst=cv2.filter2D(self.img,-1,kernel)
        dst=dst.astype(np.uint8)
        return dst

    # 中值平滑，用于椒盐噪声
    def smooth(self):  
        print('-----------------------------')
        kernel=np.array([[1/79,  8/79,  9/79],
                         [16/79, 5/79,  1/79],
                         [12/79, 11/79, 6/79]],
                        dtype=np.float32)
        dst=cv2.filter2D(self.img,-1,kernel)
        dst=dst.astype(np.uint8)
        return dst


    # 均衡化/图像增强
    def equalizeHist(self):  # 直方图全局均衡
        r = cv2.equalizeHist(self.r)
        g = cv2.equalizeHist(self.g)
        b = cv2.equalizeHist(self.b)
        img_equalizeHist=cv2.merge([r,g,b])
        return img_equalizeHist

    def clahe(self):  # 限制对比度自适应直方图均衡化
        clahe=cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))    # 默认参数
        r = clahe.apply(self.r)
        g = clahe.apply(self.g)
        b = clahe.apply(self.b)
        img_clahe=cv2.merge([r,g,b])
        return img_clahe

    def edgeRein(self):  # 边缘增强
        kernel = np.array([[-1/2, -1/2, -1/2],
                           [-1/2, 10/2, -1/2],
                           [-1/2, -1/2, -1/2]], 
                           dtype=np.float32)
        dst = cv2.filter2D(self.img, -1, kernel)
        dst = dst.astype(np.uint8)
        return dst

    def USM(self):
        gauss=cv2.GaussianBlur(self.img, (0, 0), 5)
        usm=cv2.addWeighted(self.img,1.5,gauss,-0.5,0)
        #self.show(usm, title='Reinforce2')
        return usm


    def contour(self):  # 轮廓
        kernel = np.array([[-1, -1, -1],
                           [-1, 8, -1],
                           [-1, -1, -1]], dtype=np.float32)
        dst = cv2.filter2D(self.img, -1, kernel)
        dst = dst.astype(np.uint8)
        return dst

    # 形态学处理
    def erode(self):  # 腐蚀
        ero=cv2.erode(self.img, kernel=np.ones((5, 5), np.uint8))
        return ero

    def dilate(self):  # 膨胀
        dilation = cv2.dilate(self.img, kernel=np.ones((5, 5),np.uint8), iterations=1)
        return dilation

    def opening(self):  # 开运算
        opening = cv2.morphologyEx(self.img, cv2.MORPH_OPEN, kernel=np.ones((5, 5),np.uint8))
        return opening

    def closing(self):  # 开运算
        closing = cv2.morphologyEx(self.img, cv2.MORPH_CLOSE, kernel=np.ones((5, 5),np.uint8))
        return closing

    # 阈值处理
    def MA(self,n=10,k=0.5): # 移动平均
        shape=self.img.shape
        f1=self.img.copy()
        assert n>=1
        assert 0<k<1
        f1[1:-1:2, :] = np.fliplr(self.img[1:-1:2, :])
        f1 = f1.flatten()
        maf = np.ones(n) / n
        res_filter = lfilter(maf, 1, f1)
        g = np.array(f1 > k * res_filter).astype(int)
        g = g.reshape(shape)
        g[1:-1:2, :] = np.fliplr(g[1:-1:2, :])
        g = g * 255
        return g

    def adaThresh(self, winSize=11, ratio=0.15): 
        mean = cv2.boxFilter(self.img, cv2.CV_32FC1, (winSize, winSize)) 
        out = self.img - (1.0 - ratio) * mean  
        out[out >= 0] = 255
        out[out < 0] = 0
        out = out.astype(np.uint8)
        self.show(out,title='adaptiveThresh')
        return out

    def sauvola(self, windowSize=15, k=0.2): 
        imgcpy = copy.deepcopy(self.img)
        threshold = threshold_sauvola(imgcpy, windowSize, k)
        print(threshold)
        imgcpy[imgcpy > threshold] = 255
        imgcpy[imgcpy < threshold] = 0
        self.show(imgcpy, title='sauvola')
        return imgcpy

    def otsu(self):  # Otsu
        blur = cv2.GaussianBlur(self.r, (5, 5), 0)
        ret,img_bir=cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        blur = cv2.GaussianBlur(self.g, (5, 5), 0)
        ret, img_big = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        blur = cv2.GaussianBlur(self.b, (5, 5), 0)
        ret, img_bib = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        img_bi=cv2.merge([img_bir,img_big,img_bib])
        return img_bi

    # 滤波
    def maskBlur(self):  # 掩模滤波器
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]],
                           dtype=np.float32)
        dst = cv2.filter2D(self.img, -1, kernel)
        dst = dst.astype(np.uint8)
        #elf.show(dst, title='Reinforce')
        return dst

    def meanBlur(self):  # 均值滤波器
        mask = np.ones((5,5))
        mask = mask / 35
        blur_img = cv2.filter2D(self.img,-1,mask)
        # blur_img = cv2.blur(self.img, (5, 5))
        return blur_img

    def gaussianBlur(self,sigma=2):  # 高斯滤波
        mask_height = mask_width = int(sigma*2+1)
        mask = np.zeros((mask_height, mask_width))
        sum = 0
        for i in range(-sigma,sigma+1):
            for j in range(-sigma,sigma+1):
                mask[i+sigma][j+sigma] = np.exp(-0.5 * (i ** 2 + j ** 2) / sigma ** 2)
                sum += mask[i+sigma][j+sigma]
        mask /= sum
        blur_img = cv2.filter2D(self.img,-1,mask)
        blur_img = cv2.GaussianBlur(self.img, (5, 5), 0)
        # blur_img = cv2.gaussianBlur(self.img, (5, 5), 0)
        return blur_img

    def medianBlur(self):  # 中值滤波
        blur_img = cv2.medianBlur(self.img, 5)
        return blur_img


    # 边缘检测
    def canny(self):  # 边界提取
        # 过滤高频， 使图像符合奈奎斯特采样定理
        gauss = cv2.GaussianBlur(self.img, (5, 5), 0)
        img_bi = cv2.Canny(gauss, 50, 230)
        return img_bi

    def laplacian(self):  # 边界提取
        # 过滤高频， 使图像符合奈奎斯特采样定理
        gauss = cv2.GaussianBlur(self.img, (5, 5), 0)
        kernel = np.array([[0, 1, 0],
                           [1, -4, 1],
                           [0, 1, 0]], dtype=np.float32)
        dst = cv2.filter2D(self.img, -1, kernel)
        dst = dst.astype(np.uint8)
        #self.show(dst, title='contour')
        return dst

    def sobel(self):  # 边界提取
        # 过滤高频， 使图像符合奈奎斯特采样定理
        gauss = cv2.GaussianBlur(self.img, (5, 5), 0)
        gray = cv2.cvtColor(gauss, cv2.COLOR_BGR2GRAY)
        grad_x = cv2.Sobel(gray, -1, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, -1, 0, 1, ksize=3)
        img  = cv2.addWeighted(grad_x, 0.5, grad_y, 0.5, 0)
        # img_bi = cv2.Sobel(gauss, 50, 230)
        return img