var camera, controls, scene, renderer;
var geos, line, tubes, curves, sh;
var light;

var xw = rotateXW_4d(0.02);
var wy = rotateWY_4d(0.02);
var wz = rotateWZ_4d(0.02);
var combo = xw.multiply(wy).multiply(wz);
// always combo them. its so much faster

var loopFlag = false;

var dumb1 = rotateXW_4d(0.001);
var dumb2 = rotateXW_4d(-0.001);



// TO SPEED UP: THE REASON THE POINTS WEREN'T SHADING WAS (I THINK) BECAUSE THEY WERE INTIALIZED AS POINTS.
// MY CURRENT SOLUTION OF UPDATING THE ENTIRE GEOMETRY WITH EACH ROTATION WORKS, BUT IT MIGHT BE OVERKILL.
// IF I CAN TAKE AN ORDER(N) INCREASE IN THE INITIALIZATION, I MIGHT SPEED UP THE ROTATIONS A LOT.
// I CAN TRY INITIALIZING EACH EXTRUSION TO SOME DEFAULT LINE, THEN UPDATING THEM TO POINTS, THEN UPDATING ONLY THE VERTICES OF THE GEOMETRIES.
//
// PUT ALL YOUR JS FUNCTION CALL SHIT INTO A WINDOW.ONLOAD. THAT WAS ANNOYING TO FIX.
// ALL THE SHIT IS OUT OF ORDER. THIS FILE EXECUTES BEFORE THE DOCUMENT IS READY, AND THAT FUCKS UP RESIZE.JS BADLY
// DEFINITIONS N SHIT GO AT THE BEGINNING. THAT INCLUDES MOST OF THE SHIT IN THIS FILE AND ROTATE.JS, AND ALL THE LIBRARIES
// AFTER THOSE DECLARATIONS AND DEFINITIONS, WE DEFINE WINDOW.LOAD, WITH INIT AND ANIMATE AND ALL THAT SHIT






function init(){
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    // CHANGED

    document.getElementById( 'container' ).appendChild( renderer.domElement );

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
    // renderer.render(scene, camera);

}

function animate(){
    // setTimeout( function() {
        if (loopFlag){
            requestAnimationFrame(animate); }
    // }, 10);
    controls.update();
    transEx(curves, geos, exs, sh, combo);
    center(curves, exs);
    renderer.render(scene, camera);
}

function initialRender(){
    if (!loopFlag){
        setTimeout(function(){
            // console.log("InitRender");
            // controls.update();

            transEx(curves, geos, exs, sh, dumb1);
            transEx(curves, geos, exs, sh, dumb2);
            // center(curves, exs);
            renderer.render(scene, camera);
            // render();
            requestAnimationFrame(initialRender);
        }, 100)
    }
}

// function monitorControls(){
//     controls.update();
// }

function render() {
    // light.position.copy( camera.position );
    // renderer.render(scene, camera);
    // console.log(camera.position);
    // console.log(exs[1].position.sub(camera.position));
};
