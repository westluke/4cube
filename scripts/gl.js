var container
var camera, controls, scene, renderer;
var cross;
var geo, line;
var tubes;
var light;
var curves;
var exs, sh;
var geos;

// var xw = rotateXW_4d(0.005);
// var wy = rotateWY_4d(0.02);
// var wz = rotateWZ_4d(0.01);

var xw = rotateXW_4d(0.01);
var wy = rotateWY_4d(0.01);
var wz = rotateWZ_4d(0.01);
var cnt = 0;
// monitorControls();

init();
// Transform vectors of tubes, not tubes themselves. I don't think the tubes can handle it/

function init(){
        // camera = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
        // camera.position.z = 2.2;
        scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    renderer.setScissor(-1000, -1000, 2000, 2000)
    renderer.setViewport(-1000, -1000, 2000, 2000)
    camera = new THREE.PerspectiveCamera( 60, 1, 1, 10);
    // camera = new THREE.OrthographicCamera( -1.1, 1.1, 1.1, -1.1, 0.001, 10 );
    // camera = new THREE.OrthographicCamera( -2, 2, 2, -2, 1, 1000 );
    // camera = new THREE.CombinedCamera( 20, 20, 70, 1, 1000, - 500, 1000 );
    // camera.toOrthographic();
	camera.position.set( 0, 0, 2.5 );
    // console.log(camera.projectionMatrix);

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 1;
	controls.maxDistance = 10;

	// scene.add( new THREE.AmbientLight( 0x737373) );

	light = new THREE.PointLight( 0xffffff);
	light.position.copy( camera.position );
	scene.add( light );




        var line = getLines(POINTS, genConns(POINTS));
        // console.log(line);
    var ret_list = plot(line, scene);

    curves = ret_list[0].slice(0);
    geos = ret_list[1].slice(0);
    exs = ret_list[3].slice(0);
    // console.log(exs);

    // geos[4].verticesNeedUpdate = true;
    // // geos[4].vertices[0] = new THREE.Vector4(0, 0, 0, 0);
    // geos[4].verticesNeedUpdate = true;
    // console.log(geos[4].vertices[0]);
    sh = ret_list[2];
        // var ret = plot(line, scene);
        // geo = ret[0];
        // line = ret[1];


    // canvas already at max height. settings on right to switch to animation mode, and in each mode gives options.
    //   settings icon just allows you to switch line style and such, color continuous manual rotation, etc.






    // var closedSpline = new THREE.SplineCurve3( [//toVec(POINTS)[1]);
    //                 new THREE.Vector3(0, 0, 0),
    //                 new THREE.Vector3(0, 0.5, 0),                  // new THREE.Vector3(1, 1, 0),
    //                 new THREE.Vector3(1, 1, 0),
    //                 new THREE.Vector3(1, 1, 0)
    // 				// new THREE.Vector3( -60, -100,  60 ),
    // 				// new THREE.Vector3( -60,   20,  60 ),
    // 				// new THREE.Vector3( -60,  120,  60 ),
    // 				// new THREE.Vector3(  60,   20, -60 ),
    // 				// new THREE.Vector3(  60, -100, -60 )
    // 			// ] );
    //         ]);
    //
    // console.log(toVec(POINTS)[1])
	// var extrudeSettings = {
	// 	steps			: 4,
	// 	bevelEnabled	: false,
	// 	extrudePath		: closedSpline
	// };
	// var pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.25, 0), new THREE.Vector2(0.125, 0.22)], count = 3;
	// var shape = new THREE.Shape( pts );
	// var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	// var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
	// var mesh = new THREE.Mesh( geometry, material );
	// scene.add( mesh );
    //
    // var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper );

    // lights
    // light = new THREE.DirectionalLight( 0xffffff );
    // light.position.set( 1, 1, 1 );
    // scene.add( light );
    //
    // light = new THREE.DirectionalLight( 0x002288 );
    // light.position.set( -1, -1, -1 );
    // scene.add( light );

    // light = new THREE.AmbientLight( 0xffff00 );
    // scene.add( light );


        // renderer = new THREE.WebGLRenderer({alpha: false});
        // renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setSize( 550, 550 );
        // container = document.getElementById( 'container' );
        // container.appendChild( renderer.domElement );

        // controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 1.0;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        // controls.noZoom = true;
        controls.noPan = true;
        // controls.staticMoving = true;
        // controls.minDistance = 2.5;
        // controls.maxDistance = 1500;
        controls.dynamicDampingFactor = 1;
center(curves, exs);
        controls.addEventListener( 'change', render);
    animate();
                                    renderer.render(scene, camera);
}

function animate(){
    // setTimeout( function() {
        // cnt ++;
        if (cnt < 140 ){requestAnimationFrame( animate );}
        // else{
            monitorControls();
        // }

    // }, 1 );
    transEx(curves, geos, sh, xw);
    transEx(curves, geos, sh, wy);
    transEx(curves, geos, sh, wz);
    controls.update();
                                    renderer.render(scene, camera);
    center(curves, exs);
}

function monitorControls(){
    // setTimeout (function (){
        requestAnimationFrame(monitorControls);
    // }, 5);
    controls.update();
    // transformExtrusions(tubes, rotateXW_4d(0.1));
}

function render() {
    light.position.copy( camera.position );
    renderer.render(scene, camera);
    // console.log(camera.position.x, camera.position.y, camera.position.z);
};
