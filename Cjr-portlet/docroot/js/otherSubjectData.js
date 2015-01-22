/*
 * 其他专题信息加载
 */

var partTitle = null;//根据不同专题设置标题
var sharedFeaType = "SoftwareCo518_min";


//专题信息展示通用方法
function showSubjectInfo(feaType,geoName,eachPartTitle){
    cleanMap(); //清扫地图
    partTitle = eachPartTitle;//改变window标题
    sharedFeaType = feaType;
    selectControl.activate();
    var wfsProtocol = new OpenLayers.Protocol.WFS({
//        url: "http://192.168.169.174/beyonserver/beyondb/wfs",
        url: "http://106.37.184.74/beyonserver/beyondb/wfs",
        featureType: feaType,
        srsName: "EPSG:4326",
        geometryName: geoName,
        version: "1.0.0"
    });
    $.dialog.tips('数据加载中...', 600, 'loading.gif');
    wfsProtocol.read({
        callback: function(response) {
            clusterVectors_min.addFeatures(response.features);
            $.dialog.tips('数据加载完毕!', 1, 'tips.gif');
        }
    });
    
}



