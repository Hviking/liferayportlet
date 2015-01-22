var countArea;
var countYuanqu;
var buiding;
var enhmap = new Array();
enhmap['1'] = "国有控股";
enhmap['2'] = "集体控股";
enhmap['3'] = "私人控股";
enhmap['4'] = "港澳台商控股";
enhmap['5'] = "外商控股";
enhmap['9'] = "其它";

var uscalemap = new Array();
uscalemap['1'] = "大型企业";
uscalemap['2'] = "中型企业";
uscalemap['3'] = "小型企业";
uscalemap['4'] = "微型企业";

var btypemap = new Array();
btypemap['110'] = "国有"
btypemap['120'] = "集体"
btypemap['130'] = "股份合作"
btypemap['151'] = "国有独资公司"
btypemap['159'] = "其他有限责任公司"
btypemap['160'] = "股份有限公司"
btypemap['172'] = "私营合伙"
btypemap['173'] = "私营有限责任公司"
btypemap['174'] = "私营股份有限公司"
btypemap['210'] = "与港澳台商合资经营"
btypemap['220'] = "与港澳台商合作经营"
btypemap['230'] = "港澳台商独资"
btypemap['240'] = "港澳台商投资股份有限公司"
btypemap['310'] = "中外合资经营"
btypemap['320'] = "中外合作经营"
btypemap['330'] = "外资企业"
btypemap['340'] = "外商投资股份有限公司"


function queryCountBindChart(){
     openQHChartDialog('北京区划企业统计图');
     queryCountService();
}
/**
 *  区县统计
 * @returns {undefined}
 */
function queryCountService() {
   
    cleanMap();
    selectControl.deactivate();
    $.ajax({
        type: "GET",
        url: "http://192.168.1.119:8080/elbs/countservice/bjcountinfo",
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
            AutoSizeFramedCloud = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
                'autoSize': true
            });

            $.each(obj, function(i, n) {
                var name = n.name;
                var count = n.count;
                var feature = new OpenLayers.Format.WKT().read(n.geometry);
                var ll = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);

                var popupClass = AutoSizeFramedCloud;
                var popupContentHTML = "<div style='width:100px;'> <font color='red'>" + name + " : " + count + "</font><button id='en_detail' class='button green medium' onclick=queryEnByQH('" + name + "')>企业分布</button></div>";
//                addMarker(ll, popupClass, popupContentHTML, true);
//                addMarkerAndPopup(ll,"",popupContentHTML);

                var popup = new OpenLayers.Popup.CSSFramedCloud(
//                popup = new  OpenLayers.Popup.FramedCloud(
                        "pp", ll, null, popupContentHTML, null, false, null);
//                popup.autoSize = true;
//                popup.miniSize= new OpenLayers.Size(20,6);
//                popup.fixedRelativePosition=true;
//                popup.setSize(new OpenLayers.Size(20,6));
//
//                popup.backgroundColor = "none";
                map.addPopup(popup);

            });
            map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 11);
        }
    });


}


/**
 *  园区统计
 * @returns {undefined}
 */
function queryCountServiceByYuanQu() {

    openYQChartDialog('北京园区企业统计');
    selectControl.deactivate();
    cleanMap();
    $.ajax({
        type: "GET",
        url: "http://192.168.1.119:8080/elbs/countservice/yuanqu",
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
            AutoSizeFramedCloud = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
                'autoSize': true
            });

            $.each(obj, function(i, n) {
                var name = n.name;
                var count = n.count;
                var feature = new OpenLayers.Format.WKT().read(n.geometry);
                feature = feature.geometry.getCentroid();
                var ll = new OpenLayers.LonLat(feature.x, feature.y);

                var popupClass = AutoSizeFramedCloud;
                var popupContentHTML = "<div ><font color='blue'>  <label>" + name + " : " + count + "</label></font><button id='en_detail' class='button green medium' onclick=queryEnByYQ('" + name + "')>企业分布</button></div>";
//                addMarker(ll, popupClass, popupContentHTML, true);
//                addMarkerAndPopup(ll,"",popupContentHTML);

                var popup = new OpenLayers.Popup.CSSFramedCloud(
//                popup = new  OpenLayers.Popup.FramedCloud(
                        "pp", ll, null, popupContentHTML, null, false, null);
                popup.autoSize = true;

                popup.backgroundColor = "none";

//                popup.events.register("mouseover", popup, function() {
//                         popup.hide();
//                         popup.show();
//                });
//
//                popup.events.register("mouseout", popup, function() {
//                      
//
//                });



                map.addPopup(popup);

            });

            map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 11);
        }
    });


}


function openHYCharDialog(title) {
    $.dialog({
        id: "hychart",
        title: title,
        content: 'url:jsp/hychart.jsp',
        max: false,
        min: false,
        height: 410,
        width: 608
    });

}

function openQXCharDialog(title) {
    $.dialog({
        id: "qxchart",
        title: title,
        content: 'url:jsp/qxtsbarchar.jsp',
        max: false,
        min: false,
        height: 430,
        width: 810
    });

}

function openJRCharDialog(title) {
    $.dialog({
        id: 'jr',
        title: title,
        content: 'url:jsp/jrchart.jsp',
        max: false,
        min: false,
        height: 410,
        width: 608
    });

}

function openKFCharDialog(title) {
    $.dialog({
        id: 'kf',
        title: title,
        content: 'url:jsp/kfchart.jsp',
        max: false,
        min: false,
        height: 450,
        width: 750
    });

}

function openKFTableDialog(title) {
    $.dialog({
        id: 'kft',
        title: title,
        content: 'url:jsp/kfq.jsp',
        max: false,
        min: false,
        height: 380,
        width: 490,
        padding: 0
    });

}

function openHYTableDialog(title) {
    $.dialog({
        id: 'hyt',
        title: title,
        content: 'url:jsp/hy.jsp',
        max: false,
        min: false,
        height: 380,
        width: 490,
        padding: 0
    });

}

function openJRTableDialog(title) {
    $.dialog({
        id: 'jrgnq',
        title: title,
        content: 'url:jsp/jrgnq.jsp',
        max: false,
        min: false,
        height: 380,
        width: 490,
        padding: 0
    });

}

function openQXTSTableDialog(title) {
    $.dialog({
        id: 'qxts',
        title: title,
        content: 'url:jsp/qxts.jsp',
        max: false,
        min: false,
        height: 380,
        width: 490,
        padding: 0
    });

}


function openYQChartDialog(title) {
    $.dialog({
        id: 'yqc',
        title: title,
        content: 'url:jsp/yqchart.jsp',
        max: false,
        min: false,
        height: 430,
        width: 810,
        padding: 0
    });

}


function openQHChartDialog(title) {
    $.dialog({
        id: 'qhc',
        title: title,
        content: 'url:jsp/qhchart.jsp',
        max: false,
        min: false,
        height: 430,
        width: 810,
        padding: 0
    });

}


function openQHTableDialog(title) {
    $.dialog({
        id: 'qht',
        title: title,
        content: 'url:jsp/qh.jsp',
        max: false,
        min: false,
        height: 380,
        width: 490,
        padding: 0
    });

}

function queryEnByQH(name) {
//        alert(name);
    var url = "http://192.168.1.119:8080/elbs/queryservice/qbyqhname/" + name;
    queryByName(url);

}

function queryEnByYQ(name) {
    var url = "http://192.168.1.119:8080/elbs/queryservice/qbyyqname/" + name;
    queryByName(url);
}

function queryByName(url) {
    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    selectControl.deactivate();
    cleanMap(); //清扫地图
    url = encodeURI(url);
    $.ajax({
        type: "POST",
        url: url,
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
            if (obj) {
                if (obj.length == 0) {
                    $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
                    var timer;
                    $.dialog({
                        id: 'msg',
                        title: '通知',
                        content: '没有查找到您要的结果!',
                        left: '55%',
                        top: '50%',
                        drag: false,
                        resize: false,
                        max: false,
                        min: false,
                        fixed: true
                    });
                    return;
                }
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
                    var tableend = "</table><div align='right'><button id='" + orcode + "'  class='button green medium' name='" + n.name + "' onclick='test2(this)'>详细信息</button></div></div>";

                    var size = new OpenLayers.Size(44, 40);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon("images/marker-gold.png", size, offset);
                    addMarkerAndPopup(lonlat, icon, table + content + tableend);

                }
            });
            map.setCenter(firstLonLat, 11);
//            map.setCenter(new OpenLayers.LonLat(116.39, 39.91), 11);
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
}




/**
 * Function: addMarker
 * Add a new marker to the markers layer given the following lonlat, 
 *     popupClass, and popup contents HTML. Also allow specifying 
 *     whether or not to give the popup a close box.
 * 
 * Parameters:
 * ll - {<OpenLayers.LonLat>} Where to place the marker
 * popupClass - {<OpenLayers.Class>} Which class of popup to bring up 
 *     when the marker is clicked.
 * popupContentHTML - {String} What to put in the popup
 * closeBox - {Boolean} Should popup have a close box?
 * overflow - {Boolean} Let the popup overflow scrollbars?
 */
function addMarker(ll, popupClass, popupContentHTML, closeBox, overflow) {

    var feature = new OpenLayers.Feature(markers, ll);
    feature.closeBox = closeBox;
    feature.popupClass = popupClass;
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = (overflow) ? "auto" : "hidden";

    var marker = feature.createMarker();

    var markerClick = function(evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
//                currentPopup = this.popup;
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    markers.addMarker(marker);
}

function allMarkerShwoPopup() {
    for (var i in map.popups) {
        map.popups[i].show();
        ;
    }
}
