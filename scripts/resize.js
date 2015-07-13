window.onload = function(){
    // $("#settings").width(4);
    // console.log("s");
    var framer = $("#framer");
    framer.width(framer.height());
    renderer.setSize( $("#container").width(), $("#container").height());
    var settings = $("#settings");
    var main = $("#main");
    settings.width(main.width() - framer.width() - 90);
        // renderer.setSize( $("#container").width() + 200, $("#container").height() + 200 );


// RENDERER STUFF FROM GL.JS, ORGANIZE BETTER



    window.onresize = function() {
        var framer = $("#framer");
        framer.width(framer.height());
        // console.log("resize");
        settings.width(main.width() - framer.width() - 20);
        renderer.setSize( $("#container").width(), $("#container").height() );
    }
}
