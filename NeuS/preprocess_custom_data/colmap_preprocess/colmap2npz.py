# modified from https://github.com/lioryariv/idr/blob/main/code/preprocess/preprocess_cameras.py
import numpy as np
import os
import colmap_read_model as read_model


DIR = "/home/sjh/others/model/NeuS-main/public_data/wll"
DST = os.path.join(DIR, "cameras_sphere.npz")


camerasfile = os.path.join(DIR, 'sparse/0/cameras.bin')
camdata = read_model.read_cameras_binary(camerasfile)
list_of_keys = list(camdata.keys())
cam = camdata[list_of_keys[0]]

h, w, f, cx, cy = cam.height, cam.width, cam.params[0], cam.params[1], cam.params[2]
k = np.array([[f, 0, cx],
              [0, f, cy],
              [0, 0, 1]])

imagesfile = os.path.join(DIR, 'sparse/0/images.bin')
imdata = read_model.read_images_binary(imagesfile)
bottom = np.array([0, 0, 0, 1.]).reshape([1, 4])
names = [imdata[k].name for k in imdata]
perm = np.argsort(names)
cameras = {}
for i in perm:
    im = imdata[i+1]
    r = im.qvec2rotmat()
    t = im.tvec.reshape([3, 1])
    w2c = np.concatenate([np.concatenate([r, t], 1), bottom], 0)
    c2w = np.linalg.inv(w2c)

    r = c2w[:3, :3]
    r = r.T  # because of the load_K_Rt_from_P() function implemented in dataset.py
    # where the decomposed rotation matrix is transposed
    t = c2w[:3, 3]
    t = -t # -t because of the opencv projection
    # matrix decomposition function implementation
    # https://stackoverflow.com/questions/62686618/opencv-decompose-projection-matrix/69556782#69556782

    wm = np.eye(4)
    wm[:3,:3] = k @ r
    wm[:3,3] = k @ r @ t

    cameras['world_mat_%d' % i] = wm
    cameras['scale_mat_%d' % i] = np.eye(4)

np.savez(DST, **cameras)