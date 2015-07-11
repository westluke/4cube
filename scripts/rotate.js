function getRotationMatrix_4d(axes, theta){
    // builds a rotation matrix for the rotate.._4d functions.
    var ret_list = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    ret_list[axes[0]][axes[0]] = math.cos(theta);
    ret_list[axes[1]][axes[1]] = math.cos(theta);
    ret_list[axes[0]][axes[1]] = -math.sin(theta);
    ret_list[axes[1]][axes[0]] = math.sin(theta);

    return math.matrix(ret_list);
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


function transformPoints(points, transform){
    // Apply transform to every point in points

    var ret_points = [];
    for (var x = 0; x < points.length; x++){
        ret_points.push(math.multiply(transform, points[x]));
    }
    return ret_points;
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

function toVec(points){
    var ret3 = [];
    var ret4 = [];

    for (var x = 0; x < points.length; x++){
        ret4.push( new THREE.Vector4 (points[x][0], points[x][1], points[x][2], points[x][3]));
        ret3.push( new THREE.Vector3 (points[x][0], points[x][1], points[x][2]));
    }
    return [ret3, ret4];
}

console.log(toVec(POINTS));



// function genConns(points){
//     // Given the points from the hypercube, generate a 2d array detailing connections between points.
//     // If points[a] connects to points[b], conns[a][b] == 1, else 0
//     // Generates by finding points one apart
//
//     var conns = [];
//     for (var x = 0; x < 16; x++){
//         conns.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//     }
//     var diff = 0;
//     var p_a, p_b;
//
//     for (var a = 0; a < points.length; a += 1){
//         for (var b = 0; b < points.length; b += 1){
//
//             if (b > a){  //Don't check if its been done in the reverse order already.
//                 p_b = points[b];
//                 p_a = points[a];
//                 diff = 0;
//
//                 for (var i = 0; i < 4; i += 1){
//                     if (math.abs(p_a[i] - p_b[i]) > 0.1) {  //If there is a difference in that axis
//                         diff += 1;
//                     }
//                 }
//                 if (diff < 2) {
//                     conns[a][b] = 1;
//                 }
//             }
//         }
//     }
//     return conns
// }
//
//
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
//
// function get_lines(points, conns, found = []){
//
// }
//
// console.log(new THREE.Vector4(1, 4, 2, 4).x);
// // console.log()
//
function plot(lines, scene){
    // Given a collection of vectors in lines and a three.js scene, this function plots the vectors \
        // and returns the geometry and THREE.line produced.

    var ex, mat = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
    var pts = [];
    var geo;
    var line_curve;
    var shape_pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.25, 0), new THREE.Vector2(0.125, 0.22)]
    var shape = new THREE.Shape( shape_pts );

    var extrudeSettings = {
        steps			: 100,
        bevelEnabled	: false,
        extrudePath		: NONE,
    };
    // var geometry = new THREE.Geometry();
    // geometry.verticesNeedUpdate = true;

    for (var a = 0; a < lines.length; a++){
        line_curve = new THREE.LineCurve3(lines[a]);
        extrudeSettings.extrudePath = line_curve;
        geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        ex = new THREE.Mesh(geo, mat);
        scene.add(ex);
    }
    // add_line = new THREE.Line(geometry, mat, THREE.LinePieces);
    // add_line.color = 0x333333;
    // console.log(mat);
    // console.log(add_line.position.x, add_line.position.y, add_line.position.z)
    // scene.add(add_line);
    // return [geometry, add_line];
}

function center(geometry, mesh){
    // Averages the extremes of the coordinates of the mesh to find the center, then corrects the mesh's position /
        // To place the center at the origin.

    var extr_x = [0, 0],
        extr_y = [0, 0],
        extr_z = [0, 0];

    var extremes = [extr_x, extr_y, extr_z];
    var vec, coords;

    for (var i = 0; i < geometry.vertices.length; i++){
        vec = geometry.vertices[i];
        // console.log(vec);
        coords = [mesh.position.x + vec.x, mesh.position.y + vec.y, mesh.position.z + vec.z];
        for (var n = 0; n < 3; n++){
            if (coords[n] < extremes[n][0]){
                extremes[n][0] = coords[n];
            }
            if (coords[n] > extremes[n][1]){
                extremes[n][1] = coords[n];
            }
        }
    }
    mesh.position.x -= (extr_x[0] + extr_x[1])/2;
    mesh.position.y -= (extr_y[0] + extr_y[1])/2;
    mesh.position.z -= (extr_z[0] + extr_z[1])/2;
}


//@NOTE WHOAH BIG CHANGES THREE.JS HAS 4D VECTORS
//@NOTE new plan: i transform the vectors of the geometries directly whenever a change is made, They need to have the/
// updateable toggle toggled.
// @NOTE to simplify it into one geometry, i could use a recursive function to keep connecting points

function getProjOfVectorSpace(A){
    // now unnecessary, probably, as THREE.js includes vectors
    return math.multiply(math.multiply(A, math.inv(math.multiply(math.transpose(A), A))), math.transpose(A));
}
