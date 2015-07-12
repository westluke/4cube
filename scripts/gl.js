var container;
var camera, controls, scene, renderer;
var geo, geos, line, tubes, curves, sh;
var light;

var xw = rotateXW_4d(0.01);
var wy = rotateWY_4d(0.01);
var wz = rotateWZ_4d(0.01);
var cnt = 0;
// monitorControls();

init();

function init(){
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    // renderer.setScissor(-1000, -1000, 2000, 2000)
    // renderer.setViewport(-1000, -1000, 2000, 2000)

    // camera = new THREE.OrthographicCamera( -1.1, 1.1, 1.1, -1.1, 0.001, 10 );
    camera = new THREE.PerspectiveCamera( 60, 1, 1, 10);
    camera.position.set( 0, 0, 2.5 );
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 1;
	controls.maxDistance = 10;
    controls.noZoom = false;

	light = new THREE.PointLight( 0xffffff);
	light.position.copy( camera.position );
	scene.add( light );


    var line = getLines(POINTS, genConns(POINTS));
    var ret_list = plot(line, scene);

    curves = ret_list[0].slice(0);
    geos = ret_list[1].slice(0);
    exs = ret_list[3].slice(0);
    sh = ret_list[2];
    console.log(curves);
    console.log(geos);
    console.log(exs);

    var ax = new THREE.AxisHelper(10);
    scene.add(ax);

    controls.addEventListener( 'change', render);
    animate();
    center(curves, exs);
    renderer.render(scene, camera);
}

function animate(){
    setTimeout( function() {
        // cnt ++;
        if (cnt < 100 ){requestAnimationFrame( animate );}
        else{
            // console.log(exs);
            monitorControls();
        }

    }, 1 );
    controls.update();
    transEx(curves, geos, sh, xw);
    transEx(curves, geos, sh, wy);
    transEx(curves, geos, sh, wz);
    controls.update();
    renderer.render(scene, camera);
    center(curves, exs);
}

function monitorControls(){
    requestAnimationFrame(monitorControls);
    controls.update();
}

function render() {
    light.position.copy( camera.position );
    renderer.render(scene, camera);
    // console.log(camera.position);
    // console.log(exs[1].position.sub(camera.position));
};
