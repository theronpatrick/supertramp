$(document).ready(function() {
    skrollr.init({
        constants: {
            scene1: 0,
            scene2: 4000,
            scene3: 7000,
            scene4: 10000,
            scene5: 13000,
            scene6: 16000,
            scene7: 19000,
            scene8: 22000,
            scene9: 25000,
            scene10: 28000,
            scene11: 31000
        }
    });

    // Scroll to top 
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    // Lol hax loading
    var count = 0;
    function addDot() {
        var text = $(".loading-message").text()
        $(".loading-message").text(text + ".");

        count++;
        if (count > 3) {
            return;
        }
        
        setTimeout(addDot, 1000);
    }
    
    addDot();

    // TODO: Set time higher
    setTimeout(function() {
        // Scroll to top 
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        $("#loading").fadeOut(1000);
    }, 4000)

});
