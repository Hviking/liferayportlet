
$(function() {
    var screenWidth = document.body.clientWidth;
    var screenHeight = document.body.clientHeight;

    var headHeight = 120;
    var headMargin = 0;
    var leftWidth = 300;
    var leftMargin = 0;
    var mapLeftShown = true;

    var setHidenLeft = function() {
        $("#wrapper").height(screenHeight - headHeight - headMargin);
        $("#LeftMenu").css({display: "none"});
        $("#mapHolder").css({left: "0px", width: screenWidth});

        var divisionLeft = 0;
        var divisionTop = (screenHeight - headHeight - headMargin) / 2 - 60;

        $("#division").css({left: divisionLeft + "px", top: divisionTop + "px"});
        $("#shadow_v").css({display: "none"});
        $("#shadow_h").css({left: divisionLeft + "px"}).width(screenWidth);
        $("#division").css({'background-position': "-333px 0"});
        //map.updateSize();
    };
    var fnHideLeft = function() {
        setHidenLeft();
        //map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 10);
        map.updateSize();
        mapLeftShown = false;
    };
    var setShownLeft = function() {
        var divisionLeft = leftWidth + leftMargin;
        var divisionTop = (screenHeight - headHeight - headMargin) / 2 - 60;

        $("#wrapper").height(screenHeight - headHeight - headMargin);
        $("#LeftMenu").css({display: "block"});
        $("#mapHolder").css({float: "right"}).width(screenWidth - divisionLeft);
        $("#mapHolder").css({left: divisionLeft + "px"});

        $("#division").css({left: divisionLeft + "px", top: divisionTop + "px"});
        $("#shadow_v").css({display: "block"});
        $("#shadow_h").css({left: divisionLeft + "px"}).width(screenWidth - leftWidth - leftMargin);
        $("#division").css({'background-position': "-352px 0"});
        //if (map) {
        //map.updateSize();
    };


    var fnShowLeft = function() {
        setShownLeft();
        map.updateSize();
        mapLeftShown = true;
    };

    var _resetFrame = function() {
        screenWidth = document.body.clientWidth;
        screenHeight = document.body.clientHeight;

        if (mapLeftShown) {   //显示左侧的时候
            setShownLeft();
        }
        else {              //隐藏左侧的时候 
            setHidenLeft();
        }
    };

    _resetFrame();
    $(window).resize(function() {
        _resetFrame();
    });

    $("#division").toggle(fnHideLeft, fnShowLeft);
});