// document.body.onload=function(){
//
//     var x = document.getElementById("gltest");
//     var xj = $("#gltest");
//
//     var scene = new THREE.Scene();
//     var camera = new THREE.PerspectiveCamera( 75, 1, 0.001, 1000 );
//
//     var renderer = new THREE.WebGLRenderer({alpha: true});
//     renderer.setSize(400, 400);
//     x.appendChild( renderer.domElement );
//     //
//     var geometry = new THREE.BoxGeometry( 3, 3, 3 );
//     var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
//     var cube_bad = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(0xff0000));
//     var cube = new THREE.BoxHelper(cube_bad);
//     cube.material.color.set(0xff0000)
//     cube_bad.position.x += 3
//     scene.add( cube );
//     scene.add( cube_bad );
//     var axisHelper = new THREE.AxisHelper( 5 );
//     scene.add( axisHelper );
//
//     var g = new THREE.BoxGeometry(1, 1, 1);
//     var mat = new THREE.MeshBasicMaterial({color: 0xff0000});
//     var c = new THREE.Mesh(g, mat);
//     scene.add(c);
//
//
//     // lines = getLines(makeHypercube(), genConns(makeHypercube()));
//     // plot(lines, scene);
//
//     // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
//     camera.position.z = 5;
//
//
//     controls = new THREE.TrackballControls( camera );
//
// 	controls.rotateSpeed = 1.0;
// 	controls.zoomSpeed = 1.2;
// 	controls.panSpeed = 0.8;
//
// 	controls.noZoom = false;
// 	controls.noPan = false;
//
// 	controls.staticMoving = true;
// 	controls.dynamicDampingFactor = 0.3;
//
// 	controls.keys = [ 65, 83, 68 ];
//
// 	controls.addEventListener( 'change', render );
// //     controls = new THREE.OrbitControls( camera );
// //         //    controls.damping = 0.2;
// //     controls.minPolarAngle = -Infinity;
// //     controls.maxPolarAngle = Infinity;
// //     console.log(controls.minPolarAngle);
// //     controls.minAzimuthAngle = - Infinity; // radians
// // controls.maxAzimuthAngle = Infinity; // radians
// //     controls.addEventListener( 'change', render );
//
//     // camera.position.z = 15;
//     // camera.position.x = 4;
//     // camera.position.y = 15;
//
//
//     // var material1 = new THREE.LineBasicMaterial({
// 	//     color: 0x0080ff
//     // });
//
//     // var geometry1 = new THREE.Geometry();
//     // geometry1.vertices.push(
//     // 	// new THREE.Vector4( -10, 0, 0, 1 ),
//     // 	// new THREE.Vector4( 0, 10, 0, 1 ),
//     // 	// new THREE.Vector4( 10, 0, 0, 2 )
//     //     new THREE.Vector3( -10, 0, 0),
//     // 	new THREE.Vector3( 0, 10, 0),
//     // 	new THREE.Vector3( 10, 0, 0)
//     // );
//     //
//     // var line = new THREE.Line( geometry1, material1 );
//     // scene.add( line );
//
//     function render() {
//         // cube_bad.rotation.x += 0.01;
//         // cube_bad.rotation.y += 0.01;
//     	// requestAnimationFrame( render );
//     	renderer.render( scene, camera );
//     }
//     render();
// };

var container, stats;
var camera, controls, scene, renderer;
var cross;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 500 );
	camera.position.z = 500;

	// world

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	// var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
    var material =  new THREE.MeshBasicMaterial( { color:0xffffff} );

	for ( var i = 0; i < 500; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = ( Math.random() - 0.5 ) * 1000;
		mesh.position.y = ( Math.random() - 0.5 ) * 1000;
		mesh.position.z = ( Math.random() - 0.5 ) * 1000;
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = false;
		scene.add( mesh );

	}


	// lights

	// light = new THREE.DirectionalLight( 0xffffff );
	// light.position.set( 1, 1, 1 );
	// scene.add( light );
    //
	// light = new THREE.DirectionalLight( 0x002288 );
	// light.position.set( -1, -1, -1 );
	// scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
	// renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio ); //Makes lines less pixelated, stepped
	renderer.setSize( 500, 200 );

    console.log(renderer.domElement)

    controls = new THREE.TrackballControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    controls.zoomSpeed = 0;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );


	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	// window.addEventListener( 'resize', onWindowResize, false );
	//

	render();

}

// function onWindowResize() {
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	controls.handleResize();
// 	render();}

function animate() {

	requestAnimationFrame( animate );
	controls.update();

}

function render() {

	renderer.render( scene, camera );
	// stats.update();

}
