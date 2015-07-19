POINTS =
[[0, 0, 0, 0],
[0, 0, 0, 1],
[0, 0, 1, 1],
[0, 0, 1, 0],
[0, 1, 1, 0],
[0, 1, 0, 0],
[0, 1, 0, 1],
[0, 1, 1, 1],
[1, 1, 1, 1],
[1, 0, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 0],
[1, 0, 1, 0],
[1, 1, 1, 0],
[1, 1, 0, 0],
[1, 1, 0, 1]];


function getRotationMatrix_4d(axes, theta){
    // builds a rotation matrix for the rotate.._4d functions.
    var m = new THREE.Matrix4();
    m.elements[axes[0]*4 + axes[0]] = Math.cos(theta);
    m.elements[axes[1]*4 + axes[1]] = Math.cos(theta);
    m.elements[axes[0]*4 + axes[1]] = -Math.sin(theta);
    m.elements[axes[1]*4 + axes[0]] = Math.sin(theta);
    return m;
}


// Rotation functions that produce transformation matrices
function rotateXY_4d(theta){
    return getRotationMatrix_4d([0, 1], theta);
}
function rotateYZ_4d(theta){
    return getRotationMatrix_4d([1, 2], theta);
}
function rotateZX_4d(theta){
    return getRotationMatrix_4d([2, 0], theta);
}
function rotateXW_4d(theta){
    return getRotationMatrix_4d([0, 3], theta);
}
function rotateWY_4d(theta){
    return getRotationMatrix_4d([3, 1], theta);
}
function rotateWZ_4d(theta){
    return getRotationMatrix_4d([3, 2], theta);
}
function testRotations(theta){
    for (func in [rotateXY_4d, rotateYZ_4d, rotateZX_4d, rotateXW_4d, rotateWY_4d, rotateWZ_4d]){
        console.log(rotateXY_4d(theta))
    }
}


function transEx(curves, geos, exs, shape, transform){
    // I might be able to speed this up by just initializing the extrusions to something other than a point, and then taking them back.

    for (var k = 0; k < curves.length; k++){
        for (var i = 0; i < curves[0].points.length; i++){
            curves[k].needsUpdate = true;
            curves[k].points[i].applyMatrix4(transform);
        }

        var geo = new THREE.ExtrudeGeometry(shape, {steps:1, extrudePath: curves[k]});
        exs[k].geometry.dispose();
        exs[k].geometry = geo.clone();
        geo.dispose();
    }
}


function makeHypercube(){
    // generate the points of a 4d hypercube

    var ret_list = [];
    for (var x = 0; x < 2; x++){
        for (var y = 0; y < 2; y++){
            for (var z = 0; z < 2; z++){
                for (var w = 0; w < 2; w++){
                    ret_list.push([x, y, z, w]);
                }
            }
        }
    }
    return ret_list;
}


function genConns(points){
    // Given the points from the hypercube, generate a 2d array detailing connections between points.
    // If points[a] connects to points[b], conns[a][b] == 1, else 0
    // Generates by finding points one apart

    var conns = [];
    for (var x = 0; x < 16; x++){
        conns.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    var diff = 0;
    var p_a, p_b;

    for (var a = 0; a < points.length; a += 1){
        for (var b = 0; b < points.length; b += 1){

            if (b > a){  //Don't check if its been done in the reverse order already.
                p_b = points[b];
                p_a = points[a];
                diff = 0;

                for (var i = 0; i < 4; i += 1){
                    if (Math.abs(p_a[i] - p_b[i]) > 0.1) {  //If there is a difference in that axis
                        diff += 1;
                    }
                }
                if (diff < 2) {
                    conns[a][b] = 1;
                }
            }
        }
    }
    return conns
}



function getLines(points, conns){
    // Converts a collections of points and a matrix of connections into a set of THREE.js vectors

    var p_a, p_b, ret_line = [];

    for (var a = 0; a < points.length; a++){
        for (var b = 0; b < points.length; b++){
            if (conns[a][b] > 0.1){
                p_a = points[a].slice(0);
                p_b = points[b].slice(0);
                ret_line.push([new THREE.Vector4(p_a[0], p_a[1], p_a[2], p_a[3]), new THREE.Vector4(p_b[0], p_b[1], p_b[2], p_b[3])])
            }
        }
    }
    return ret_line;
}

function plot(lines, scene, options){
    // console.log(lines, scene, options);
    // given a bunch of lines and a scene, this function will add a bunch of extrusions from the lines to the scene.

    mat =  new THREE.MeshLambertMaterial({color: options["color"], wireframe: options["wireframe"]});
    var tubes = [];
    var ot = [];
    var exs = [];

    var radius = options["radius"], segments = options["vertices"];
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    var shape_pts = circleGeometry.vertices.slice(1, segments + 1);
    var shape = new THREE.Shape(shape_pts);

    var extrudeSettings = {
        steps			: 1,
        bevelEnabled	: false,
        extrudePath		: line_curve
    };


    for (var a = 0; a < lines.length; a++){
        var line_curve = new THREE.SplineCurve3(lines[a]);
        var geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        //dont want to reference the mat directly
        var ex = new THREE.Mesh(geo, mat.clone());
        ex.frustumCulled = false; //without this, the camera destroys extrusions unpredictably. super annoying
        tubes.push(line_curve);
        ot.push(geo);
        scene.add(ex);
        exs.push(ex);
    }
    mat.dispose();
    circleGeometry.dispose();
    lines = null;

    return [tubes, ot, shape, exs];
}

function center(curves, exs){
    // // Averages the extremes of the coordinates of the mesh to find the center, then corrects the mesh's position /
    //     // To place the center at the origin.

    var extr_x = [0, 0],
        extr_y = [0, 0],
        extr_z = [0, 0];

    var extremes = [extr_x, extr_y, extr_z];
    var vec = new THREE.Vector4();
    var coords;
    var pos = new THREE.Vector3();

    for (var i = 0; i < curves.length; i++){
        for (var k = 0; k < curves[0].points.length; k++){
            vec.copy(curves[i].points[k]);
            pos.copy(exs[i].position);

            coords = [pos.x + vec.x, pos.y + vec.y, pos.z + vec.z];
            for (var n = 0; n < 3; n++){
                if (coords[n] < extremes[n][0]){
                    extremes[n][0] = 0 + coords[n];
                }
                if (coords[n] > extremes[n][1]){
                    extremes[n][1] = 0 +coords[n];
                }
            }
        }
    }

    for (var x = 0; x < exs.length; x++){
        exs[x].position.x -= (extr_x[0] + extr_x[1])/2;
        exs[x].position.y -= (extr_y[0] + extr_y[1])/2;
        exs[x].position.z -= (extr_z[0] + extr_z[1])/2;
    }

    pos = null;
    vec = null;
    coords = null;
    extremes = null;
    extr_y = null, extr_x = null, extr_z = null;
}


var loopFlag = false;   //animate only runs when this is true, initialRender only when false
var scene, camera;
var animate, initialRender, rotateFigure, newRotation, reset, newExs, addPoint, baseResize, changeOptions;
var nojump = false;         //prevents firefox from being an asshole and double triggering oninput
var stored = "";    //points stored in div of points section
var options;        //parameters to plot
var renderer, current = false; //current is to keep track of which nav item was clicked last.
var rotations = [0, 0, 0, 0, 0, 0], ani_rotations = ['0', '0', '0', '1', '1', '1'];
var rotfuncs = [rotateXY_4d, rotateYZ_4d, rotateZX_4d, rotateXW_4d, rotateWY_4d, rotateWZ_4d]
var NEW_LINES = [];
// Remember: you can only add lines to NEW_LINES, the only way to remove them is to reset.

// TO SPEED UP: THE REASON THE POINTS WEREN'T SHADING WAS (I THINK) BECAUSE THEY WERE INTIALIZED AS POINTS.
// MY CURRENT SOLUTION OF UPDATING THE ENTIRE GEOMETRY WITH EACH ROTATION WORKS, BUT IT MIGHT BE OVERKILL.
// IF I CAN TAKE AN ORDER(N) INCREASE IN THE INITIALIZATION, I MIGHT SPEED UP THE ROTATIONS A LOT.
// I CAN TRY INITIALIZING EACH EXTRUSION TO SOME DEFAULT LINE, THEN UPDATING THEM TO POINTS, THEN UPDATING ONLY THE VERTICES OF THE GEOMETRIES.


// QUESTION: WHY DONT THE VARIABLES IN INIT GET TRASHED? OBVIOUSLY ANIMATE AND INIT CAN KEEP USING THEM. WHY?
// PROBABLY BECAUSE THE FUNCTIONS THAT USE THEM ARE GLOBAL, EVEN IF THEY AREN'T


function init(){
    options = {color: 0xff4900, wireframe: false, radius: 0.04, vertices: 8};
    var controls;
    var geos, line, exs, curves, sh;
    var line;
    var light;
    var dumb1 = rotateXW_4d(0.001);
    var dumb2 = rotateXW_4d(-0.001);


    var xw = rotateXW_4d(0.001);
    var wy = rotateWY_4d(0.001);
    var wz = rotateWZ_4d(0.001);

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

    // var ax = new THREE.AxisHelper(5);
    // scene.add(ax);

	light = new THREE.PointLight( 0xffffff);
	light.position.copy( camera.position );
	scene.add( light );

    line = getLines(POINTS, genConns(POINTS));
    var ret_list = plot(line, scene, options);

    // I have the fear of referencing
    curves = ret_list[0].slice(0);
    geos = ret_list[1].slice(0);
    exs = ret_list[3].slice(0);
    sh = ret_list[2];

    controls.addEventListener( 'change', render);
    center(curves, exs);

    rotateFigure = function(theta, f){
        // for the manual control. rotates by theta given rotation function f
        transEx(curves, geos, exs, sh, f(theta));
        // console.log(theta);
        center(curves, exs);
        renderer.render(scene, camera);
        center(curves, exs);
        // loopFlag = false;
        // initialRender();
    }

    animate = function(){
        // constantly applies the current rotation matrix
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

    function render() {
        // just for camera movement
        light.position.copy( camera.position );
    }

    newRotation = function(transforms){
        // change combo so that animate will rotate in a new direction
        combo.identity();
        for (var ind = 0; ind < transforms.length; ind++){
            combo = combo.multiply(transforms[ind]);
        }
    }

    newExs = function(newlines) {
        // NOTE: don't forget that when you do transex, youre actually applying the transformation
        //  to the vectors within the splines, which are also within line.
        // nullifies the previous graphed objects and makes new ones based on newlines.
        var clonedlines = [];
        for (var ind = 0; ind < newlines.length; ind++){
            clonedlines.push([newlines[ind][0].clone(), newlines[ind][1].clone()]);
        }

        loopFlag= false;
        setTimeout(function(){},500)

        for (var x = 0; x < curves.length; x++){
            scene.remove(exs[x]);
            curves[x] = null;
            exs[x] = null;
            geos[x].dispose();
        }

        curves = null;
        exs = null;
        geos = null;
        curves = [1, 2, 3];

        var ret = plot(clonedlines.slice(0), scene, options);
        curves = ret[0].slice(0);
        geos = ret[1].slice(0);
        sh = ret[2];
        exs = ret[3].slice(0);

        renderer.render(scene, camera);
        center(curves, exs);
        renderer.render(scene, camera);
        initialRender()
    }

    reset = function(){
        // resets animation values, rotation values, graphed objects, stored points, and camera position

        rotations = [0, 0, 0, 0, 0, 0];
        ani_rotations = [0, 0, 0, 0, 0, 0];
        options = {color: 0xff4900, wireframe: false, radius: 0.04, vertices: 8};
        newRotation([]);
        $(current).click();
        NEW_LINES = [];
        stored = '';
        $('#stored_points').html('');

        controls.reset();
        light.position.copy(camera.position);
        newExs(getLines(POINTS, genConns(POINTS)));
    }

    changeOptions = function(color, wireframe, width, vertices){
        if (!isNaN(color) && !isNaN(width) && !isNaN(vertices) && color && width && vertices){

            options.color = parseInt(color);
            options.wireframe = wireframe;
            options.radius = width * 1;
            options.vertices = vertices * 1;
            // console.log(options);

            if ((options.radius > 0) && (options.vertices > 2)){

                if (NEW_LINES.length){
                    newExs(NEW_LINES);
                    return
                }

                newExs(getLines(POINTS, genConns(POINTS)));
            }
        }
    }
}














// IF I EMBED THIS IN THE HTML, GOOGLE CAN ACTUALLY READ IT.
$(window).load(function(){
    init();
    initialRender();

    var unfinished = [];
    var framer = $("#framer");
    var settings = $("#settings");
    var main = $("#main");
    var container = $("#container");

    // Only animate if the mouse is in the canvas. Keeps everything running smoothly
    framer.mouseenter(function (){
        loopFlag = true;
        animate();
    });
    framer.mouseleave(function () {
            loopFlag = false;
    });

    // I don't want to have to redefine the entirety of this function in full.html
    baseResize = function() {
        // be careful to make everything scale in the right order
        // console.log("resize");
        var mwidth = main.width();
        var mheight = main.height();
        // usually the height is fairly low, so the framer should scale off of that.
        // Other times, the width is the limiting factor, with settings in the way.
        var size = (mwidth*0.5 < mheight) ? mwidth*0.5 : mheight;
        framer.width(size);
        framer.height(size);
        settings.width(mwidth - framer.width() - 60);

        var cwidth = container.width(), cheight = container.height();
        renderer.setSize( cwidth, cheight);

        // console.log(mheight);
    }
    window.onresize = baseResize;
    window.onresize();

    $("#menu li p").click(function(){
        var doneflag = false;
        var name = this.innerHTML.toLowerCase().split(" ")[0];  //Get the name of the file to load based on the button clicked
        if (current){ current.nextAll().css({top: "10px", backgroundColor: "transparent"}); }   //Disable the visual guide on the last item clicked
        $(this).nextAll().css({top: "3px", backgroundColor: "#FF4900"});                        // Enable it on this item
        current = $(this);

        settings.css({opacity: 0});     // Fade out the current settings div

        // console.log("transitionbegin");
        settings.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(){
            // console.log("transitionend");
            doneflag = true;
            //Wait for that transition to finish
            //now load the right module while its still transparent, restore opacity, and unbind this to prevent a loop
            if ((unfinished.indexOf(name) + 1)){
                name = "soon";
            }
            settings.load("modules/" + name + ".html", function(){
                settings.css({opacity: 1});
                settings.unbind('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
            });
        });
    });

    // settings.load("modules/manual.html");
    $("#menu li:nth-child(6) div").css({top: "3px", backgroundColor: "#FF4900"});
    current = $("#menu li:nth-child(6) p");
});


















function usrRotate(value, ind){
    // console.log("usrRotate", value);
    // console.log("executed");
    // $(".bar").mouseup(function(){
    //     console.log("mouseup", value);
    //     // Reset the slider back to 0 (rotations aren't commutative)
    //     $(".bar").val(0);
    //     // $(".bar").prop("value", 0);
    //     console.log("val", $(".bar").val(), $(".bar").prop("value"));
    //     rotations[ind] = 0;
    // });
    // if (nojump){
    //     nojump = false;
    //     $(".bar").val(0);
    //     return;
    // }
    rotateFigure(value, rotfuncs[ind - 1]);
    // rotations[ind] = value;
    // center(curves[exs]);
}

function updateAni(value, ind){
    // keep the value, not the matrix, so that I can keep the animations page consistent when they come back.
    ind--;
    ani_rotations[ind] = value;
    var rots = [];
    for (var x = 0; x < 6; x++){
        rots.push(rotfuncs[x](ani_rotations[x] * 0.001))
    }
    newRotation(rots);
}

function addPoint(value1, value2){
    // add a point to the internal variable and the div display

    var coords1 = value1.replace(/ /g,',').split(",").filter(function(a){return a});
    var coords2 = value2.replace(/ /g, ',').split(",").filter(function(a){return a});
    if ((coords1.length != 4) || (coords2.length != 4)){ return;}

    for (var i = 0; i < 2; i++){
        var coords = [coords1, coords2][i];

        for (ind in coords){
            coords[ind]*=1;
            if (isNaN(coords[ind])){
                return;
            }
        }
    }

    NEW_LINES.push([new THREE.Vector4(coords1[0], coords1[1], coords1[2], coords1[3]), new THREE.Vector4(coords2[0], coords2[1], coords2[2], coords2[3])]);
    // console.log(NEW_LINES);


    stored += "<div><button>Remove</button><p>" + coords1 + " --> " + coords2 + "</p></div>";
    $("#stored_points").html(stored);
    // console.log($("stored_points").html());

    $("#stored_points div button").click(function() {
        console.log("what?");
        console.log($(this).parent().index());
        var ind = $(this).parent().index();
        // console.log
        NEW_LINES = NEW_LINES.slice(0, ind).concat(NEW_LINES.slice(ind + 1));
        // console.log(NEW_LINES);
        // var first =
        // console.log("whatt?");
        $(this).parent().remove();
        stored = $("#stored_points").html();
        console.log($("#stored_points").html());
    });

}
