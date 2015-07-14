$(window).load(function(){
    init();
    initialRender();
// setTimeout(function(){}, 900);
    // center(curves, exs);
    // renderer.render(scene, camera);

    var framer = $("#framer");
    framer.mouseenter(function (){
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
        var settings = $("#settings");
        var main = $("#main");

        // var size = (mwidth*0.5 > mheight) ? mwidth : mheight;
        //This doesn't do what i want. maybe mwidth - settings.wi
        // console.log(size);
        renderer.setSize( $("#container").width(), $("#container").height() );
        settings.width(main.width() - framer.width() - 90);
        framer.width(mheight);
        framer.height(mheight);
    }
    window.onresize();
});
