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

function plot(lines, scene){
    // given a bunch of lines and a scene, this function will add a bunch of extrusions from the lines to the scene.

    mat =  new THREE.MeshLambertMaterial({color: 0xFF4900});
    var tubes = [];
    var ot = [];
    var exs = [];



// FUCKING TALK TO KEVIN OR NOAH ABOUT LEXHACK. ITS BEEN ONE WEEK, YOU SHOULD EMAIL SOMEONE. MAYBE THEY HAVE ALREADY, AND THEY'LL ONLY PUT IT UP WHEN THEY GET A REPLLLYYYY



    var radius = 0.03, segments = 9
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    var shape_pts = circleGeometry.vertices.slice(1, 10);
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
    // for (var x = 0; x < exs.length; x++){
    //     exs[x].position.x -= 1;
    //     exs[x].position.y -= 1;
    //     exs[x].position.z -= 1;
    // }
}
