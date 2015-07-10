var container
var camera, controls, scene, renderer;
var cross;
var geo, line;

init();
monitorControls();

function init(){
    camera = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
    camera.position.z = 2.2;

    scene = new THREE.Scene();

    line = getLines(makeHypercube(), genConns(makeHypercube()));
    var ret = plot(line, scene);
    geo = ret[0];
    line = ret[1];

    // var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	// var material =  new THREE.MeshBasicMaterial( { color:0xffffff} );
    //
	// for ( var i = 0; i < 500; i ++ ) {
    //
	// 	var mesh = new THREE.Mesh( geometry, material );
	// 	mesh.position.x = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.position.y = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.position.z = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.updateMatrix();
	// 	mesh.matrixAutoUpdate = false;
	// 	scene.add( mesh );
    //
	// }

    // var geometry = new THREE.BoxGeometry(50, 50, 50);
    // var material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00
    // });
    // var cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);


    // var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 550, 550 );
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = true;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 1500;
    controls.dynamicDampingFactor = 15;

    controls.addEventListener( 'change', render);
    render();
}

function monitorControls(){
    requestAnimationFrame(monitorControls);
    controls.update();
}

function render() {
    center(geo, line);
    renderer.render(scene, camera);
    console.log(camera.position.x, camera.position.y, camera.position.z);
};




// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// var container, stats;
//
// var camera, controls, scene, renderer;
//
// var cross;
//
// init();
// animate();
//
// function init() {
//
// 	camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
// 	camera.position.z = 5;
//
// 	controls = new THREE.TrackballControls( camera );
//
// 	controls.rotateSpeed = 1.0;
// 	controls.zoomSpeed = 1.2;
// 	controls.panSpeed = 0.8;
//
// 	controls.noZoom = false;
// 	controls.noPan = false;
//
// 	controls.staticMoving = true;
//
// 	// controls.keys = [ 65, 83, 68 ];
//
// 	controls.addEventListener( 'change', render );
//
// 	// world
//
// 	scene = new THREE.Scene();
// 	// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
//
// 	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
// 	var material =  new THREE.MeshBasicMaterial( { color:0xffffff} );
//
// 	for ( var i = 0; i < 500; i ++ ) {
//
// 		var mesh = new THREE.Mesh( geometry, material );
// 		mesh.position.x = ( Math.random() - 0.5 ) * 1000;
// 		mesh.position.y = ( Math.random() - 0.5 ) * 1000;
// 		mesh.position.z = ( Math.random() - 0.5 ) * 1000;
// 		mesh.updateMatrix();
// 		mesh.matrixAutoUpdate = false;
// 		scene.add( mesh );
//
// 	}
//
// 	// renderer
//
// 	renderer = new THREE.WebGLRenderer( { antialias: false } );
// 	// renderer.setClearColor( scene.fog.color );
// 	renderer.setPixelRatio( window.devicePixelRatio );
// 	renderer.setSize( 600, 600 );
//
// 	container = document.getElementById( 'container' );
// 	container.appendChild( renderer.domElement );
//
// 	// stats = new Stats();
// 	// stats.domElement.style.position = 'absolute';
// 	// stats.domElement.style.top = '0px';
// 	// stats.domElement.style.zIndex = 100;
// 	// container.appendChild( stats.domElement );
//
// 	//
//
// 	// window.addEventListener( 'resize', onWindowResize, false );
// 	//
//
// 	render();
//
// }
//
// // function onWindowResize() {
// //
// // 	camera.aspect = window.innerWidth / window.innerHeight;
// // 	camera.updateProjectionMatrix();
// //
// // 	renderer.setSize( window.innerWidth, window.innerHeight );
// //
// // 	controls.handleResize();
// //
// // 	render();
// //
// // }
//
// function animate() {
//
// 	requestAnimationFrame( animate );
// 	controls.update();
//     console.log(camera.position.x, camera.position.y, camera.position.z);
//
// }
//
// function render() {
//
// 	renderer.render( scene, camera );
// 	// stats.update();
//
// }








// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, 400 / 300, 1, 1000);
//
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(400, 300);
// document.body.appendChild(renderer.domElement);
//
// var controls = new THREE.TrackballControls(camera, renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 4;
// controls.panSpeed = 0.8;
// controls.noZoom = false;
// controls.noPan = false;
// controls.staticMoving = true;
// controls.dynamicDampingFactor = 0.3;
//
//
// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00
// });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
//
// camera.position.z = 5;
//
// var render = function() {
//   requestAnimationFrame(render);
//   controls.update();
//   // cube.rotation.x += 0.1;
//   // cube.rotation.y += 0.1;
//
//   renderer.render(scene, camera);
// };
//
// render();
