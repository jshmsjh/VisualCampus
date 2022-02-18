/*
 * @author xiening
 * Running this will allow you to show white line around objects which you selected.
 */
/*
  * 需要在jsp中导入的包
  <script src="./ThreeJs/three.js"></script>
  <script src="./ThreeJs/EffectComposer.js"></script>
  <script src="./ThreeJs/RenderPass.js"></script>
  <script src="./ThreeJs/OutlinePass.js"></script>
  <script src="./ThreeJs/FXAAShader.js"></script>
  <script src="./ThreeJs/ShaderPass.js"></script>
  <script src="./ThreeJs/CopyShader.js"></script>
  */

THREE.ThreeJs_Composer = function ( _renderer, _scene, _camera, _options, _selectobject) {
    var raycaster = new THREE.Raycaster();
  	var mouse = new THREE.Vector2();
    var composer = new THREE.EffectComposer( _renderer );
    var renderPass = new THREE.RenderPass( _scene, _camera );
    var selectedObjects = [];
    composer.addPass( renderPass );
    var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), _scene, _camera );
    outlinePass.edgeStrength = 5;//包围线浓度
    outlinePass.edgeGlow = 0.5;//边缘线范围
    outlinePass.edgeThickness = 2;//边缘线浓度
    outlinePass.pulsePeriod = 2;//包围线闪烁评率
    outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
    outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色
    composer.addPass( outlinePass );
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    // composer.addPass( effectFXAA );

    window.addEventListener( 'click', onMouseClick);
    window.addEventListener( 'dblclick', onMouseDblClick);

    var door_state_left1 = true; //默认是门是关闭的
    var door_state_right1 = true; //默认是门是关闭的
    function onMouseClick( event ) {
        var x, y;
        if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
        console.log("x,y: ",mouse.x,mouse.y)
        raycaster.setFromCamera( mouse, _camera );
        var intersects = raycaster.intersectObjects( [ _scene ], true );

        if(intersects.length == 0){
            console.log("no object")
            $("#label").attr("style","display:none;");//隐藏说明性标签
            return;
        }
        // var num = intersects.length
        // for(var i=0;i<num;i++){
        //     console.log(intersects[i].object.name)
        // }
        // console.log(intersects.length,' object')
        console.log(intersects[0].object.name)
        console.log(intersects[0])
        if(intersects[0].object.name == ""){
            $("#label").attr("style","display:none;AutoSize:false;");//隐藏说明性标签
            selectedObjects.pop();
        }else if(intersects[0].object.name == "Mesh1 Model" || intersects[0].object.name == "Mesh16 Model"){
            $("#label").attr("style","display:block;");// 显示说明性标签
            $("#label").css({left: x + 30, top: y - 100, width: 200});// 修改标签的位置
            $("#label").css("line-height","25px");
            $("#label").css("white-space","pre-line");
            // $("#label").text("建筑本体");// 显示模型信息
            // https://cloud.tencent.com/developer/ask/46736
            if(intersects[0].object.id == 223){
                $("#label").text("网络楼 \n 窗户数目:44扇 \n 窗户平均面积:5平方米 \n 楼层数目:6层 \n 最长长度:45.7m \n 最宽宽度:17.9m \n 最高高度:24m \n 建筑物底面积:743平方米 \n 建筑体积:1.78万立方米");// 显示模型信息
            }else if(intersects[0].object.id == 277){
                $("#label").text("商学院 \n 窗户数目:60扇 \n 窗户平均面积:12平方米 \n 楼层数目:5层 \n 最长长度:120m \n 最宽宽度:60m \n 最高高度:31m \n 建筑物底面积:7600平方米 \n 建筑体积:23.6万立方米");// 显示模型信息
            }else if(intersects[0].object.id == 87){
                $("#label").text("学生公寓5号楼 \n 窗户数目:87扇 \n 窗户平均面积:6平方米 \n 楼层数目:6层 \n 最长长度:35m \n 最宽宽度:15m \n 最高高度:22m \n 建筑物底面积:1800平方米 \n 建筑体积:2.96万立方米");// 显示模型信息
            }
        }else{
            // console.log('test')
            $("#label").attr("style","display:block;");// 显示说明性标签
            $("#label").css({left: x, top: y - 50});// 修改标签的位置
            $("#label").text(intersects[0].object.name);// 显示模型信息

            selectedObjects.pop();
            selectedObjects.push( intersects[0].object );
            // console.log(selectedObjects)
            outlinePass.selectedObjects = selectedObjects;//给选中的线条和物体加发光特效
        }

        var Msg = intersects[0].object.name.split("$");
        if(Msg[0] == "货物") {
            _options.batchNo = "一个货物";
            _options.qty = "100";
            _options.qtyUom = "kg";
            _options.qty2 = "10";
            _options.selectObj = intersects[0].object.name;
            _selectobject.push( intersects[0].object );
        }

        
    }

    function onMouseDblClick( event ) {
        var x, y;
        if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, _camera );
        var intersects = raycaster.intersectObjects( [ _scene ], true );

        if(intersects.length == 0){
            return;
        }

        var Msg = intersects[0].object.name.split("$");
        if(Msg[0] == "货物") {
            var href = "DispatchAction.do?efFormEname=YMIQ083DP&inqu_status-0-storageUnitId=" + Msg[1];
            EFColorbox({
                href : href,
                title:"货物详情",
                innerWidth:'1200px',
                innerHeight:'800px',
                iframe : true,
                scrolling : false,
                overlayClose: false
            });
        }
    }

    return composer;
}
