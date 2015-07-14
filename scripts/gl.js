var loopFlag = false;
var animate, initialRender, monitorControls, rotateFigure, newRotation;
var renderer;
var rotations = [0, 0, 0, 0, 0, 0], ani_rotations = [0, 0, 0, 0, 0, 0];
var rotfuncs = [rotateXY_4d, rotateYZ_4d, rotateZX_4d, rotateXW_4d, rotateWY_4d, rotateWZ_4d]


// TO SPEED UP: THE REASON THE POINTS WEREN'T SHADING WAS (I THINK) BECAUSE THEY WERE INTIALIZED AS POINTS.
// MY CURRENT SOLUTION OF UPDATING THE ENTIRE GEOMETRY WITH EACH ROTATION WORKS, BUT IT MIGHT BE OVERKILL.
// IF I CAN TAKE AN ORDER(N) INCREASE IN THE INITIALIZATION, I MIGHT SPEED UP THE ROTATIONS A LOT.
// I CAN TRY INITIALIZING EACH EXTRUSION TO SOME DEFAULT LINE, THEN UPDATING THEM TO POINTS, THEN UPDATING ONLY THE VERTICES OF THE GEOMETRIES.


// QUESTION: WHY DONT THE VARIABLES IN INIT GET TRASHED? OBVIOUSLY ANIMATE AND INIT CAN KEEP USING THEM. WHY?
// PROBABLY BECAUSE THE FUNCTIONS THAT USE THEM ARE GLOBAL, EVEN IF THEY AREN'T


function init(){
    var camera, controls, scene;
    var geos, line, tubes, curves, sh;
    var light;
    var dumb1 = rotateXW_4d(0.001);
    var dumb2 = rotateXW_4d(-0.001);


    var xw = rotateXW_4d(0.001);
    var wy = rotateWY_4d(0.001);
    var wz = rotateWZ_4d(0.001);
    var xy = rotateXY_4d(0);
    var yz = rotateYZ_4d(0);
    var zx = rotateZX_4d(0);

    var combo = xw.multiply(wy).multiply(wz);
    // always combo them. its so much faster



    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );

    document.getElementById( 'container' ).appendChild( renderer.domElement );

    // Very low near plane allows you to get right next to the extrusions without clipping
    camera = new THREE.PerspectiveCamera( 60, 1, 0.001, 8);
    camera.position.set( 0, 0, 2 );
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 1.5;
	controls.maxDistance = 6;
    controls.noZoom = false;

	light = new THREE.PointLight( 0xffffff);
	light.position.copy( camera.position );
	scene.add( light );

    var line = getLines(POINTS, genConns(POINTS));
    var ret_list = plot(line, scene);

    // I have the fear of referencing
    curves = ret_list[0].slice(0);
    geos = ret_list[1].slice(0);
    exs = ret_list[3].slice(0);
    sh = ret_list[2];

    controls.addEventListener( 'change', render);
    center(curves, exs);

    rotateFigure = function(theta, f){
        transEx(curves, geos, exs, sh, f(theta));
        center(curves, exs);
        renderer.render(scene, camera);
    }

    animate = function(){
        if (loopFlag){
            // When the mouse isn't in the canvas, this function deactivates.
            requestAnimationFrame(animate); }
        controls.update();
        transEx(curves, geos, exs, sh, combo);
        center(curves, exs);
        renderer.render(scene, camera);
    }

    initialRender = function(){
        // Webgl can be a piece of shit. If nothing is changing, it refuses to do an initial render.
        // I need this function to keep everything changing (but not really) until animate comes into play
        if (!loopFlag){
            setTimeout(function(){
                transEx(curves, geos, exs, sh, dumb1);
                transEx(curves, geos, exs, sh, dumb2);
                renderer.render(scene, camera);
                requestAnimationFrame(initialRender);
            }, 100)
        }
    }

    monitorControls = function(){
        controls.update();
    }

    function render() {
        light.position.copy( camera.position );
    }

    newRotation = function(transforms){
        console.log(transforms);
        combo.identity();
        console.log(combo);
        for (var ind = 0; ind < transforms.length; ind++){
            combo = combo.multiply(transforms[ind]);
        }

    }
}
