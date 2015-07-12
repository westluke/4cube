POINTS = [[0, 0, 0, 0],
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

// CUBE DISPLAY MUST SCALE. COULD SCALE BY MIN(WIDTH, HEIGHT), ACCOUNTING FOR MARGINS, I FEEL LIKE NO SCROLLING COULD BE GOOD.
// OR MAYBE THEY SHOULD SCROLL TO THE SETTINGS? IT COULD BE AN OPTION?


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


function transformPoints_DEPRECATED(points, transform){
    // Apply transform to every point in points

    var ret_points = [];
    for (var x = 0; x < points.length; x++){
        ret_points.push(math.multiply(transform, points[x]));
    }
    return ret_points;
}

function transEx(curves, geos, shape, transform){
    // console.log(tubes[0].vertices);
    // line 31 is normally a point in 3d space. after a 4d rotation, it becomes a line with a change in x in 3d space.
    // However, THREE is just taking the average of the terminal x values and putting the circle there.
    // Maybe if a geometry has already been initalized as a point, it doesn't want to do anythuing more?

   // var newc = new THREE.SplineCurve3([new THREE.Vector4(0.169, 1, 0, -0.985), new THREE.Vector4(-0.815, 1.55, 1, 0)]);

    for (var k = 0; k < curves.length; k++){
        for (var i = 0; i < curves[0].points.length; i++){
            curves[k].needsUpdate = true;
            curves[k].points[i].applyMatrix4(transform);
            // transform.applyToVector4Array([]);
            curves[k].needsUpdate = true;
        }

        var geo = new THREE.ExtrudeGeometry(shape, {steps:1, extrudePath: curves[k]});
        geos[k].verticesNeedUpdate = true;
        geos[k].vertices = geo.vertices.slice(0);
        geos[k].verticesNeedUpdate = true;
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

// function toVec(points){
//     var ret3 = [];
//     var ret4 = [];
//
//     for (var x = 0; x < points.length; x++){
//         ret4.push( new THREE.Vector4 (points[x][0], points[x][1], points[x][2], points[x][3]));
//         ret3.push( new THREE.Vector3 (points[x][0], points[x][1], points[x][2]));
//     }
//     return [ret3, ret4];
// }
//
// // console.log(toVec(POINTS));



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
                p_a = points[a];
                p_b = points[b];
                ret_line.push([new THREE.Vector4(p_a[0], p_a[1], p_a[2], p_a[3]), new THREE.Vector4(p_b[0], p_b[1], p_b[2], p_b[3])])
            }
        }
    }
    return ret_line;
}

function plot(lines, scene){
                // lines = [lines[0], lines[7], lines[13], lines[15], lines[21], lines[24], lines[25], lines[31]]
                // lines = [lines[0], lines[7], lines[22]]
    // lines = [];
    // mat = new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: false} );

    mat = new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: false, skinning: true, wrapAround: true} );
    // var geo, line_curve, ex;
    var tubes = [];
    var ot = [];
    var exs = [];

    var radius = 0.04, segments = 4;
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    var shape_pts = circleGeometry.vertices.slice(1, 5);
    var shape = new THREE.Shape(shape_pts);

    var extrudeSettings = {
        steps			: 1,
        bevelEnabled	: false,
        extrudePath		: line_curve
    };

    for (var a = 0; a < lines.length; a++){
        var line_curve = new THREE.SplineCurve3(lines[a]);
        // console.log(line_curve);
        var geo = new THREE.ExtrudeGeometry(new THREE.Shape((new THREE.CircleGeometry(radius, segments)).vertices.slice(1, 33)), {steps: 1, extrudePath: line_curve});
        // console.log(geo);
        var ex = new THREE.Mesh(geo, new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: false, shading: THREE.FlatShading} ));
        ex.frustumCulled = false;
        // console.log(ex);

        tubes.push(line_curve);
        ot.push(geo);
        scene.add(ex);

        exs.push(ex);
    }
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
    // for (var x = 0; x < exs.length; x++){
    //     exs[x].position.x -= 1;
    //     exs[x].position.y -= 1;
    //     exs[x].position.z -= 1;
    // }
}
