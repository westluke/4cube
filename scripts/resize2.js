$(window).load(function(){
    init();
    initialRender();

    var current = false;    // keeps track of which nav item was clicked last
    var unfinished = ["full", "points", "options"];
    var framer = $("#framer");
    var settings = $("#settings");
    var main = $("#main");
    var container = $("#container");

    // Only animate if the mouse is in the canvas. Keeps everything running smoothly
    framer.mouseenter(function (){
        loopFlag = true;
        animate();
    });
    framer.mouseleave(function () {
            loopFlag = false;
    });

    window.onresize = function() {
        // be careful to make everything scale in the right order
        // console.log("resize");
        var mwidth = main.width();
        var mheight = main.height();
        // usually the height is fairly low, so the framer should scale off of that.
        // Other times, the width is the limiting factor, with settings in the way.
        var size = (mwidth*0.5 < mheight) ? mwidth*0.5 : mheight;

        framer.width(size);
        framer.height(size);
        settings.width(mwidth - framer.width() - 60);

        var cwidth = container.width(), cheight = container.height();
        renderer.setSize( cwidth, cheight);
    }
    window.onresize();

    $("#menu li p").click(function(){
        var doneflag = false;
        var name = this.innerHTML.toLowerCase().split(" ")[0];  //Get the name of the file to load based on the button clicked
        if (current){ current.nextAll().css({top: "10px", backgroundColor: "transparent"}); }   //Disable the visual guide on the last item clicked
        $(this).nextAll().css({top: "3px", backgroundColor: "#FF4900"});                        // Enable it on this item
        current = $(this);

        settings.css({opacity: 0});     // Fade out the current settings div
        console.log(name);
        // 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd'

        // you might be wondering, dear reader, why I need two nearly identical sections of ugly code.
        // thats because transitionend is an asshole and safari is a piece of shit

        settings.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(){
            doneflag = true;
            console.log('fuck');
            //Wait for that transition to finish
            //now load the right module while its still transparent, restore opacity, and unbind this to prevent a loop
            if ((unfinished.indexOf(name) + 1)){
                name = "soon";
            }
            settings.load("modules/" + name + ".html", function(){
                settings.css({opacity: 1});
                settings.unbind('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
            });
        });

        if (!doneflag){
            $(window).off('focus').on('focus', function () {
                console.log('fuck');
                //Wait for that transition to finish
                //now load the right module while its still transparent, restore opacity, and unbind this to prevent a loop
                if ((unfinished.indexOf(name) + 1)){
                    name = "soon";
                }
                settings.load("modules/" + name + ".html", function(){
                    settings.css({opacity: 1});
                    settings.unbind('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
                });
            });
        }
    });

    $("#menu li:nth-child(3) p").click();
});

function usrRotate(value, ind){
    $(".bar").mouseup(function(){
        // Reset the slider back to 0 (rotations aren't commutative)
        $(".bar").val(0);
        rotations[ind] = 0;
    });

    ind--;
    rotval = value - rotations[ind];
    rotateFigure(rotval, rotfuncs[ind]);
    rotations[ind] = value;
}

function updateAni(value, ind){
    // keep the value, not the matrix, so that I can keep the animations page consistent when they come back.
    ind--;
    ani_rotations[ind] = value;
    var rots = [];
    for (var x = 0; x < 6; x++){
        rots.push(rotfuncs[x](ani_rotations[x] * 0.001))
    }
    newRotation(rots);
}
