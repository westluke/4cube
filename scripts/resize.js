window.onload = function(){
    // $("#settings").width(4);
    // console.log("s");
    var framer = $("#framer");
    framer.width(framer.height());
    renderer.setSize( $("#container").width(), $("#container").height());
        // renderer.setSize( $("#container").width() + 200, $("#container").height() + 200 );
}

// RENDERER STUFF FROM GL.JS, ORGANIZE BETTER



window.onresize = function() {
    var framer = $("#framer");
    framer.width(framer.height());
    // console.log("resize");
    renderer.setSize( $("#container").width(), $("#container").height() );
}
