/**
 * 初始化标绘事件
 * @returns {undefined}
 */
function initDrawControl() {
    for (key in drawControls) {
        var control = drawControls[key];
        control.events.on({
            "featureadded": drawCompleted
        });
    }
}

//处理绘制完成后的信息
function drawCompleted(drawGeometryArgs) {
    style = {
        strokeColor: "red",
        strokeWidth: 1,
        pointerEvents: "visiblePainted",
        fillColor: "green",
        fillOpacity: 0.5
    };
    var feature = new OpenLayers.Feature.Vector();
    feature.geometry = drawGeometryArgs.feature.geometry,
            feature.style = style;

    intersectsQuery(feature, false);
}
/**
 *  相交查询
 * @param {type} inputFeature
 * @param {type} showInfo
 * @returns {undefined}
 */
function intersectsQuery(inputFeature, showInfo) {
    boxLayer.removeAllFeatures();
//    polygonLayer.removeAllFeatures();
    markers.clearMarkers();
    boxLayer.addFeatures(inputFeature);
    var wkt = wktwriter.write(inputFeature);
    var url = "./queryservice/qbyintersects?polygon=";

    queryBySelfDraw(url, wkt,showInfo);

}
/**
 * 设置标绘控件是否可以用。
 * @param {type} element
 * @returns {undefined}
 */
function toggleControl(element) {
    for (key in drawControls) {
        var control = drawControls[key];
        if (element.value == key && element.checked) {
            control.activate();
        } else {
            control.deactivate();
        }
    }

}
/**
 * 在绘制的过程中可以平移地图
 * @param {type} element
 * @returns {undefined}
 */
function allowPan(element) {
    var stop = !element.checked;
    for (var key in drawControls) {
        drawControls[key].handler.stopDown = stop;
        drawControls[key].handler.stopUp = stop;
    }
}

/**
 * 启漫游控件
 * @returns {undefined}
 */
function enablePan() {
    for (key in drawControls) {
        var control = drawControls[key];
        control.deactivate();
    }
    navigation.activate();
}


/**
 * 自定义查询统计
 * @returns {undefined}
 */
function selfDrawQuery() {
    $.dialog({
        id: 'draw',
        title: '自选区域统计',
        content: document.getElementById("drawtool").innerHTML,
        left: '98%',
        top: '20%',
        drag: true,
        resize: true,
        max: false,
        min: false,
        fixed: false,
        close: function() {
            enablePan();
        }
    });
}

function queryBySelfDraw(url, polygon,showinfo) {
    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    selectControl.deactivate();
    $.ajax({
        type: "POST",
        url: url + polygon,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "jsonp",
        processData: true,
        error: function(req, status, error) {
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
            if (status == "timeout") {

                alert("请求超时，请稍后再试!！");
                return;
            } else if (status === "error") {

                alert("数据请求失败，请稍后再试!如果还未解决，请联系管理员！");
                return;
            }
            return;
        },
        success: function(obj) {
            var firstLonLat;
            if (!obj) {
                return;
            }

            $.each(obj, function(i, n) {

                var feature = new OpenLayers.Format.WKT().read(n.wkt);
                var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                var j = 0;
                var orcode = n.orcode;
                var dnbj = n.dnbj;
                if (!dnbj) {
                    dnbj = "暂无园区归属";
                }
                var readdc = n.readdc;
                var pnum = n.p_num;  //从业人员数
                var btype = n.btype; //登记注册类型
                var enh = "" + n.enh; //企业控股情况
                var uscale = parseInt(n.uscale);   //企业规模
//                    addMarkerAndPopup(lonlat, n.name, "名称：" + n.name + "</br>坐标：" + n.wkt);
//                if (currentArea.intersects(feature.geometry)) {
                if (true) {
                    if (j === 0) {
                        j = j + 1;
                        firstLonLat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                    }
                    var table = "<div style='height:100%;'><b>" + n.name + "</b><table class=\"bordered\"> ";
                    var content = "<tr><td>地址</td><td>" + n.loadds
                            + "</td></tr><tr><td> 所属园区</td><td>"
                            + dnbj + "</td></tr><tr><td>注册地区</td><td>"
                            + readdc + "</td></tr><tr><td>企业控股情况</td><td>"
                            + enhmap[enh] + "</td></tr><tr><td>登记注册类型</td><td>"
                            + btypemap[btype] + "</td></tr><tr><td>企业人员数</td><td>"
                            + pnum + "</td></tr><tr><td>企业规模</td><td>"
                            + uscalemap[uscale] + "</td></tr><tr><td>组织机构代码</td><td>"
                            + orcode + "</td></tr>";
                    var tableend = "</table><div align='right'><button id='" + orcode + "'  class='button green medium'  name='" + n.name + "' onclick='test2(this)'>详细信息</button></div></div>";

                    var size = new OpenLayers.Size(44, 40);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon("images/marker-gold.png", size, offset);
                    addMarkerAndPopup(lonlat, icon, table + content + tableend);

                }
            });
            if (obj.length == 0) {
                $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
                var timer;
                $.dialog({
                    id: 'info',
                    title: '通知',
                    content: '没有查找到您要的结果!',
                    left: '95%',
                    top: '90%',
                    drag: false,
                    resize: false,
                    max: false,
                    min: false,
                    fixed: true
                });
                return;
            }

            var info = $.dialog({
                id: 'info',
                time: 5,
                width: 200,
                height: 30,
//                icon: "confirm.gif",
                title: '消息',
                content: '企业数量：' + obj.length,
                left: '95%',
                top: '90%',
                drag: true,
                resize: false,
                max: false,
                min: false,
//                        fixed: true
            }).content('企业数量：' + obj.length);


            var url = encodeURI('url:jsp/selfcount.jsp?polygon='+polygon);
            $.dialog({
//                id: "selfcount",
                padding: '1px',
                top: '55%',
                left: "57%",
                title: "自选统计",
                content: url,
                max: false,
                min: true,
                height: 500,
                width: 1024

            });


            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
}