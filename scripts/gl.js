var container;
var camera, controls, scene, renderer;
var geo, geos, line, tubes, curves, sh;
var light;

var xw = rotateXW_4d(0.02);
var wy = rotateWY_4d(0.02);
var wz = rotateWZ_4d(0.02);
var cnt = 0;
var composer;
// monitorControls();





// TO SPEED UP: THE REASON THE POINTS WEREN'T SHADING WAS (I THINK) BECAUSE THEY WERE INTIALIZED AS POINTS.
// MY CURRENT SOLUTION OF UPDATING THE ENTIRE GEOMETRY WITH EACH ROTATION WORKS, BUT IT MIGHT BE OVERKILL.
// IF I CAN TAKE AN ORDER(N) INCREASE IN THE INITIALIZATION, I MIGHT SPEED UP THE ROTATIONS A LOT.
// I CAN TRY INITIALIZING EACH EXTRUSION TO SOME DEFAULT LINE, THEN UPDATING THEM TO POINTS, THEN UPDATING ONLY THE VERTICES OF THE GEOMETRIES.
//
//





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
    camera = new THREE.PerspectiveCamera( 60, 1, 0.001, 8);
    camera.position.set( 0, 0, 2 );
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 1;
	controls.maxDistance = 6;
    controls.noZoom = false;

	light = new THREE.PointLight( 0xffffff);
	light.position.copy( camera.position );
	scene.add( light );



    // composer = new THREE.EffectComposer( renderer );
    // composer.addPass( new THREE.RenderPass( scene, camera ) );
    // // Then blur the whole buffer with two passes using the included blur shaders located in three.js/examples/shaders/
    //
    // var hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    // composer.addPass( hblur );
    //
    // var vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    // // set this shader pass to render to screen so we can see the effects
    // vblur.renderToScreen = true;
    // composer.addPass( vblur );





    var line = getLines(POINTS, genConns(POINTS));
    var ret_list = plot(line, scene);

    curves = ret_list[0].slice(0);
    geos = ret_list[1].slice(0);
    exs = ret_list[3].slice(0);
    sh = ret_list[2];
    // console.log(curves);
    // console.log(geos);
    // console.log(exs);

    // var ax = new THREE.AxisHelper(10);
    // scene.add(ax);

    controls.addEventListener( 'change', render);
    animate();
    // center(curves, exs);
    // renderer.render(scene, camera);
}

function animate(){
    setTimeout( function() {
        // cnt ++;
        if (cnt < 100 ){requestAnimationFrame( animate );}
        else{
            // console.log(exs);
            // monitorControls();
        }

    }, 25);
    controls.update();
    transEx(curves, geos, exs, sh, xw);
    transEx(curves, geos, exs, sh, wy);
    transEx(curves, geos, exs, sh, wz);
    // controls.update();
    renderer.render(scene, camera);
    // composer.render(scene, camera);
    center(curves, exs);
}

function monitorControls(){
    // requestAnimationFrame(monitorControls);
    // controls.update();
}

function render() {
    light.position.copy( camera.position );
    // renderer.render(scene, camera);
    // console.log(camera.position);
    // console.log(exs[1].position.sub(camera.position));
};
