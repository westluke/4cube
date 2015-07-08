document.body.onload=function(){

    var x = document.getElementById("gltest");
    var xj = $("#gltest");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, 1, 0.001, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    x.appendChild( renderer.domElement );
    //
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var cube_bad = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(0xff0000));
    var cube = new THREE.BoxHelper(cube_bad);
    cube.material.color.set(0xff0000)
    scene.add( cube );
    //

    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.z = 5;

    controls = new THREE.OrbitControls( camera );
    //        controls.damping = 0.2;
    controls.addEventListener( 'change', render );

    // camera.position.z = 15;
    // camera.position.x = 4;
    // camera.position.y = 15;


    // var material1 = new THREE.LineBasicMaterial({
	//     color: 0x0080ff
    // });
    //
    // var geometry1 = new THREE.Geometry();
    // geometry1.vertices.push(
    // 	new THREE.Vector3( -10, 0, 0 ),
    // 	new THREE.Vector3( 0, 10, 0 ),
    // 	new THREE.Vector3( 10, 0, 0 )
    // );
    //
    // var line = new THREE.Line( geometry1, material1 );
    // scene.add( line );

    function render() {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
    	requestAnimationFrame( render );
    	renderer.render( scene, camera );
    }
    render();
};
