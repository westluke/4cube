window.onload = function(){

    var framer = $("#framer");
    framer.width(framer.height());

    renderer.setSize( $("#container").width(), $("#container").height());
    var settings = $("#settings");
    var main = $("#main");
    settings.width(main.width() - framer.width() - 90);

    framer.mouseenter(function (){
        loopFlag = true;
        animate();
    });

    framer.mouseleave(function () {
            loopFlag = false;
    });
    // console.log($(".bar").val());


// RENDERER STUFF FROM GL.JS, ORGANIZE BETTER




    window.onresize = function() {
        framer.width(framer.height());
        // console.log("resize");
        settings.width(main.width() - framer.width() - 20);
        renderer.setSize( $("#container").width(), $("#container").height() );
        settings.width(main.width() - framer.width() - 90);
    }
}

// function assignVal(domElement){
//     domElement.innerHTML = 'XY Plane Rotation: &nbsp&nbsp<span>'+value+'</span>';
// }
var rotations = [0, 0, 0, 0, 0, 0];

function usrRotate(value){
    console.log(value);
    transEx(curves, geos, exs, sh, rotateWZ_4d(rotations[0] - value));
    rotations[0] = value;
    renderer.render(scene, camera);
}
