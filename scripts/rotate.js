var matrix = math.matrix([[7, 1], [-2, 3]]);  // Matrix

function getRotationMatrix_4d(axes, theta){
    ret_matrix = math.matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);

    ret_matrix[axes[0], axes[0]] = math.cos(theta);
    ret_matrix[axes[1], axes[1]] = math.cos(theta);

    ret_matrix[axes[0], axes[1]] = -math.sin(theta);
    ret_matrix[axes[1], axes[0]] = math.cos(theta);
}


// def rotateXY_4d(theta):
//     return getRotationMatrix_4d((0, 1), theta)
//
// def rotateYZ_4d(theta):
//     return getRotationMatrix_4d((1, 2), theta)
//
// def rotateZX_4d(theta):
//     return getRotationMatrix_4d((2, 0), theta)
//
// def rotateXW_4d(theta):
//     return getRotationMatrix_4d((0, 3), theta)
//
// def rotateWY_4d(theta):
//     return getRotationMatrix_4d((3, 1), theta)
//
// def rotateWZ_4d(theta):
//     return getRotationMatrix_4d((3, 2), theta)
//
// def getRotationMatrix_4d(axes, theta):
//     ret_matrix = np.matrix("1.0 0.0 0.0 0.0; 0.0 1.0 0.0 0.0; 0.0 0.0 1.0 0.0; 0.0 0.0 0.0 1.0")
//
//     ret_matrix[axes[0], axes[0]] = math.cos(theta)
//     ret_matrix[axes[1], axes[1]] = math.cos(theta)
//
//     ret_matrix[axes[0], axes[1]] = -math.sin(theta)
//     ret_matrix[axes[1], axes[0]] = math.sin(theta)
//
//     return ret_matrix
//
// def transformPoints(points, transform):
//     ret_points = []
//
//     for point in points:
//         ret_points.append(transform * point)
//
//     return ret_points
//
//
//
//
// #@NOTE[x] okay you need to test the adjacent points with a test group. You have too many edges in the final graph, 8 too many. \
// #@NOTE ALSO you need to test convertToLine to make sure it has the right lines, and the right number of them. MAKE TEST CASES
// #@NOTE ALSOOOO MAKE A SLIDERRRRR
//
//
//
//
//
// def convertToLine(points, conns):
//     #Will only make 3d coordinates. There's no way matplotlib will handle 4d.
//
//     assert len(points) == conns.shape[0]
// #    print conns
//
//     ret_line = []
//
// #    print points[8]
// #    print points[8][3]
// #    ##print points[8][0, 3]
// #    print points[8][3, 0]
// #    print points[8].item(3)
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
// def getProjOfVectorSpace(A):
//     return A * (A.transpose() * A).getI() * A.transpose()
