var container;
var camera, controls, scene, renderer;
var geo, geos, line, tubes, curves, sh;
var light;

var xw = rotateXW_4d(0.02);
var wy = rotateWY_4d(0.02);
var wz = rotateWZ_4d(0.02);
var cnt = 0;
var composer;

var loopFlag = false;

var dumb1 = rotateXW_4d(0.001);
var dumb2 = rotateXW_4d(-0.001);;



// TO SPEED UP: THE REASON THE POINTS WEREN'T SHADING WAS (I THINK) BECAUSE THEY WERE INTIALIZED AS POINTS.
// MY CURRENT SOLUTION OF UPDATING THE ENTIRE GEOMETRY WITH EACH ROTATION WORKS, BUT IT MIGHT BE OVERKILL.
// IF I CAN TAKE AN ORDER(N) INCREASE IN THE INITIALIZATION, I MIGHT SPEED UP THE ROTATIONS A LOT.
// I CAN TRY INITIALIZING EACH EXTRUSION TO SOME DEFAULT LINE, THEN UPDATING THEM TO POINTS, THEN UPDATING ONLY THE VERTICES OF THE GEOMETRIES.
//
//





init();
initialRender();

function init(){
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, 1, 0.001, 8);
    camera.position.set( 0, 0, 2 );
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 1;
	controls.maxDistance = 6;
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

    controls.addEventListener( 'change', render);
    center(curves, exs);

}

function animate(){
    setTimeout( function() {
        if (loopFlag){
            requestAnimationFrame(animate); }
    }, 1);
    controls.update();
    transEx(curves, geos, exs, sh, xw);
    transEx(curves, geos, exs, sh, wy);
    transEx(curves, geos, exs, sh, wz);
    center(curves, exs);
    renderer.render(scene, camera);
}

function initialRender(){
    if (!loopFlag){
        console.log("FUCK");
        // controls.update();

        transEx(curves, geos, exs, sh, dumb1);
        transEx(curves, geos, exs, sh, dumb2);
        // center(curves, exs);
        renderer.render(scene, camera);
        // render();
        requestAnimationFrame(initialRender);
    }
}

function monitorControls(){
    controls.update();
}

function render() {
    light.position.copy( camera.position );
    // renderer.render(scene, camera);
    // console.log(camera.position);
    // console.log(exs[1].position.sub(camera.position));
};
