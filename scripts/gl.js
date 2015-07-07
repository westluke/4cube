document.body.onload=function(){

    var x = document.getElementById("gltest");
    var xj = $("#gltest");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    x.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function render() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    	requestAnimationFrame( render );
    	renderer.render( scene, camera );
    }
    render();
};
