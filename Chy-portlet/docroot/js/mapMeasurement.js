var measureControls = null; //测量控件（测量距离和测量面积）
var currentControl = null;//当前测量控件，测距or测面积
// 初始化量算功能
function initMeasure() {
    var sketchSymbolizers = {
        "Line": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "red",
            strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "red",
            fillColor: "yellow",
            strokeDashstyle: "dash",
            fillOpacity: 0.3
        }
    };
    var style = new OpenLayers.Style();
    style.addRules([
        new OpenLayers.Rule({
            symbolizer: sketchSymbolizers
        })
    ]);
    var styleMap = new OpenLayers.StyleMap({
        "default": style
    });

    // allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    measureControls = {
        line: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                    persist: false,
                    immediate: false,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    }
                }
        ),
        polygon: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    }
                }
        )
    };

    var control;
    for (var key in measureControls) {
        control = measureControls[key];
        control.events.on({
            "measure": handleMeasurements,
            "measurepartial": handleMeasurepartial
        });

        map.addControl(control);
    }
}
//处理测量结果事件
function handleMeasurements(event) {
    //计算geometry终点的经纬度坐标
    var geometry = event.geometry;
    var arr = geometry.getVertices();
    var lastLon = arr[arr.length - 1].x;
    var lastLat = arr[arr.length - 1].y;
    var secondLastLon = arr[arr.length - 2].x;
    var secondLastLat = arr[arr.length - 2].y;

    var resultStr;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    if (order === 1) {
        if (units === "km") {
            resultStr = parseInt(measure.toFixed(3)) + "千米";
        }
        if (units === "m") {
            resultStr = parseInt(measure.toFixed(3)) + "米";
        }
    } else {
        if (units === "km") {
            resultStr = parseInt(measure.toFixed(3)) + "平方千米";
        }
        if (units === "m") {
            resultStr = parseInt(measure.toFixed(3)) + "平方米";
        }
    }

    var stylePolyline = {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "blue",
        strokeDashstyle: "solid"
    };
    var stylePloygon = {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "blue",
        fillColor: "white",
        strokeDashstyle: "solid",
        fillOpacity: 0.3
    };
    var feature;
    if (currentControl === "line") {
        feature = new OpenLayers.Feature.Vector(geometry, null, stylePolyline);
    }
    else if (currentControl === "polygon") {
        feature = new OpenLayers.Feature.Vector(geometry, null, stylePloygon);
    }
    else {
        alert("错误！");
        return;
    }
    measurePolys.addFeatures(feature);
    /*
     var size = new OpenLayers.Size(14, 14);
     var offset;
     if(lastLon >= secondLastLon && lastLat >= secondLastLat){
     offset = new OpenLayers.Pixel(3,-(size.h+3));
     }
     else if(lastLon > secondLastLon && lastLat <= secondLastLat){
     offset = new OpenLayers.Pixel(0,-3);
     }
     else if(lastLon <= secondLastLon && lastLat < secondLastLat){
     offset = new OpenLayers.Pixel(-(size.w+3),0);
     }
     else if(lastLon < secondLastLon && lastLat > secondLastLat){
     offset = new OpenLayers.Pixel(-(size.w+3),-(size.h+3));
     }
     else{
     alert("bug");
     return;
     }
     var icon = new OpenLayers.Icon('../../images/closebtn.png', size, offset);
     var marker = new OpenLayers.Marker(new OpenLayers.LonLat(lastLon,lastLat), icon);
     marker.events.register("mousedown", marker,
     function() {
     feature.destroy();
     popup.destroy();
     marker.destroy();
     });
     markers.addMarker(marker);
     */
    var ll = calculateOffset(lastLon, lastLat, secondLastLon, secondLastLat);
    var popup = new OpenLayers.Popup(null,
            new OpenLayers.LonLat(ll.lon, ll.lat),
            null,
            "<div style='font-size: 12px; background: white; border: 1px solid red; line-height: 20px; text-align: center;'>" + resultStr + "</div>",
            true,
            function() {
                feature.destroy();
                popup.destroy();
            });
    popup.autoSize = true;
    //popup.maxSize = new OpenLayers.Size(200, 60);
    popup.backgroundColor = "none";
    map.addPopup(popup);

    map.events.register('zoomend', null, function() {
        var lonlat = calculateOffset(lastLon, lastLat, secondLastLon, secondLastLat);
        var xy = map.getPixelFromLonLat(lonlat);
        popup.moveTo(xy);
    });

    for (var key in measureControls) {
        var control = measureControls[key];
        control.deactivate();
    }
}
//计算popup位置函数
function calculateOffset(lastLon, lastLat, secondLastLon, secondLastLat) {
    //左上方向
    if (lastLon >= secondLastLon && lastLat >= secondLastLat) {
        var pixel_1 = map.getPixelFromLonLat(new OpenLayers.LonLat(lastLon, lastLat));
        var x = pixel_1.x;
        var y = pixel_1.y - 15;
        var pixel_2 = new OpenLayers.Pixel(x, y);
        var lonlat = map.getLonLatFromPixel(pixel_2);
        return lonlat;
    }
    //右下方向
    else if (lastLon > secondLastLon && lastLat <= secondLastLat) {
        var pixel_1 = map.getPixelFromLonLat(new OpenLayers.LonLat(lastLon, lastLat));
        var x = pixel_1.x;
        var y = pixel_1.y;
        var pixel_2 = new OpenLayers.Pixel(x, y);
        var lonlat = map.getLonLatFromPixel(pixel_2);
        return lonlat;
    }
    //左下方向
    else if (lastLon <= secondLastLon && lastLat < secondLastLat) {
        var pixel_1 = map.getPixelFromLonLat(new OpenLayers.LonLat(lastLon, lastLat));
        var x = pixel_1.x - 35;
        var y = pixel_1.y;
        var pixel_2 = new OpenLayers.Pixel(x, y);
        var lonlat = map.getLonLatFromPixel(pixel_2);
        return lonlat;
    }
    //左上方向
    else if (lastLon < secondLastLon && lastLat > secondLastLat) {
        var pixel_1 = map.getPixelFromLonLat(new OpenLayers.LonLat(lastLon, lastLat));
        var x = pixel_1.x - 32;
        var y = pixel_1.y - 32;
        var pixel_2 = new OpenLayers.Pixel(x, y);
        var lonlat = map.getLonLatFromPixel(pixel_2);
        return lonlat;
    }
    else {
        alert("bug");
        return;
    }
}
//处理部分测量事件
function handleMeasurepartial(event) {

}

//地图量算函数
function mapMeasure(element) {
    var key;
    for (key in measureControls) {
        var control = measureControls[key];
        if (element.id === key) {
            currentControl = element.id;
            control.activate();
            control.geodesic = true;
        } else {
            control.deactivate();
        }
    }
}




