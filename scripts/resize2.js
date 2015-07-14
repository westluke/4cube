$(window).load(function(){
    init();
    initialRender();

    // keeps track of which nav item was clicked last
    var current = false;

    var framer = $("#framer");
    var settings = $("#settings");
    var main = $("#main");

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
        console.log("resize");
        var mwidth = $("#main").width();
        var mheight = $("#main").height();

        // usually the height is fairly low, so the framer should scale off of that.
        // Other times, the width is the limiting factor, with settings in the way.
        var size = (mwidth*0.5 < mheight) ? mwidth*0.5 : mheight;
        framer.width(size);
        framer.height(size);
        settings.width(mwidth - framer.width() - 60);
        renderer.setSize( $("#container").width(), $("#container").height() );
    }
    window.onresize();

    $("#menu li p").click(function(){
        //Get the name of the file to load based on the button clicked
        var name = this.innerHTML.toLowerCase().split(" ")[0];

        //Disable the visual guide on the last item clicked
        if (current){ current.nextAll().css({top: "10px", backgroundColor: "transparent"}); }
        // Enable it on this item
        $(this).nextAll().css({top: "3px", backgroundColor: "#FF4900"});
        current = $(this);

        // Fade out the current settings div
        settings.css({opacity: 0});
        //Wait for that transition to finish
        settings.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
            //now load the right module while its still transparent, restore opacity, and unbind this to prevent a loop
            $(this).load("modules/" + name + ".html");
            $(this).css({opacity: 1});
            $(this).unbind('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
        });
    });

});

function usrRotate(value, ind){
    $(".bar").mouseup(function(){
        $(".bar").val(0);
        rotations[ind] = 0;
    });

    // If the slider is currently at zero, we just want the new value, not the difference of anything
    ind--;
    // rotval = zeroflag ? value : value - rotations[ind];
    rotval = value - rotations[ind];
    rotateFigure(rotval, rotfuncs[ind]);
    rotations[ind] = value;
    // zeroflag = false;
}
