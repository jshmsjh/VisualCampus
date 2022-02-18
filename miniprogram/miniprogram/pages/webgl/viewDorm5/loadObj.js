
import getDDSLoader from '../../../jsm/loaders/DDSLoader.js';
import getMTLLoader from '../../../jsm/loaders/MTLLoader.js';
import getOBJLoader from '../../../jsm/loaders/OBJLoader.js';
import { OrbitControls } from '../../../jsm/controls/OrbitControls';

export default function (canvas, THREE) {
    let { DDSLoader } = getDDSLoader(THREE);
    let { MTLLoader } = getMTLLoader(THREE);
    let OBJLoader = getOBJLoader(THREE);
    let window = THREE.global;

    let camera, scene, renderer, controls;

    let object;

    // main
    init();
    animate();


    // function
    function init() {

        //renderer
        {
            renderer = new THREE.WebGLRenderer({ canvas });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        //camera
        {
            console.log('幕布大小：',canvas.clientHeight*0.8,canvas.clientWidth)
            camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
            // camera.position.z = 250;
            console.log('camera position ',camera.position.x,camera.position.y,camera.position.z)

            camera.position.set(140,60,110)
            // camera.lookAt(0,0,0)
            // camera.position.set(700,300,100)
            // camera.position.z = 300;
        }
        //controls
        {
            controls = new OrbitControls(camera, canvas);
            // controls.target.set(0, 18, 20);
            controls.update();
        }

        // scene & light
        {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xAAAAAA);
            // 环境光
            let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
            scene.add(ambientLight);

            // 颜色，亮度
            let pointLight = new THREE.PointLight(0xffffff,0.8);
            camera.add(pointLight);
            scene.add(camera);

            // var axesHelper = new THREE.AxesHelper( 20 );
            // scene.add( axesHelper );
            // scene.add(new THREE.GridHelper(20, 20));
        }
        
        // manager

        function loadModel() {
            object.traverse(function (child) {
                if (child.isMesh) child.material.map = texture;
            });
            object.scale.set(1, 1, 1);
            object.position.set(0,18,20)
            console.log('目标位置：',object.position.x,object.position.y,object.position.z)
            // object.position.x = 0
            // object.position.y = 0
            // object.position.z = 0
            scene.add(object);
        }

        let manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = function (item, loaded, total) {

            console.log(item, loaded, total);

        };

        // texture

        let textureLoader = new THREE.TextureLoader(manager);

        let texture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

        // model

        function onProgress(xhr) {

            if (xhr.lengthComputable) {

                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

            }

        }

        function onError() { }

        let loader = new OBJLoader(manager);

        loader.load('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/obj/dorm5.obj?sign=fed10810f9b0b2321965c3b18118f0a7&t=1644723833', function (obj) {

            object = obj;

        }, onProgress, onError);

    }

    function animate() {

        canvas.requestAnimationFrame(animate);
        render();

    }

    function render() {

        camera.lookAt(scene.position);
        controls.update();

        renderer.render(scene, camera);

    }


}