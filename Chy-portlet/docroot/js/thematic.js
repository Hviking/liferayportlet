function addThematicsOnMap() {
    cleanMap(); //清扫地图

    var lonlat;
    var tdata;
    for (var i = 0; i < 4; i++) {
        switch (i) {
            case 0:
                lonlat = new OpenLayers.LonLat(116.37785, 39.9364);
                tdata = [
                    ['火狐浏览器', 45.0],
                    ['IE浏览器', 26.8],
                    {
                        name: '谷歌浏览器',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['苹果浏览器', 8.5],
                    ['欧朋浏览器', 6.2],
                    ['其他', 0.7]
                ];
                break;
            case 1:
                lonlat = new OpenLayers.LonLat(126.67, 45.80);
                tdata = [
                    ['火狐浏览器', 25.0],
                    ['IE浏览器', 46.8],
                    {
                        name: '谷歌浏览器',
                        y: 2.8,
                        sliced: true,
                        selected: true
                    },
                    ['苹果浏览器', 18.5],
                    ['欧朋浏览器', 6.2],
                    ['其他', 0.7]
                ];
                break;
            case 2:
                lonlat = new OpenLayers.LonLat(106.30, 31.87);
                tdata = [
                    ['火狐浏览器', 35.0],
                    ['IE浏览器', 36.8],
                    {
                        name: '谷歌浏览器',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['苹果浏览器', 8.5],
                    ['欧朋浏览器', 6.2],
                    ['其他', 0.7]
                ];
                break;
            case 3:
                lonlat = new OpenLayers.LonLat(116.82, 28.74);
                tdata = [
                    ['火狐浏览器', 30.0],
                    ['IE浏览器', 31.8],
                    {
                        name: '谷歌浏览器',
                        y: 22.8,
                        sliced: true,
                        selected: true
                    },
                    ['苹果浏览器', 8.5],
                    ['欧朋浏览器', 6.2],
                    ['其他', 0.7]
                ];
                break;
        }
        addThematicsPie(lonlat, null, "", true, true, tdata);
    }
}
var Divid = "";
function addThematicsPie(ll, popupClass, popupContentHTML, closeBox, overflow, tdata) {

    var feature = new OpenLayers.newFeature(markers, ll);
    feature.closeBox = closeBox;
    feature.popupClass = popupClass;
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = (overflow) ? "auto" : "hidden";

    var marker = feature.createMarker();

//    var markerClick = function(evt) {
//        if (this.popup === null) {
//            this.popup = this.createPopup(this.closeBox);
//            map.addPopup(this.popup);
//            this.popup.show();
//        } else {
//            this.popup.toggle();
//        }
//        currentPopup = this.popup;
//        OpenLayers.Event.stop(evt);
//    };
//    marker.events.register("mousedown", feature, markerClick);
    markers.addMarker(marker);
//    var oo=document.getElementById(Divid);
    drawPie(Divid, tdata);
    map.zoomToExtent(new OpenLayers.Bounds(85.1420, 24.3848, 136.9535, 49.8731));
}
//     58124  14890  57860
OpenLayers.newFeature = OpenLayers.Class({
    /** 
     * Property: layer 
     * {<OpenLayers.Layer>} 
     */
    layer: null,
    /** 
     * Property: id 
     * {String} 
     */
    id: null,
    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} 
     */
    lonlat: null,
    /** 
     * Property: data 
     * {Object} 
     */
    data: null,
    /** 
     * Property: marker 
     * {<OpenLayers.Marker>} 
     */
    marker: null,
    /**
     * APIProperty: popupClass
     * {<OpenLayers.Class>} The class which will be used to instantiate
     *     a new Popup. Default is <OpenLayers.Popup.Anchored>.
     */
    popupClass: null,
    /** 
     * Property: popup 
     * {<OpenLayers.Popup>} 
     */
    popup: null,
    /** 
     * Constructor: OpenLayers.Feature
     * Constructor for features.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer>} 
     * lonlat - {<OpenLayers.LonLat>} 
     * data - {Object} 
     * 
     * Returns:
     * {<OpenLayers.Feature>}
     */
    initialize: function(layer, lonlat, data) {
        this.layer = layer;
        this.lonlat = lonlat;
        this.data = (data != null) ? data : {};
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    /** 
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {

        //remove the popup from the map
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }
        // remove the marker from the layer
        if (this.layer != null && this.marker != null) {
            this.layer.removeMarker(this.marker);
        }

        this.layer = null;
        this.id = null;
        this.lonlat = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
    },
    /**
     * Method: onScreen
     * 
     * Returns:
     * {Boolean} Whether or not the feature is currently visible on screen
     *           (based on its 'lonlat' property)
     */
    onScreen: function() {

        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },
    /**
     * Method: createMarker
     * Based on the data associated with the Feature, create and return a marker object.
     *
     * Returns: 
     * {<OpenLayers.Marker>} A Marker Object created from the 'lonlat' and 'icon' properties
     *          set in this.data. If no 'lonlat' is set, returns null. If no
     *          'icon' is set, OpenLayers.Marker() will load the default image.
     *          
     *          Note - this.marker is set to return value
     * 
     */
    createMarker: function() {

        if (this.lonlat != null) {
            var size = new OpenLayers.Size(400, 400);
            var icon = new OpenLayers.TIcon("image/eee.png", size);
            this.marker = new OpenLayers.newMarker(this.lonlat, icon);
            Divid = icon.imageDiv.id;
        }
        return this.marker;
    },
    /**
     * Method: destroyMarker
     * Destroys marker.
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        this.marker.destroy();
    },
    /**
     * Method: createPopup
     * Creates a popup object created from the 'lonlat', 'popupSize',
     *     and 'popupContentHTML' properties set in this.data. It uses
     *     this.marker.icon as default anchor. 
     *  
     *  If no 'lonlat' is set, returns null. 
     *  If no this.marker has been created, no anchor is sent.
     *
     *  Note - the returned popup object is 'owned' by the feature, so you
     *      cannot use the popup's destroy method to discard the popup.
     *      Instead, you must use the feature's destroyPopup
     * 
     *  Note - this.popup is set to return value
     * 
     * Parameters: 
     * closeBox - {Boolean} create popup with closebox or not
     * 
     * Returns:
     * {<OpenLayers.Popup>} Returns the created popup, which is also set
     *     as 'popup' property of this feature. Will be of whatever type
     *     specified by this feature's 'popupClass' property, but must be
     *     of type <OpenLayers.Popup>.
     * 
     */
    createPopup: function(closeBox) {

        if (this.lonlat != null) {
            if (!this.popup) {
                var anchor = (this.marker) ? this.marker.icon : null;
                var popupClass = this.popupClass ?
                        this.popupClass : OpenLayers.Popup.Anchored;
                this.popup = new popupClass(this.id + "_popup",
                        this.lonlat,
                        this.data.popupSize,
                        this.data.popupContentHTML,
                        anchor,
                        closeBox);
            }
            if (this.data.overflow != null) {
                this.popup.contentDiv.style.overflow = this.data.overflow;
            }

            this.popup.feature = this;
        }
        return this.popup;
    },
    /**
     * Method: destroyPopup
     * Destroys the popup created via createPopup.
     *
     * As with the marker, if user overrides the createPopup() function, s/he 
     *   should also be able to override the destruction
     */
    destroyPopup: function() {
        if (this.popup) {
            this.popup.feature = null;
            this.popup.destroy();
            this.popup = null;
        }
    },
    CLASS_NAME: "OpenLayers.newFeature"
});

OpenLayers.newMarker = OpenLayers.Class({
    /** 
     * Property: icon 
     * {<OpenLayers.Icon>} The icon used by this marker.
     */
    icon: null,
    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} location of object
     */
    lonlat: null,
    /** 
     * Property: events 
     * {<OpenLayers.Events>} the event handler.
     */
    events: null,
    /** 
     * Property: map 
     * {<OpenLayers.Map>} the map this marker is attached to
     */
    map: null,
    /** 
     * Constructor: OpenLayers.Marker
     *
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} the position of this marker
     * icon - {<OpenLayers.Icon>}  the icon for this marker
     */
    initialize: function(lonlat, icon) {
        this.lonlat = lonlat;

        var newIcon = (icon) ? icon : OpenLayers.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new OpenLayers.Events(this, this.icon.imageDiv);
    },
    /**
     * APIMethod: destroy
     * Destroy the marker. You must first remove the marker from any 
     * layer which it has been added to, or you will get buggy behavior.
     * (This can not be done within the marker since the marker does not
     * know which layer it is attached to.)
     */
    destroy: function() {
        // erase any drawn features
        this.erase();

        this.map = null;

        this.events.destroy();
        this.events = null;

        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    /** 
     * Method: draw
     * Calls draw on the icon, and returns that output.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {DOMElement} A new DOM Image with this marker's icon set at the 
     * location passed-in
     */
    draw: function(px) {
        return this.icon.draw(px);
    },
    /** 
     * Method: erase
     * Erases any drawn elements for this marker.
     */
    erase: function() {
        if (this.icon != null) {
            this.icon.erase();
        }
    },
    /**
     * Method: moveTo
     * Move the marker to the new location.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
     * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
     */
    moveTo: function(px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },
    /**
     * APIMethod: isDrawn
     * 
     * Returns:
     * {Boolean} Whether or not the marker is drawn.
     */
    isDrawn: function() {
        var isDrawn = (this.icon && this.icon.isDrawn());
        return isDrawn;
    },
    /**
     * Method: onScreen
     *
     * Returns:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen: function() {

        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },
    /**
     * Method: inflate
     * Englarges the markers icon by the specified ratio.
     *
     * Parameters:
     * inflate - {float} the ratio to enlarge the marker by (passing 2
     *                   will double the size).
     */
    inflate: function(inflate) {
        if (this.icon) {
            this.icon.setSize({
                w: this.icon.size.w * inflate,
                h: this.icon.size.h * inflate
            });
        }
    },
    /** 
     * Method: setOpacity
     * Change the opacity of the marker by changin the opacity of 
     *   its icon
     * 
     * Parameters:
     * opacity - {float}  Specified as fraction (0.4, etc)
     */
    setOpacity: function(opacity) {
        this.icon.setOpacity(opacity);
    },
    /**
     * Method: setUrl
     * Change URL of the Icon Image.
     * 
     * url - {String} 
     */
    setUrl: function(url) {
        this.icon.setUrl(url);
    },
    /** 
     * Method: display
     * Hide or show the icon
     * 
     * display - {Boolean} 
     */
    display: function(display) {
        this.icon.display(display);
    },
    CLASS_NAME: "OpenLayers.newMarker"
});

OpenLayers.TIcon = OpenLayers.Class({
    /** 
     * Property: url 
     * {String}  image url
     */
    url: null,
    /** 
     * Property: size 
     * {<OpenLayers.Size>|Object} An OpenLayers.Size or
     * an object with a 'w' and 'h' properties.
     */
    size: null,
    /** 
     * Property: offset 
     * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
     * image when being rendered. An OpenLayers.Pixel or an object
     * with a 'x' and 'y' properties.
     */
    offset: null,
    /** 
     * Property: calculateOffset 
     * {Function} Function to calculate the offset (based on the size)
     */
    calculateOffset: null,
    /** 
     * Property: imageDiv 
     * {DOMElement} 
     */
    imageDiv: null,
    /** 
     * Property: px 
     * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
     * with a 'x' and 'y' properties.
     */
    px: null,
    /** 
     * Constructor: OpenLayers.Icon
     * Creates an icon, which is an image tag in a div.  
     *
     * url - {String} 
     * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or an
     *                                   object with a 'w' and 'h'
     *                                   properties.
     * offset - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
     *                                      object with a 'x' and 'y'
     *                                      properties.
     * calculateOffset - {Function} 
     */
    initialize: function(url, size, offset, calculateOffset) {
        this.url = url;
        this.size = size || {w: 20, h: 20};
        this.offset = offset || {x: -(this.size.w / 2), y: -(this.size.h / 2)};
        this.calculateOffset = calculateOffset;

        var id = OpenLayers.Util.createUniqueID("OL_Icon_");
        this.imageDiv = OpenLayers.Util.createAlphaImageDiv1(id);
    },
    /** 
     * Method: destroy
     * Nullify references and remove event listeners to prevent circular 
     * references and memory leaks
     */
    destroy: function() {
        // erase any drawn elements
        this.erase();

        OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
        this.imageDiv.innerHTML = "";
        this.imageDiv = null;
    },
    /** 
     * Method: clone
     * 
     * Returns:
     * {<OpenLayers.Icon>} A fresh copy of the icon.
     */
    clone: function() {
        return new OpenLayers.Icon(this.url,
                this.size,
                this.offset,
                this.calculateOffset);
    },
    /**
     * Method: setSize
     * 
     * Parameters:
     * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or
     * an object with a 'w' and 'h' properties.
     */
    setSize: function(size) {
        if (size != null) {
            this.size = size;
        }
        this.draw();
    },
    /**
     * Method: setUrl
     * 
     * Parameters:
     * url - {String} 
     */
    setUrl: function(url) {
        if (url != null) {
            this.url = url;
        }
        this.draw();
    },
    /** 
     * Method: draw
     * Move the div to the given pixel.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
     *                                  object with a 'x' and 'y' properties.
     * 
     * Returns:
     * {DOMElement} A new DOM Image of this icon set at the location passed-in
     */
    draw: function(px) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,
                null,
                null,
                this.size,
                this.url,
                "absolute");
        this.moveTo(px);
        return this.imageDiv;
    },
    /** 
     * Method: erase
     * Erase the underlying image element.
     */
    erase: function() {
        if (this.imageDiv != null && this.imageDiv.parentNode != null) {
            OpenLayers.Element.remove(this.imageDiv);
        }
   },
    /** 
     * Method: setOpacity
     * Change the icon's opacity
     *
     * Parameters:
     * opacity - {float} 
     */
    setOpacity: function(opacity) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null,
                null, null, null, null, opacity);

    },
    /**
     * Method: moveTo
     * move icon to passed in px.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
     * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
     */
    moveTo: function(px) {
        //if no px passed in, use stored location
        if (px != null) {
            this.px = px;
        }

        if (this.imageDiv != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);
                }
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                    x: this.px.x + this.offset.x,
                    y: this.px.y + this.offset.y
                });
            }
        }
    },
    /** 
     * Method: display
     * Hide or show the icon
     *
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.imageDiv.style.display = (display) ? "" : "none";
    },
    /**
     * APIMethod: isDrawn
     * 
     * Returns:
     * {Boolean} Whether or not the icon is drawn.
     */
    isDrawn: function() {
        // nodeType 11 for ie, whose nodes *always* have a parentNode
        // (of type document fragment)
        var isDrawn = (this.imageDiv && this.imageDiv.parentNode &&
                (this.imageDiv.parentNode.nodeType != 11));

        return isDrawn;
    },
    CLASS_NAME: "OpenLayers.TIcon"
});
OpenLayers.Util.createAlphaImageDiv1 = function(id, px, sz, imgURL,
        position, border, sizing,
        opacity, delayDisplay) {

    var div = OpenLayers.Util.createDiv();
//    var div = document.createElement('div'); //创建div //newdiv没加var是全局变量 下个方法还可以使用该变量
//    div.id = divid;
//    Divid=div.id;
//    div.style.width = '300px';
//    div.style.height = '300px';
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null,
            null, delayDisplay);
    img.className = "olAlphaImg";
    div.appendChild(img);

    OpenLayers.Util.modifyAlphaImageDiv1(div, id, px, sz, imgURL, position,
            border, sizing, opacity);

    return div;
};
OpenLayers.Util.modifyAlphaImageDiv1 = function(div, id, px, sz, imgURL,
        position, border, sizing,
        opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz, position,
            null, null, opacity);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz,
            "relative", border);

    if (OpenLayers.Util.alphaHack()) {
        if (div.style.display != "none") {
            div.style.display = "inline-block";
        }
        if (sizing == null) {
            sizing = "scale";
        }

        div.style.filter = "progid:DXImageTransform.Microsoft" +
                ".AlphaImageLoader(src='" + img.src + "', " +
                "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 &&
                parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "alpha(opacity=0)";
    }
};
function drawPie(id, tdata) {
//    alert(id);
//    var targetid=id.split("#")[1];
    $('#' + id).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'rgba(0,0,0,0)'
        },
        title: {
            text: ''
        },
        tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

        },
        exporting: {
            enabled: false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
                type: 'pie',
                name: '占有率',
                data: tdata

            }]
    });
}