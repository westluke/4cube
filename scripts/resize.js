// $(window).load(function(){

setTimeout(function(){}, 900);

var framer = $("#framer");
    framer.mouseenter(function (){
        loopFlag = true;
        animate();
    });

    framer.mouseleave(function () {
            loopFlag = false;
    });

    window.onresize = function() {
        var mwidth = $("#main").width();
        var mheight = $("#main").height();
        var settings = $("#settings");
        var main = $("#main");

        var size = mwidth*0.2 > mheight ? mwidth : mheight;
        console.log(size);
        renderer.setSize( $("#container").width(), $("#container").height() );
        settings.width(main.width() - framer.width() - 90);
        framer.width(size);
        framer.height(size);
    }
    window.onresize();
// });


var rotations = [0, 0, 0, 0, 0, 0];
var rotfuncs = [rotateXY_4d, rotateYZ_4d, rotateZX_4d, rotateXW_4d, rotateWY_4d, rotateWZ_4d]

function usrRotate(value, ind){
    $(".bar").mouseup(function(){
        $(".bar").val(0);
    });

    ind--;
    transEx(curves, geos, exs, sh, rotfuncs[ind](value - rotations[ind]));
    rotations[ind] = value;
    center(curves, exs);
    renderer.render(scene, camera);
}
