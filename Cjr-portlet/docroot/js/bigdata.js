OpenLayers.ProxyHost = "proxy.jsp?url=";
/**
 * 加载大数据
 * @returns {undefined}
 */
function queryBigData(keyword) {
    cleanMap(); //清扫地图

    var filter = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "type",
        value: keyword,
        projection: "EPSG:4326"
    });
    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://124.205.25.18/beyonserver/wfs",
        featureType: "navi_point",
        featureNS: "http://www.beyondb.com.cn",
        featurePrefix: "beyondb",
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.1.0"
    });
    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    var response = wfsProtocol.read({
        filter: filter,
        callback: function(req) {
//            var count = req.features.length;
//            alert(count);
            clusterVectors.addFeatures(req.features);
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
}

/*function clusterLoadMin() {
    cleanMap(); //清扫地图
    partTitle = "Name_De";//改变window标题

    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://106.37.184.74/beyonserver/beyondb/wfs",
        featureType: "SoftwareCo518_min",
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.0.0"
    });

    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    wfsProtocol.read({
        callback: function(response) {
            clusterVectors_min.addFeatures(response.features);
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
}*/

function clusterLoadAll(feaType) {
    if(feaType == "SoftwareCo518_min"){//如果feature类型是假图换成真图
        feaType = "SoftwareCo518";
    }
    
    var allFilters = [];
    var size = companyNames.length;
    for (var i = 0; i < size; i++) {
        var comparison = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: partTitle,
            value: companyNames[i]
        });

        allFilters.push(comparison);
    }

    var filter = new OpenLayers.Filter.Logical({
        type: OpenLayers.Filter.Logical.OR,
        filters: allFilters
    });

    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://106.37.184.74/beyonserver/beyondb/wfs",
        featureType: feaType,
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.0.0"
    });
    
    $.dialog.tips('查询中...', 600, 'loading.gif');
    wfsProtocol.read({
        filter: filter,
        callback: function(response) {
            var features = response.features;
            var len = features.length;

            for (var i = 0; i < len; i++) {
                var name = "";
                var value = "";
                var group = features[i].attributes[partTitle];
                //var editor = "";
                for (var item in features[i].attributes) {
                    name = item;
                    value = features[i].attributes[item];
                    var r = {"name": name, "value": value, "group": group, "editor": ""};
                    rows.push(r);
                }
            }
            $.dialog.tips('查询完毕!', 1, 'tips.gif');

            $.dialog({
                id: 'propertydlg',
                left: '100%',
                top: 125,
                width: '430px',
                height: '440px',
                title: "属性查询" + "（共" + companyNames.length + "条记录）",
                content: 'url: propertyTable.jsp',
                resize: false,
                max: false,
                min: false
            });
        }
    });
}

//空间相交查询
function intersectsQuery(inputFeature, layerName, value) {
    var filter = new OpenLayers.Filter.Logical({
        type: OpenLayers.Filter.Logical.AND,
        filters: [
            new OpenLayers.Filter.Spatial({
                type: OpenLayers.Filter.Spatial.INTERSECTS,
                value: inputFeature,
                projection: "EPSG:4326"
            }),
            new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "type",
                value: value
            })]
    });

//    filter = new OpenLayers.Filter.Spatial({
//        type: OpenLayers.Filter.Spatial.INTERSECTS,
//        value: inputFeature,
//        projection: "EPSG:4326"
//    });

    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://124.205.25.18/beyonserver/wfs",
        featureType: layerName,
        featureNS: "http://www.beyondb.com.cn",
        featurePrefix: "beyondb",
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.1.0"
    });

    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    var response = wfsProtocol.read({
        filter: filter,
        callback: function(req) {
            var data = req.features;
            for (var i = 0; i < data.length; i++) {
                var feature = data[i];
                var point = feature.geometry;
                var lonlat = new OpenLayers.LonLat(point.components[0].x, point.components[0].y);
                var popupContentHTML = getPopupHtml(feature.data);
                addMarkerAndPopup(lonlat, "搜索结果", popupContentHTML);
            }
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
}

/**
 * 查询poi数据
 * @param {String} keyword
 * @returns {undefined}
 */
function queryPOI(keyword) {

    var filter = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.LIKE,
        property: "name",
        value: "*" + keyword + "*",
        projection: "EPSG:4326"
    });
    var wfsProtocol = new OpenLayers.Protocol.WFS({
        url: "http://124.205.25.18/beyonserver/wfs",
        featureType: "navi_point",
        featureNS: "http://www.beyondb.com.cn",
        featurePrefix: "beyondb",
        srsName: "EPSG:4326",
        geometryName: "the_geom",
        version: "1.1.0"
    });
    $.dialog.tips('正在搜索...', 600, 'loading.gif');
    var response = wfsProtocol.read({
        filter: filter,
        callback: function(req) {
//            vector.addFeatures(req.features);
            $.dialog.tips('搜索完毕!', 1, 'tips.gif');
            var data = req.features;
            for (var i = 0; i < data.length; i++) {
                var feature = data[i];
                var point = feature.geometry;
                var lonlat = new OpenLayers.LonLat(point.components[0].x, point.components[0].y);
                var popupContentHTML = getPopupHtml(feature.data);
                addMarkerAndPopup(lonlat, "搜索结果", popupContentHTML);
            }
        }
    });
}
function queryBySight() {
    cleanMap(); //清扫地图
    var bounds = map.getExtent();
    intersectsQuery(bounds, "navi_point", "80202023");
}
function getPopupHtml(attr) {
    var html = "";
    var buffer = ["<table id='table-properties'>"];
    buffer.push("<tr>");
    buffer.push("<td width='40'>名称:</td><td width='100'>" + attr.name + "</td>");
    buffer.push("</tr>");
    buffer.push("<tr>");
    buffer.push("<td width='40'>拼音:</td><td width='100'>" + attr.pyname + "</td>");
    buffer.push("</tr>");
    buffer.push("</table>");
    html = buffer.join("");
    return html;
}


/**
 *   执行异步查询任务，根据不同的参数执行不同的查询。
 *   keyword: 关键字
 *   prefix: 查询的前缀，用来控制查询那种类型的数据 navi
 *   type： 查询方式，定义查询方式，进行不同的方式查询数据，这个需要谨慎填写，因为不同的查询方式效率不同。qbyName
 *    isFid : 是否使用fid的方式来查询数据。
 */

function ajaxQuery(keyword, prefix, type, isFid) {
    if (isFid) {
        $.post(prefix + "/" + type + ".do?", {
            "fid": keyword
        }, handleFidAjaxQuery, "json");
    } else {
        $.post(prefix + "/" + type + ".do?", {
            "name": keyword
        }, handleAjaxQuery, "json");
    }

}

function handleAjaxQuery(data) {
    if (data) {
        var count = data.length;
        var tbl_body = "";
        var tbl_head = "";
        var tbl_col = "";
        $("#queryRes").empty();
        $("#table-properties tbody").empty();
        $("#table-properties thead").empty();
        $.each(data[0], function(k, v) {
            tbl_col += "<th>" + k + "</th>";
        })
        tbl_head = "<tr>" + tbl_col + "</tr>";
        for (var i = 0; i < count; i++) {

            var json_data = data[i];
            var tbl_row = "";
            var tbl_row2 = "";
            var point = json_data.shape;
            var feature = new OpenLayers.Format.WKT().read(point);
            var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
            lonlat = lonlat.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
            //            vectorLayer.addFeatures([feature]);

            var html = getPopupHtml(json_data);
//            $.each(json_data, function(k, v) {
//                tbl_row += "<td>" + v + "</td>";
//                tbl_row2 += "<table ><tr><td>" + k + "</td> &nbsp &nbsp<td>" + v + "</table></td></tr>";
//            })
            addMarkerAndPopup(lonlat, html);
            tbl_body += "<tr>" + tbl_row + "</tr>";
            if (1 == i) {
                map.moveTo(lonlat, 16, new Object());
            }

        }

        var hddata = $("#table-properties thead").append(tbl_head);
        var bydata = $("#table-properties tbody").append(tbl_body);

        $("#queryRes").append($("#table-properties").html());
        //        $( "#queryRes" ).append(tbl_body);
        $("#queryRes").dialog("open");
    }

}
function excuteLikeQuery(keyword) {
//    alert(keyword);
    ajaxQuery(keyword, "navi", "qbyRegexp", false);
}