var matrix = math.matrix([[7, 1], [-2, 3]]);
// console.log(math.multiply(matrix, [3, 2]))
// @NOTE: when you multiply two matrices of the wrong dimensions, the math library will \
// attempt to rotate the second into a column vector to match them. So be careful, it won't warn you.

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
                    if (math.abs(p_a[i] - p_b[i]) > 0.1) {  //If there is a difference in that axis
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


function convertToLine(points, conns){
    var ret_line = [];

    for (var a = 0; x < points.length; x++){
        for (var b = 0; x < points.length; y++){
            if (conns[a][b] > 0.1){
                // var new_l =
            }
        }
    }

}

console.log(genConns(makeHypercube()));
// genConns(makeHypercube());
// console.log(makeHypercube());


// def convertToLine(points, conns):
//     #Will only make 3d coordinates. There's no way matplotlib will handle 4d.
//
//     assert len(points) == conns.shape[0]
// #    print conns
//
//     ret_line = []
//
//     for i in range(len(points)):
//         for k in range(len(points)):
//             #print conns[i, k]
//             if conns[i, k] > 0.2:
//                 #If this is true, point k connects to point i (starts are along the top)
//                 #ret_line.append((points[k], points[i]))
//                 new_l = ((points[k][0, 0], points[i][0, 0]), (points[k][1, 0], points[i][1, 0]), (points[k][2, 0], points[i][2, 0]))
// #                if new_l not in ret_line:
//                 ret_line.append(new_l)
// #                else: print "what?"
//
//     return ret_line
//
function getProjOfVectorSpace(A){
    return math.multiply(math.multiply(A, math.inv(math.multiply(math.transpose(A), A))), math.transpose(A));
    // return math.multiply(       math.multiply(A, math.inv(math.multiply(math.transpose(A), A))),    math.transpose(A));

    // return math.multiply(A, math.inv(math.multiply(math.transpose(A), A)))
    // return math.transpose(A);

}

// console.log(getProjOfVectorSpace(math.matrix(   [[1.0, 3.0, 9.0],
//                                                  [1.0, 2.0, 4.0],
//                                                  [1.0, 5.0, 25.0],
//                                                  [1.0, 7.0, 49.0]])))

// return A * (A.transpose() * A).getI() * A.transpose()
