var map = null; //定义地图全局变量
var worldlayer = null, chinarst = null, china = null, china_p = null, china_p2 = null, roads = null, cities = null, terrain = null; //定义图层全局变量
var baidulayer = null;
var measurePolys = null; //矢量图层，用于保存测量生成的要素
var polygonLayer = null;
var boxLayer = null;
var navigation = null;
var markers = null; //地标
var currentPopup = null; //当前popup
var selectControl = null;
var clusterVectors = null; //聚类矢量图层
var clusterVectors_min = null; //聚类矢量图层(精简)
var selectedCluster = null;//当前被选中的聚类矢量图层
var layerStrategy = null; //矢量图层策略，如聚类等
var rows = []; //数组，存储EasyUI PropertyGrid插件的所有行
var companyNames = []; //数组，存储查询到的公司名称
var serverfid = null;
var currentArea;
var wktwriter = null;
var drawControls;
OpenLayers.ProxyHost = "proxy.jsp?url="; //跨域请求代理文件

function mapInit() {
    var wmsurl = "http://map.chinalbs.org/beyonserver/gwc/service/wms";
    var wmsurl_175 = "http://map.chinalbs.org/beyonserver2/gwc/service/wms";
    var wmsurl_2518 = "http://124.205.25.18/beyonserver/gwc/service/wms";
    //var wfsurl_2518 = "http://124.205.25.18/beyonserver/wfs";

    var mapOptions = {
        resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
            0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5,
            2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6],
        projection: new OpenLayers.Projection('EPSG:4326'),
        maxExtent: new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0),
        controls: []
    };
    wktwriter = new OpenLayers.Format.WKT();
    // 使用指定的文档元素创建地图
    map = new OpenLayers.Map("map", mapOptions);


//    baidulayer  = new OpenLayers.Layer.Panguso();

    china = new OpenLayers.Layer.WMS(
            "中国", wmsurl,
            {
                layers: 'china',
                format: 'image/png8'
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        maxResolution: 0.703125,
        isBaseLayer: true
    }
    );

    china_p = new OpenLayers.Layer.WMS(
            "中国注记", wmsurl,
            {
                LAYERS: 'beyondb:b0100p014',
                STYLES: '',
                format: 'image/png8',
                tiled: true
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        isBaseLayer: false,
        transitionEffect: "none",
        minResolution: 0.00274658203125
    }
    );

    china_p2 = new OpenLayers.Layer.WMS(
            "中国注记2", wmsurl,
            {
                LAYERS: 'beyondb:b0100p014',
                STYLES: '',
                format: 'image/png8',
                tiled: true
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        isBaseLayer: false
    }
    );
    china_p2.visibility = false;

    roads = new OpenLayers.Layer.WMS(
            "中国道路", wmsurl,
            {
                layers: 'beyondb:b0100l013',
                format: 'image/png8'
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        isBaseLayer: false
    }
    );
    roads.visibility = false;

//    var worlddem = new OpenLayers.Layer.WMS(
//            "世界DEM", wmsurl,
//            {layers: 'beyondb:world_dem', format: 'image/jpeg'},
//    {tileSize: new OpenLayers.Size(256, 256),
//        isBaseLayer: true});
//    worlddem.visibility = false;

    cities = new OpenLayers.Layer.WMS(
            "城市", [wmsurl, wmsurl],
            {
                LAYERS: 'citygroup',
                STYLES: '',
                format: 'image/png8',
                tiled: true
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        isBaseLayer: false,
        maxResolution: 0.001373291015625
    }
    );

    worldlayer = new OpenLayers.Layer.WMS(
            "世界影像", wmsurl_2518,
            {layers: 'beyondb:world', format: 'image/jpeg'},
    {buffer: 1, tileSize: new OpenLayers.Size(256, 256), minResolution: 0.010986328125, isBaseLayer: false});
    worldlayer.visibility = false;

    chinarst = new OpenLayers.Layer.WMS(
            "中国影像", wmsurl_2518,
            {layers: 'beyondb:gm_china_l13', format: 'image/jpeg'},
    {buffer: 1, tileSize: new OpenLayers.Size(256, 256), isBaseLayer: false, maxResolution: 0.0054931640625});
    chinarst.visibility = false;

    terrain = new OpenLayers.Layer.WMS(
            "中国地形", [wmsurl_175, wmsurl_175],
            {
                layers: 'chinadem',
                format: 'image/jpeg'
            },
    {
        buffer: 1,
        displayOutsideMaxExtent: true,
        isBaseLayer: false
    });
    terrain.visibility = false;

//    var wfsLayer = new OpenLayers.Layer.Vector("WFS", {
//        strategies: [new OpenLayers.Strategy.BBOX()],
//        projection: new OpenLayers.Projection("EPSG:4326"),
//        protocol: new OpenLayers.Protocol.WFS({
//            version: "1.1.0",
//            srsName: "EPSG:4326",
//            url: wfsurl,
//            featureNS: "http://www.beyondb.com.cn",
//            featurePrefix: "beyondb",
//            featureType: "bou2_4l_400",
//            geometryName: "the_geom"
//        })
//    });
//    wfsLayer.visibility = false;

    map.addLayers([terrain, worldlayer, chinarst, china, cities, roads, china_p2, china_p]);

    //聚类图层初始化，此函数需放在markers图层之前添加
    clusterLayerInit();

    measurePolys = new OpenLayers.Layer.Vector("测量要素");
    map.addLayer(measurePolys);
    polygonLayer = new OpenLayers.Layer.Vector("矢量标绘-POLY");
    map.addLayer(polygonLayer);
    boxLayer = new OpenLayers.Layer.Vector("矢量标绘-BOX");
    map.addLayer(boxLayer);
    markers = new OpenLayers.Layer.Markers("地标");
    map.addLayer(markers);

    drawControls = {
        polygon: new OpenLayers.Control.DrawFeature(boxLayer,
                OpenLayers.Handler.Polygon),
        box: new OpenLayers.Control.DrawFeature(boxLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 4,
                        irregular: true
                    }
                }
        )
    };
    for (var key in drawControls) {
        map.addControl(drawControls[key]);
    }

    //添加编辑控件
    //map.addControl(new OpenLayers.Control.EditingToolbar(ol_vector));
    navigation = new OpenLayers.Control.Navigation();
    map.addControl(navigation);
    map.addControl(new OpenLayers.Control.ScaleLine());
    map.addControl(new OpenLayers.Control.MagnifyingGlass());
    //map.addControl(new OpenLayers.Control.MousePosition({position: new OpenLayers.Pixel(250, $("#map").innerHeight() - 20)}));
//    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.IPanZoomBar());
    map.addControl(new OpenLayers.Control.KeyboardDefaults());
    map.addControl(new OpenLayers.Control.LTOverviewMap());
    //map.zoomToExtent(new OpenLayers.Bounds(115.420156, 39.439305, 117.517288, 41.061873));
    map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 11);
}

function clusterLayerInit() {
    //以下为定义clusterVector聚类图层
    var colors = {
        low: "rgb(181, 226, 140)",
        middle: "rgb(241, 211, 87)",
        high: "rgb(253, 156, 115)"
    };
    // Define three rules to style the cluster features.
    var lowRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.LESS_THAN,
            property: "count",
            value: 15
        }),
        symbolizer: {
            fillColor: colors.low,
            fillOpacity: 0.9,
            strokeColor: colors.low,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 10,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var middleRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: "count",
            lowerBoundary: 15,
            upperBoundary: 50
        }),
        symbolizer: {
            fillColor: colors.middle,
            fillOpacity: 0.9,
            strokeColor: colors.middle,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 15,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var highRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: "count",
            value: 50
        }),
        symbolizer: {
            fillColor: colors.high,
            fillOpacity: 0.9,
            strokeColor: colors.high,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 20,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });

    var style = new OpenLayers.Style(null, {
        rules: [lowRule, middleRule, highRule]
    });

//    layerStrategy = new OpenLayers.Strategy.AnimatedCluster({
    layerStrategy = new OpenLayers.Strategy.Cluster({
        distance: 40,
//        animationMethod: OpenLayers.Easing.Expo.easeOut,
//        animationDuration: 20
    });

    clusterVectors_min = new OpenLayers.Layer.Vector("cluster", {
//        renderers: ['Canvas', 'SVG'],
        strategies: [layerStrategy],
        styleMap: new OpenLayers.StyleMap(style)
    });

//    clusterVectors_min.visibility= false;
    map.addLayer(clusterVectors_min);

    selectedCluster = new OpenLayers.Layer.Vector("SelectedCluster");
    map.addLayer(selectedCluster);

    clusterVectors_min.events.register("featureselected", null,
            function(event) {
                rows.splice(0, rows.length);
                companyNames.splice(0, companyNames.length);

                if (selectedCluster.features.length > 0) {
                    selectedCluster.removeAllFeatures(); //清除当前被选中的聚类要素
                }
                $.dialog({id: 'propertydlg'}).close();

                //var level = map.getZoom();
                var feature = event.feature;
                var len = feature.cluster.length;
                //最大查询45个要素
                if (len < 46) {
                    var fea = new OpenLayers.Feature.Vector(feature.geometry);
                    fea.style = {
                        fillColor: "#0000ff",
                        fillOpacity: 0.5,
                        strokeColor: "#0000ff",
                        strokeOpacity: 0.5,
                        strokeWidth: 12,
                        pointRadius: 20
                    };
                    selectedCluster.addFeatures(fea);

                    for (var i = 0; i < len; i++) {
                        var name = feature.cluster[i].attributes[partTitle];
                        companyNames.push(name);
                    }
                    //wfs查询选中的聚类feature所对应的实际features
                    clusterLoadAll(sharedFeaType);
                }
                else {
                    $.extend($.gritter.options, {
                        position: 'bottom-right',
                        fade_in_speed: 100,
                        fade_out_speed: 100,
                        time: 5000
                    });

                    $.gritter.add({
                        title: '<p style="color:blue;font-size:20px;">查询量过大，请放大地图！</p>',
                        text: '<p style="color:red;font-size:15px;"></p>',
                        sticky: false,
                        time: ''
                    });
                }
            });

    clusterVectors_min.events.register("featureunselected", null,
            function(event) {
                $.dialog({id: 'propertydlg'}).close();
                if (selectedCluster.features.length > 0) {
                    selectedCluster.removeAllFeatures(); //清除当前被选中的聚类要素
                }
                rows.splice(0, rows.length);
                companyNames.splice(0, companyNames.length);
            });

    selectControl = new OpenLayers.Control.SelectFeature(clusterVectors_min);
    map.addControl(selectControl);
    selectControl.activate();
}

/**
 *打扫地图，清除矢量图层中绘制的内容，并禁用各种操作
 */
function cleanMap() {
    if (clusterVectors_min !== null && clusterVectors_min.features.length > 0) {
        clusterVectors_min.removeAllFeatures(); //清除聚类要素
    }
    if (selectedCluster !== null && selectedCluster.features.length > 0) {
        selectedCluster.removeAllFeatures(); //清除当前被选中的聚类要素
    }
    if (measurePolys !== null && measurePolys.features.length > 0) {
        measurePolys.removeAllFeatures(); //清除测量结果中所有要素
    }
    if (markers !== null && markers.markers.length > 0) {
        markers.clearMarkers(); //清除地标
    }
    if (map.popups.length > 0) {
        clearPopups(); //清除地图上所有的弹出框
    }
    polygonLayer.removeAllFeatures();
    boxLayer.removeAllFeatures();
}
//由于OpenLayers存在的bug，需要用递归函数来处理一下
function clearPopups() {
    for (var i in map.popups) {
        map.removePopup(map.popups[i]);
    }

    if (map.popups.length > 0) {
        clearPopups();
    }
    if (currentPopup) {
        currentPopup.destroy();
        currentPopup = null;
    }
}

//打开城市列表窗口
function openCityListDlg() {
    var htmlStr = addCityLinks();
    easyDialog.open({
        container: {
            header: '城市列表',
            content: htmlStr
        },
        overlay: false,
        follow: currentDistrict,
        followX: 100,
        followY: 35,
        callback: closeCall
    });
    /*
     $.dialog({
     left: 400,
     top: 130,
     max: false,
     min: false,
     width: '320px',
     height: '380px',
     overflow: "auto",
     title: "请选择城市",
     content: 'url: citylist.jsp',
     close: function() {
     }
     });
     */
}

function closeCall() {

}

function addCityLinks() {
    var htmlStr = "<p>当前城市：北京市</p><hr>";
    for (var i = 0; i < mapPlace.length; i++) {
        var funProStr = "map.setCenter(new OpenLayers.LonLat(" + mapPlace[i]["lng"] + "," + mapPlace[i]["lng"] + "), 6);";
        htmlStr += "<a href='#' onclick='" + funProStr + "'><b>" + mapPlace[i]["name"] + "：</b></a><br>";

        var num = 0;
        num = mapPlace[i]["children"].length;
        for (var j = 0; j < num; j++) {
            var funCityStr = "map.setCenter(new OpenLayers.LonLat(" + mapPlace[i]["children"][j]["lng"] + "," + mapPlace[i]["children"][j]["lat"] + "), 10);";
            htmlStr += "<a href='#' onclick='" + funCityStr + "'>" + mapPlace[i]["children"][j]["name"] + "</a>&nbsp&nbsp";
            if (j === num - 1) {
                htmlStr += "<br>";
            }
        }
    }
    return htmlStr;
}

//获取系统时间
function getTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var days; //用于保存星期（getDay()方法得到星期编号）

    if (now.getDay() === 0)
        days = "星期日 ";
    if (now.getDay() === 1)
        days = "星期一 ";
    if (now.getDay() === 2)
        days = "星期二 ";
    if (now.getDay() === 3)
        days = "星期三 ";
    if (now.getDay() === 4)
        days = "星期四 ";
    if (now.getDay() === 5)
        days = "星期五 ";
    if (now.getDay() === 6)
        days = "星期六 ";

    if (day <= 9) {
        day = "0" + day;
    }
    if (month <= 9) {
        month = "0" + month;
    }
    if (second <= 9) {
        second = "0" + second;
    }
    if (minute <= 9) {
        minute = "0" + minute;
    }
    return year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second + "  " + days;
}

//显示系统时间
function showTime() {
    var timeStr = getTime();
    document.getElementById('time').innerHTML = timeStr;
    setTimeout(showTime, 1000);
}

//jqueryUI手风琴效果
$(function() {
    $("#accordion").accordion({
        heightStyle: "content"
    });
});

$(function() {
    $("#radioset").buttonset();
});

function changeMapStyle(id) {
    if (id === "radio1") {
        china.setVisibility(true);
        china_p.setVisibility(true);
        cities.setVisibility(true);
        china_p2.setVisibility(false);
        roads.setVisibility(false);
        worldlayer.setVisibility(false);
        chinarst.setVisibility(false);
        terrain.setVisibility(false);
    } else if (id === "radio2") {
        china_p2.setVisibility(true);
        worldlayer.setVisibility(true);
        chinarst.setVisibility(true);
        china_p.setVisibility(false);
        roads.setVisibility(false);
        china.setVisibility(false);
        cities.setVisibility(false);
        terrain.setVisibility(false);
    } else if (id === "radio3") {
        terrain.setVisibility(true);
        china_p2.setVisibility(true);
        china_p.setVisibility(false);
        roads.setVisibility(false);
        worldlayer.setVisibility(false);
        chinarst.setVisibility(false);
        china.setVisibility(false);
        cities.setVisibility(false);
    } else {
        alert("error");
    }
}

//$("#tags").autocomplete({
//    source: mapPlace
//});

$(function() {
    $("button").button().click(function(event) {
        event.preventDefault();
    });
});

//打印地图
function printMap() {
    $("#mapHolder").printArea({mode: "popup", popClose: true});
}

function ajaxDataFilter(treeId, parentNode, childNodes) {
    if (!childNodes) {
        return null;
    }
//    var len = childNodes.length;
//    for (var i = 0;i < len; i++) {
//        childNodes[i].name = childNodes[i].name.replace('', '');
//    }
    return childNodes;
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    //alert(msg);
}

function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    alert(XMLHttpRequest);
}

var ztreeSetting = {
    async: {
        enable: true,
        dataType: "text",
        url: "GetLayers.do",
        type: "get",
        dataFilter: ajaxDataFilter,
        autoParam: ["id", "name", "level"]
    },
    check: {
        enable: false,
        chkStyle: "checkbox",
        chkboxType: {"Y": "p", "N": "s"}
    },
    callback: {
        //onClick: zTreeOnClick,
        //onCheck: zTreeOnCheck,
        onAsyncSuccess: zTreeOnAsyncSuccess,
        onAsyncError: zTreeOnAsyncError
    },
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

var ztreeNodes = [
    {id: 1, pId: 0, name: "基础地理空间库", open: true},
    {id: 11, pId: 1, name: "导航地图库B01", isParent: true},
    {id: 12, pId: 1, name: "卫星影像库B03", isParent: true},
    {id: 13, pId: 1, name: "地形库B04", isParent: true},
    {id: 14, pId: 1, name: "地名库B06", isParent: true},
    {id: 15, pId: 1, name: "海图库B07", isParent: true},
    {id: 2, pId: 0, name: "行业专题信息库", open: true},
    {id: 21, pId: 2, name: "交通信息库T01", isParent: true},
    {id: 22, pId: 2, name: "国土资源库T02", isParent: true},
    {id: 23, pId: 2, name: "水利信息库T03", isParent: true},
    {id: 24, pId: 2, name: "农业资源库T04", isParent: true},
    {id: 25, pId: 2, name: "气候气象库T05", isParent: true},
    {id: 26, pId: 2, name: "灾害信息库T06", isParent: true},
    {id: 27, pId: 2, name: "社会人文库T07", isParent: true},
    {id: 28, pId: 2, name: "环境生态库T08", isParent: true},
    {id: 29, pId: 2, name: "生活消费库T09", isParent: true}
];

function setCurrentDistrict() {
    var level = map.getZoom();
    var layer = "b0100g003";
    if (level < 6) {
        $("#currentDistrict").text("当前位置：中国");
        return;
    } else if (level >= 6 && level < 9) {
        layer = "b0100g002";
    } else {
        layer = "b0100g003";
    }

    var center = map.getCenter();
    var bounds = new OpenLayers.Bounds(center.lon, center.lat, center.lon + 0.000001, center.lat + 0.000001);
    var filter = new OpenLayers.Filter.Spatial({
        type: OpenLayers.Filter.Spatial.CONTAINS,
        value: bounds,
        projection: "EPSG:4326"
    });

    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://map.chinalbs.org/beyonserver/beyondb/wfs",
        featureType: layer,
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.0.0"
    });

    wfsProtocol.read({
        filter: filter,
        callback: function(response) {
            var features = response.features;
            var len = features.length;
            if (len === 0) {
                $("#currentDistrict").text("当前位置：中国");
            } else if (len === 1) {
                var name = features[0].attributes["name"];
                serverfid = features[0].fid;
                currentArea = features[0].geometry;
                $("#currentDistrict").text("当前位置：" + name);
            } else {
                alert(len);
            }
        }
    });
}

function changePopup() {
    var level = map.getZoom();
    if (level < 10) {
        if (map.popups.length > 0) {
            clearPopups(); //清除地图上所有的弹出框
        }
    } else if (level >= 10 && level <= 13) {
        if (map.popups.length <= 0) {
            queryCountService();
        } else if (map.popups.length > 16) {
            clearPopups(); //清除地图上所有的弹出框
            queryCountService();
        }
    } else if (level > 13) {
        if (map.popups.length <= 16 || map.popups.length == 38) {
            clearPopups(); //清除地图上所有的弹出框
            queryCountServiceByYuanQu();
        }
    }


}

function resetMap(){
    queryCountService();
}

$(document).ready(function() {
    showTime(); //显示系统时间
    mapInit(); //地图初始化
    initMeasure(); //测量工具初始化
 //   setCurrentDistrict(); //地图加载的时候执行一次
    //注册moveend事件，做wfs请求，设置当前位置
 //   map.events.register("moveend", null, setCurrentDistrict);

//    map.events.register("zoomend", null, changePopup);
    //idTabs插件初始化
//    $("#tabNav ul").idTabs();
//
//    $.fn.zTree.init($("#layersTree"), ztreeSetting, ztreeNodes);
//    $("#tree").show();

    $(".olwidgetPopupContent").click(function(event) {
        $(".olwidgetPopupContent").show();
        event.stopPropagation();//阻止冒泡

    });
    // 初始化地图后加载区划统计图。
    //queryCountService();
     //initDrawControl();
});
