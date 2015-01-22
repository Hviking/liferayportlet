
function searchByEnterKey(keyword, type) {

    if (event.keyCode === 13) {
        if (keyword === "") {
            alert("关键字不能为空！");
            return;
        }
        search(keyword, type);
    }
}

function search(keyword, type) {
    if (keyword === "") {
        alert("关键字不能为空！");
        return;
    }

    if (type === 'btn1') {
        selectControl.deactivate();
        cleanMap(); //清扫地图
        $.ajax({
            type: "GET",
//            url: "http://map.chinalbs.org/geolbs/poi/QueryAddressV2/" + keyword +"/"+serverfid +"/20",
//            url: "http://localhost:8084/geolbs/ep/query/" + keyword + "/50",
            url: "./queryservice/qbyKeyword/1/" + keyword,
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
                if (obj) {
                    if (obj.length == 0) {
                        alert("没有查找到您要的结果，请更换关键词，再试一试!");
                        return;
                    }
                }

                $.each(obj, function(i, n) {

                    var feature = new OpenLayers.Format.WKT().read(n.wkt);
                    var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                    var j = 0;
                    var orcode = n.orcode;
                    var readdc = n.readdc;
//                    addMarkerAndPopup(lonlat, n.name, "名称：" + n.name + "</br>坐标：" + n.wkt);
//                    if (currentArea.intersects(feature.geometry)) {
                    if (true) {
                        if (j === 0) {
                            j = j + 1;
                            firstLonLat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                        }
                        var table = "<div style=\"top:30px;bottom:10px;\">" + n.name + "<table class=\"bordered\"> ";
                        var content = "<tr><td>地址</td><td>" + n.loadds
                                + "</td></tr><tr><td> 所属园区</td><td>"
                                + n.dnbj + "</td></tr><tr><td>注册地区</td><td>"
                                + readdc + "</td></tr><tr><td>组织机构代码</td><td>"
                                + orcode + "</td></tr>";
                        var tableend = "</table><div align='right'><button id='" + orcode + "'  class='button green medium' name='" + n.name + "' onclick='test2(this)'>详细信息</button></div></div>";

                        var size = new OpenLayers.Size(38, 40);
                        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                        var icon = new OpenLayers.Icon("images/marker-gold.png", size, offset);
                        addMarkerAndPopup(lonlat, icon, table + content + tableend);

                    }
                });
                map.setCenter(firstLonLat, 13);
            }
        });
    } else if (type === 'btn2') {
        selectControl.deactivate();
        cleanMap(); //清扫地图
        $.ajax({
            type: "GET",
            url: "http://map.chinalbs.org/geolbs/tuangou/dzdp/" + keyword + "/50",
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
                $.each(obj, function(i, n) {
                    var lon = n.baiduLongitude;
                    var lat = n.baiduLatitude;
                    var corG = convertBd09ToGcj02(lon, lat);
                    if (corG != false) {
                        var corP = gcj2wgs(corG.longitude, corG.latitude);
                        lon = corP.lontitude;
                        lat = corP.latitude;
                    }
                    if (i == 0) {
                        firstLonLat = new OpenLayers.LonLat(lon, lat);
                    }
                    var lonlat = new OpenLayers.LonLat(lon, lat);
                    var content = "<div align='left'><div width=209  style='margin-left:20'>"
                            + "<image height=120 width=200 src='" + n.photos + "'></image></div>"
                            + "<div style='margin-left:20'>地址：" + n.address + "<br>"
                            + "营业时间：" + n.openingtime + "<br>"
                            + "推荐内容：" + n.recommend + "<br>"
                            + "联系电话：" + n.tel + "<br>"
                            + "地区：" + n.area + "<br>"
                            + "网址:" + "<a href='" + n.url + "' target='_blank'>" + n.url + "</a></div></div>";

                    addMarkerAndPopup(lonlat, n.name, content);

                });
                map.setCenter(firstLonLat, 11);
            }
        });
    }
}

function test2(event) {
    var id = event.id;
    var url = encodeURI('url:jsp/propertyinfo.jsp?id=' + id + "&title=" + event.name);
    url = 'url:jsp/propertyinfo.jsp?id=' + id + "&title=" + event.name;
    $.dialog({
        id: id,
        padding: '1px',
        top: '50%',
        left: "97%",
        title: event.name,
        content: url,
        max: false,
        min: false,
        height: 480,
        width: 430

    });

}

function queryEnterprise(type, id) {
//       var url ="http://localhost:8084/elbs/queryservice/qall";
    var url = "";
    var img = "images/2.png";

    switch (type) {
        case 1 :
            //营业收入
            url = "./queryservice/qbyitotal/" + id;
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
                case 4:
                    img = "images/4.png";
                    break;
                case 5:
                    img = "images/5.png";
                    break;
            }
            break;
        case 2:
            // 行业类别
            url = "./queryservice/qbyscale/" + id;

            img = "images/2.png";
            break;
        case 3:
            //单位规模
            url = "./queryservice/qbyscale/" + id;
//            icon = new OpenLayers.Icon('images/3.png', size, offset);
            img = "images/3.png";
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
                case 4:
                    img = "images/4.png";
                    break;
            }
            break;
        case 4:
            //人员数量
            url = "./queryservice/qbypeople/" + id;
            img = "images/1.png";
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
                case 4:
                    img = "images/4.png";
                    break;
            }
            break;
        case 5:
            //企业控股情况
            url = "./queryservice/qbyenh/" + id;
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
                case 4:
                    img = "images/4.png";
                    break;
                case 5:
                    img = "images/5.png";
                    break;
                case 9:
                    img = "images/6.png";
                    break;
            }

            break;
        case 6:
            //登记注册类型
            url = "./queryservice/qbybtype/" + id;
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
            }
            break;
        case 7:
            //净利润
            url = "./queryservice/qbynpro/" + id;
            switch (id) {
                case 1:
                    img = "images/1.png";
                    break;
                case 2:
                    img = "images/2.png";
                    break;
                case 3:
                    img = "images/3.png";
                    break;
                case 4:
                    img = "images/4.png";
                    break;
                case 5:
                    img = "images/5.png";
                    break;
            }
            break;
        default:
            url = "./queryservice/qbyid2";

    }
    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    selectControl.deactivate();
    cleanMap(); //清扫地图
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        processData: true,
        timeout: 10000,
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
            if (obj) {
                if (obj.length == 0) {
                    $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
//                    alert("没有查找到您要的结果!");

                    var timer;
                    $.dialog({
                        id: 'msg',
                        time: 3,
                        width: 200,
                        height: 50,
                        icon: "face-sad.png",
                        title: '消息',
                        content: '没有查找到您要的结果!',
                        left: '95%',
                        top: '90%',
                        drag: true,
                        resize: false,
                        max: false,
                        min: false,
//                        fixed: true
                    });
                    return;
                }
            }
            $.each(obj, function(i, n) {

                var feature = new OpenLayers.Format.WKT().read(n.wkt);
                var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                var j = 0;
                var dnbj = n.dnbj;
                if (!dnbj) {
                    dnbj = "暂无园区归属";
                }
                var orcode = n.orcode;
                var readdc = n.readdc;
                var pnum = n.p_num;  //从业人员数
                var btype = n.btype; //登记注册类型
                var enh = "" + n.enh; //企业控股情况
                var uscale = parseInt(n.uscale);  //企业规模
//                alert(uscalemap[uscale]);
//                    addMarkerAndPopup(lonlat, n.name, "名称：" + n.name + "</br>坐标：" + n.wkt);
//                if (currentArea.intersects(feature.geometry)) {
                if (true) {
                    if (j === 0) {
                        j = j + 1;
                        firstLonLat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                    }
                    var table = "<div style=\"top:30px;bottom:10px;\"><b>" + n.name + "</b><table class=\"bordered\"> ";
                    var content = "<tr><td>地址</td><td>" + n.loadds
                            + "</td></tr><tr><td> 所属园区</td><td>"
                            + dnbj + "</td></tr><tr><td>所属地区</td><td>"
                            + readdc + "</td></tr><tr><td>企业控股情况</td><td>"
                            + enhmap[enh] + "</td></tr><tr><td>登记注册类型</td><td>"
                            + btypemap[btype] + "</td></tr><tr><td>企业人员数</td><td>"
                            + pnum + "</td></tr><tr><td>企业规模</td><td>"
                            + uscalemap[uscale] + "</td></tr><tr><td>组织机构代码</td><td>"
                            + orcode + "</td></tr>";
                    var tableend = "</table><div align='right'><button id='" + orcode + "'  class='button green medium' name='" + n.name + "' onclick='test2(this)'>详细信息</button></div></div>";

                    var size = new OpenLayers.Size(18, 43);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon(img, size, offset);
                    addMarkerAndPopup(lonlat, icon, table + content + tableend);

                }
            });
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
//            map.setCenter(firstLonLat, 13);
            if (obj.length === 1) {
                map.setCenter(firstLonLat, 12);
            } else {
                map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 11);
            }
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');

        }
    });

}



function addMarkerAndPopup(lonlat, icon, contentHTML) {

    var marker = new OpenLayers.Marker(lonlat, icon);

//     var ll = calculateOffset(lonlat.lon, lonlat.lat, false);

    marker.events.registerPriority("click", null, function(evt) {
        if (currentPopup !== null) {
            currentPopup.destroy();
            currentPopup = null;
        }
        currentPopup = new OpenLayers.Popup.FramedCloud(
//        currentPopup = new OpenLayers.Popup.CSSFramedCloud(
//        currentPopup = new OpenLayers.IPopup(
                "chicken",
                lonlat,
                null,
//                new OpenLayers.Size(420, 310),
                contentHTML,
                null, true, null);
        currentPopup.autoSize = true;

//        currentPopup.panMapIfOutOfView = true;
//        currentPopup.minSize = new OpenLayers.Size(200, 160);

        if ($.browser.msie) {
            if ($.browser.version < 10) {
//                currentPopup.padding = new OpenLayers.Bounds(0, 0, 10, 0);
                currentPopup.autoSize = false;
                currentPopup.setSize(new OpenLayers.Size(435, 355));
            }
        }

//        if (OpenLayers.Util.BROWSER_NAME === "msie") {
//
//        }

        map.addPopup(currentPopup);

        map.events.register('zoomend', null, function() {

            if (currentPopup) {
                var ll = calculateOffset(lonlat.lon, lonlat.lat, false);
                var xy = map.getPixelFromLonLat(ll);
                currentPopup.moveTo(xy);
            }

        });


        OpenLayers.Event.stop(evt);
    });

    marker.events.register("mouseout", marker, function() {
        this.inflate(1 / 1.2);
        this.setOpacity(0.8);
    });

    marker.events.register("mouseover", marker, function() {
        this.inflate(1.2);
        this.setOpacity(1);
    });

    markers.addMarker(marker);
}



function calculateOffset(lon, lat, iszoomed) {
    var pixel_1 = map.getPixelFromLonLat(new OpenLayers.LonLat(lon, lat));
    var x, y;
    if (iszoomed) {
        x = pixel_1.x;
        y = pixel_1.y - 20;
    } else {
        x = pixel_1.x;
        y = pixel_1.y - 20;
    }

    var pixel_2 = new OpenLayers.Pixel(x, y);
    var lonlat = map.getLonLatFromPixel(pixel_2);
    return lonlat;
}


var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

var casm_rr = 0;
var casm_t1 = 0;
var casm_t2 = 0;
var casm_x1 = 0;
var casm_y1 = 0;
var casm_x2 = 0;
var casm_y2 = 0;
var casm_f = 0;
var pi = 3.14159265358979324;// 圆周率
var a = 6378245.0;// WGS 长轴半径
var ee = 0.00669342162296594323;// WGS 偏心率的平方

/**
 * Convert GCJ02 to BD09
 *
 * @param gg_lat
 * @param gg_lon
 * @return
 */
function convertGcj02ToBd09(gg_lon, gg_lat) {
    var x = gg_lon, y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);

    var p = {};
    p.longitude = z * Math.cos(theta) + 0.0065;
    p.latitude = z * Math.sin(theta) + 0.006;

    return p;
}

/**
 * Convert BD09 to GCJ02
 *
 * @param bd_lat
 * @param bd_lon
 * @return
 */
function convertBd09ToGcj02(bd_lon, bd_lat) {
    var x = bd_lon - 0.0065, y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);

    var p = {};
    p.longitude = z * Math.cos(theta);
    p.latitude = z * Math.sin(theta);

    return p;
}

/**
 * Convert WGS to GCJ02
 * @param x
 * @param y
 * @return
 */
function convertWgsToGcj02(x, y) {
    var x1, tempx, y1, tempy;
    x1 = x * 3686400.0;
    y1 = y * 3686400.0;
    var gpsWeek = 0;
    var gpsWeekTime = 0;
    var gpsHeight = 0;

    var point = wgtochina_lb(1, Math.floor(x1), Math.floor(y1), Math.floor(gpsHeight),
            Math.floor(gpsWeek), Math.floor(gpsWeekTime));
    if (point == null) {
        return false
    } else {
        tempx = point.x;
        tempy = point.y;
        tempx = tempx / 3686400.0;
        tempy = tempy / 3686400.0;

        point.longitude = tempx;
        point.latitude = tempy;
        return point;
    }

}

/**
 *  gcj2 to WGS84
 * @param {type} lat
 * @param {type} lon
 * @returns {wgtochina_lb.point|convertWgsToGcj02.point|gcj2wgs.p|Boolean}
 */

function gcj2wgs(lon, lat) {
    var point = transform(lon, lat);
    var lontitude = lon - (point.lontitude - lon) + 0.00637;
    var latitude = lat - (point.latitude - lat) + 0.00135;

    point.lontitude = lontitude;
    point.latitude = latitude;
    return point;
}

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
            + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
// 84->gcj02
function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
            * pi)) * 2.0 / 3.0;
    return ret;
}


function transform(lon, lat) {
    var localHashMap = {};
    if (outofChina(lat, lon)) {
//			localHashMap.put("lon", Double.valueOf(lon));
//			localHashMap.put("lat", Double.valueOf(lat));
        localHashMap.lontitude = lon;
        localHashMap.latitude = lat;
        return localHashMap;
    }
    var dLat = transformLat(lon - 105.0, lat - 35.0);
    var dLon = transformLon(lon - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLon = lon + dLon;
//		localHashMap.put("lon", mgLon);
//		localHashMap.put("lat", mgLat);
    localHashMap.lontitude = mgLon;
    localHashMap.latitude = mgLat;
    return localHashMap;
}


/**
 * 中国坐标内
 * 
 * @param lat
 * @param lon
 * @return
 */
function outofChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}


function getEncryCoord(coord, flag) {
    if (flag) {
        var x = coord.split(",")[0];
        var y = coord.split(",")[1];
        var point = {};
        var x1, tempx;
        var y1, tempy;
        x1 = x * 3686400.0;
        y1 = y * 3686400.0;
        var gpsWeek = 0;
        var gpsWeekTime = 0;
        var gpsHeight = 0;
        point = wgtochina_lb(1, Math.floor(x1), Math.floor(y1),
                Math.floor(gpsHeight), Math.floor(gpsWeek), Math.floor(gpsWeekTime));
        tempx = point.x;
        tempy = point.y;
        tempx = tempx / 3686400.0;
        tempy = tempy / 3686400.0;
        return tempx + "," + tempy;
    } else {
        return "";
    }
}

function yj_sin2(x) {
    var tt;
    var ss;
    var ff;
    var s2;
    var cc;
    ff = 0;
    if (x < 0) {
        x = -x;
        ff = 1;
    }

    cc = Math.floor(x / 6.28318530717959);

    tt = x - cc * 6.28318530717959;
    if (tt > 3.1415926535897932) {
        tt = tt - 3.1415926535897932;
        if (ff == 1) {
            ff = 0;
        } else if (ff == 0) {
            ff = 1;
        }
    }
    x = tt;
    ss = x;
    s2 = x;
    tt = tt * tt;
    s2 = s2 * tt;
    ss = ss - s2 * 0.166666666666667;
    s2 = s2 * tt;
    ss = ss + s2 * 8.33333333333333E-03;
    s2 = s2 * tt;
    ss = ss - s2 * 1.98412698412698E-04;
    s2 = s2 * tt;
    ss = ss + s2 * 2.75573192239859E-06;
    s2 = s2 * tt;
    ss = ss - s2 * 2.50521083854417E-08;
    if (ff == 1) {
        ss = -ss;
    }
    return ss;
}

function Transform_yj5(x, y) {
    var tt;
    tt = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.sqrt(x * x));
    tt = tt
            + (20 * yj_sin2(18.849555921538764 * x) + 20 * yj_sin2(6.283185307179588 * x)) * 0.6667;
    tt = tt
            + (20 * yj_sin2(3.141592653589794 * x) + 40 * yj_sin2(1.047197551196598 * x)) * 0.6667;
    tt = tt
            + (150 * yj_sin2(0.2617993877991495 * x) + 300 * yj_sin2(0.1047197551196598 * x)) * 0.6667;
    return tt;
}

function Transform_yjy5(x, y) {
    var tt;
    tt = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2
            * Math.sqrt(Math.sqrt(x * x));
    tt = tt
            + (20 * yj_sin2(18.849555921538764 * x) + 20 * yj_sin2(6.283185307179588 * x)) * 0.6667;
    tt = tt
            + (20 * yj_sin2(3.141592653589794 * y) + 40 * yj_sin2(1.047197551196598 * y)) * 0.6667;
    tt = tt
            + (160 * yj_sin2(0.2617993877991495 * y) + 320 * yj_sin2(0.1047197551196598 * y)) * 0.6667;
    return tt;
}

function Transform_jy5(x, xx) {
    var n;
    var a;
    var e;
    a = 6378245;
    e = 0.00669342;
    n = Math.sqrt(1 - e * yj_sin2(x * 0.0174532925199433)
            * yj_sin2(x * 0.0174532925199433));
    n = (xx * 180) / (a / n * Math.cos(x * 0.0174532925199433) * 3.1415926);
    return n;
}

function Transform_jyj5(x, yy) {
    var m;
    var a;
    var e;
    var mm;
    a = 6378245;
    e = 0.00669342;
    mm = 1 - e * yj_sin2(x * 0.0174532925199433)
            * yj_sin2(x * 0.0174532925199433);
    m = (a * (1 - e)) / (mm * Math.sqrt(mm));
    return (yy * 180) / (m * 3.1415926);
}

function r_yj() {
    // int casm_a = 314159269;
    // int casm_c = 453806245;
    return 0;
}

function random_yj() {
    var t;
    var casm_a = 314159269;
    var casm_c = 453806245;
    casm_rr = casm_a * casm_rr + casm_c;
    t = Math.floor(casm_rr / 2);
    casm_rr = casm_rr - t * 2;
    casm_rr = casm_rr / 2;
    return (casm_rr);
}

function IniCasm(w_time, w_lng, w_lat) {
    var tt;
    casm_t1 = w_time;
    casm_t2 = w_time;
    tt = Math.floor(w_time / 0.357);
    casm_rr = w_time - tt * 0.357;
    if (w_time == 0)
        casm_rr = 0.3;
    casm_x1 = w_lng;
    casm_y1 = w_lat;
    casm_x2 = w_lng;
    casm_y2 = w_lat;
    casm_f = 3;
}

function wgtochina_lb(wg_flag, wg_lng, wg_lat, wg_heit, wg_week, wg_time) {
    var x_add;
    var y_add;
    var h_add;
    var x_l;
    var y_l;
    var casm_v;
    var t1_t2;
    var x1_x2;
    var y1_y2;
    var point = null;
    if (wg_heit > 5000) {
        return point;
    }
    x_l = wg_lng;
    x_l = x_l / 3686400.0;
    y_l = wg_lat;
    y_l = y_l / 3686400.0;
    if (x_l < 72.004) {
        return point;
    }
    if (x_l > 137.8347) {
        return point;
    }
    if (y_l < 0.8293) {
        return point;
    }
    if (y_l > 55.8271) {
        return point;
    }
    if (wg_flag == 0) {
        IniCasm(wg_time, wg_lng, wg_lat);
        point = {};
        point.latitude = wg_lng;
        point.longitude = wg_lat;
        return point;
    }
    casm_t2 = wg_time;
    t1_t2 = (casm_t2 - casm_t1) / 1000.0;
    if (t1_t2 <= 0) {
        casm_t1 = casm_t2;
        casm_f = casm_f + 1;
        casm_x1 = casm_x2;
        casm_f = casm_f + 1;
        casm_y1 = casm_y2;
        casm_f = casm_f + 1;
    } else {
        if (t1_t2 > 120) {
            if (casm_f == 3) {
                casm_f = 0;
                casm_x2 = wg_lng;
                casm_y2 = wg_lat;
                x1_x2 = casm_x2 - casm_x1;
                y1_y2 = casm_y2 - casm_y1;
                casm_v = Math.sqrt(x1_x2 * x1_x2 + y1_y2 * y1_y2) / t1_t2;
                if (casm_v > 3185) {
                    return (point);
                }
            }
            casm_t1 = casm_t2;
            casm_f = casm_f + 1;
            casm_x1 = casm_x2;
            casm_f = casm_f + 1;
            casm_y1 = casm_y2;
            casm_f = casm_f + 1;
        }
    }
    x_add = Transform_yj5(x_l - 105, y_l - 35);
    y_add = Transform_yjy5(x_l - 105, y_l - 35);
    h_add = wg_heit;
    x_add = x_add + h_add * 0.001
            + yj_sin2(wg_time * 0.0174532925199433) + random_yj();
    y_add = y_add + h_add * 0.001
            + yj_sin2(wg_time * 0.0174532925199433) + random_yj();
    point = {};
    point.x = (x_l + Transform_jy5(y_l, x_add)) * 3686400;
    point.y = (y_l + Transform_jyj5(y_l, y_add)) * 3686400;
    return point;
}

function isValid(validdays) {
    // long standand = 1253525356;
    var h = 3600;
    var currentTime = new Date();
    return !(currentTime.getTime() / 1000 - 1253525356 >= validdays * 24 * h);
}