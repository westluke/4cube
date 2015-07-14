$(window).load(function(){
    init();
    initialRender();

    var framer = $("#framer");
    var settings = $("#settings");
    var main = $("#main");

    framer.mouseenter(function (){
        // var variables;
        // for (var name in window)
        //     variables += name + "\n";
        //NO MEMORY LEAKS! FUCK YEAHHHHHHHH
        console.log(variables);
        loopFlag = true;
        animate();
    });

    framer.mouseleave(function () {
            loopFlag = false;
    });

    window.onresize = function() {
        console.log("resize");
        var mwidth = $("#main").width();
        var mheight = $("#main").height();

        var size = (mwidth*0.5 < mheight) ? mwidth*0.5 : mheight;
        //This doesn't do what i want. maybe mwidth - settings.wi
        // console.log(size);
        framer.width(size);
        framer.height(size);
        settings.width(mwidth - framer.width() - 60);
        renderer.setSize( $("#container").width(), $("#container").height() );
    }
    window.onresize();
    // window.onresize();
});

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
