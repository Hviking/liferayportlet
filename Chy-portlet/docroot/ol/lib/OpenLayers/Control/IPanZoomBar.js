/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control/IPanZoom.js
 */

/**
 * Class: OpenLayers.Control.IPanZoomBar
 * The IPanZoomBar is a visible control composed of a
 * <OpenLayers.Control.PanPanel> and a <OpenLayers.Control.ZoomBar>. 
 * By default it is displayed in the upper left corner of the map as 4
 * directional arrows above a vertical slider.
 *
 * Inherits from:
 *  - <OpenLayers.Control.IPanZoom>
 */
OpenLayers.Control.IPanZoomBar = OpenLayers.Class(OpenLayers.Control.IPanZoom, {
    /** 
     * APIProperty: zoomStopWidth
     */
    zoomStopWidth: 6,
    /** 
     * APIProperty: zoomStopHeight
     */
    zoomStopHeight: 6,
    /** 
     * Property: slider
     */
    slider: null,
    /** 
     * Property: sliderEvents
     * {<OpenLayers.Events>}
     */
    sliderEvents: null,
    /** 
     * Property: zoombarDiv
     * {DOMElement}
     * 定义了缩放条正常部分的div
     */
    zoombarDiv: null,
    /** 
     * Property: zoombarHighDiv
     * {DOMElement}
     * 定义了缩放条高亮部分的div
     */
    zoombarHighDiv: null,
    /** 
     * APIProperty: zoomWorldIcon
     * {Boolean}
     */
    zoomWorldIcon: true,
    /**
     * APIProperty: panIcons
     * {Boolean} Set this property to false not to display the pan icons. If
     * false the zoom world icon is placed under the zoom bar. Defaults to
     * true.
     */
    panIcons: true,
    /**
     * APIProperty: forceFixedZoomLevel
     * {Boolean} Force a fixed zoom level even though the map has 
     *     fractionalZoom
     */
    forceFixedZoomLevel: false,
    /**
     * Property: mouseDragStart
     * {<OpenLayers.Pixel>}
     */
    mouseDragStart: null,
    /**
     * Property: deltaY
     * {Number} The cumulative vertical pixel offset during a zoom bar drag.
     */
    deltaY: null,
    /**
     * Property: zoomStart
     * {<OpenLayers.Pixel>}
     */
    zoomStart: null,
    /**
     * Constructor: OpenLayers.Control.IPanZoomBar
     */

    /**
     * APIMethod: destroy
     */
    destroy: function() {

        this._removeZoomBar();

        this.map.events.un({
            "changebaselayer": this.redraw,
            "updatesize": this.redraw,
            scope: this
        });

        OpenLayers.Control.IPanZoom.prototype.destroy.apply(this, arguments);

        delete this.mouseDragStart;
        delete this.zoomStart;
    },
    /**
     * Method: setMap
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.IPanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            "changebaselayer": this.redraw,
            "updatesize": this.redraw,
            scope: this
        });
    },
    /** 
     * Method: redraw
     * clear the div and start over.
     */
    redraw: function() {
        if (this.div != null) {
            this.removeButtons();
            this._removeZoomBar();
        }
        this.draw();
    },
    /**
     * Method: draw 
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];

        var sz = {w: 18, h: 18};
        if (this.panIcons) {
            var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
            var wposition = sz.w;

            if (this.zoomWorldIcon) {
                centered = new OpenLayers.Pixel(px.x + sz.w, px.y);
            }

            this._addButton("panup", "north-mini.png", centered, sz);
            px.y = centered.y + sz.h;
            this._addButton("panleft", "west-mini.png", px, sz);
            if (this.zoomWorldIcon) {
                this._addButton("zoomworld", "zoom-world-mini.png", px.add(sz.w, 0), sz);

                wposition *= 2;
            }
            this._addButton("panright", "east-mini.png", px.add(wposition, 0), sz);
            this._addButton("pandown", "south-mini.png", centered.add(0, sz.h * 2), sz);
            this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
            centered = this._addZoomBar(centered.add(sz.w / 3, sz.h * 4 + 5));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
        }
        else {
            this._addButton("zoomin", "zoom-plus-mini.png", px, sz);
            centered = this._addZoomBar(px.add(0, sz.h));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
            if (this.zoomWorldIcon) {
                centered = centered.add(0, sz.h + 3);
                this._addButton("zoomworld", "zoom-world-mini.png", centered, sz);
            }
        }
        return this.div;
    },
    /** 
     * Method: _addZoomBar
     * 
     * Parameters:
     * centered - {<OpenLayers.Pixel>} where zoombar drawing is to start.
     * 增加缩放条函数，创建了三个div，分别是sliderdiv（对应成员变量slider）、divTop（对应成员变量zoombarDiv）、
     * divBottom（对应成员变量zoombarHighDiv），并将这三个div插入至this.div中
     */
    _addZoomBar: function(centered) {
        //创建sliderdiv
        var imgLocation = OpenLayers.Util.getImageLocation("slider.png");
        var id = this.id + "_" + this.map.id;
        var minZoom = this.map.getMinZoom();
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var sliderdiv = OpenLayers.Util.createAlphaImageDiv(id,
                centered.add(-6, zoomsToEnd * this.zoomStopHeight),
                {w: 18, h: 10},
        imgLocation,
                "absolute");
        sliderdiv.style.cursor = "move";
        this.slider = sliderdiv;

        this.sliderEvents = new OpenLayers.Events(this, sliderdiv, null, true,
                {includeXY: true});
        this.sliderEvents.on({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        
        //创建divTop
        var sz = {
            w: this.zoomStopWidth,
            h: this.zoomStopHeight * (this.map.getNumZoomLevels() - this.map.getZoom() - 1)
        };
        var imgLocation1 = OpenLayers.Util.getImageLocation("zoombar.png");
        var divTop = null;

        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            divTop = OpenLayers.Util.createAlphaImageDiv(id, centered,
                    {w: sz.w, h: this.zoomStopHeight},
            imgLocation1,
                    "absolute", null, "crop");
            divTop.style.height = sz.h + "px";
        } else {
            divTop = OpenLayers.Util.createDiv(
                    'OpenLayers_Control_IPanZoomBar_Zoombar' + this.map.id,
                    centered,
                    sz,
                    imgLocation1);
        }
        divTop.style.cursor = "pointer";
        divTop.className = "olButton";
        this.zoombarDiv = divTop;

        //创建divBottom
        var szBottom = {
            w: this.zoomStopWidth,
            h: this.zoomStopHeight * (this.map.getZoom() + 1 - minZoom)
        };
        var imgLocation2 = OpenLayers.Util.getImageLocation("zoombarhighlight.png");
        var divBottom = null;
        var centered2 = centered.add(0, (this.map.getNumZoomLevels() - this.map.getZoom()) * this.zoomStopHeight);
        if (OpenLayers.Util.alphaHack()) {
            var id2 = "zoombarhighlight" + "_" + divTop.id;
            divBottom = OpenLayers.Util.createAlphaImageDiv(id2, centered2,
                    {w: szBottom.w, h: this.zoomStopHeight},
            imgLocation2,
                    "absolute", null, "crop");
            divBottom.style.height = szBottom.h + "px";
        } else {
            divBottom = OpenLayers.Util.createDiv(
                    'OpenLayers_Control_IPanZoomBar_Zoombarhighlight' + this.map.id,
                    centered2,
                    szBottom,
                    imgLocation2);
        }
        divBottom.style.cursor = "pointer";
        divBottom.className = "olButton";
        this.zoombarHighDiv = divBottom;

        //将以上三个div插入至this.div中
        this.div.appendChild(this.zoombarDiv);
        this.div.appendChild(this.zoombarHighDiv);

        this.startTop = parseInt(divTop.style.top);

        this.div.appendChild(sliderdiv);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(-6,
                this.zoomStopHeight * (this.map.getNumZoomLevels() + 1 - minZoom));
        return centered;
    },
    /**
     * Method: _removeZoomBar
     */
    _removeZoomBar: function() {
        this.sliderEvents.un({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        this.sliderEvents.destroy();

        this.div.removeChild(this.zoombarDiv);
        this.zoombarDiv = null;
        this.div.removeChild(this.zoombarHighDiv);
        this.zoombarHighDiv = null;
        this.div.removeChild(this.slider);
        this.slider = null;

        this.map.events.unregister("zoomend", this, this.moveZoomBar);
    },
    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     * 定义了zoombarDiv和zoombarHighDiv两个元素的click函数
     */
    onButtonClick: function(evt) {
        OpenLayers.Control.IPanZoom.prototype.onButtonClick.apply(this, arguments);
        if (evt.buttonElement === this.zoombarDiv) {
            var levels = evt.buttonXY.y / this.zoomStopHeight;
            if (this.forceFixedZoomLevel || !this.map.fractionalZoom) {
                levels = Math.floor(levels);
            }
            var zoom = (this.map.getNumZoomLevels() - 1) - levels;
            zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
            this.map.zoomTo(zoom);
        }
        if (evt.buttonElement === this.zoombarHighDiv) {
            var levels = evt.buttonXY.y / this.zoomStopHeight;
            if (this.forceFixedZoomLevel || !this.map.fractionalZoom) {
                levels = Math.floor(levels);
            }
            var zoom = this.map.getZoom() + 1 - levels;
            zoom = Math.min(Math.max(zoom, 0), this.map.getZoom());
            this.map.zoomTo(zoom);
        }
    },
    /**
     * Method: passEventToSlider
     * This function is used to pass events that happen on the div, or the map,
     * through to the slider, which then does its moving thing.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    passEventToSlider: function(evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    /*
     * Method: zoomBarDown
     * event listener for clicks on the slider
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarDown: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.map.events.on({
            "touchmove": this.passEventToSlider,
            "mousemove": this.passEventToSlider,
            "mouseup": this.passEventToSlider,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        // reset the div offsets just in case the div moved
        this.zoombarDiv.offsets = null;
        this.zoombarHighDiv.offsets = null;
        OpenLayers.Event.stop(evt);
    },
    /*
     * Method: zoomBarDrag
     * This is what happens when a click has occurred, and the client is
     * dragging.  Here we must ensure that the slider doesn't go beyond the
     * bottom/top of the zoombar div, as well as moving the slider to its new
     * visual location
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     * 定义了slider的拖拽函数，此函数和zoombarDiv、zoombarHighDiv两个元素密切相关
     */
    zoomBarDrag: function(evt) {
        if (this.mouseDragStart !== null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsetsTop = OpenLayers.Util.pagePosition(this.zoombarDiv);
            var offsetsBottom = OpenLayers.Util.pagePosition(this.zoombarHighDiv);
            //如果slider是被向上拖拽
            if (deltaY > 0) {
                if ((evt.clientY - offsetsTop[1]) > 2 &&
                        (evt.clientY - offsetsTop[1]) < parseInt(this.zoombarDiv.style.height)) {
                    var newTop = parseInt(this.slider.style.top) - deltaY;
                    this.slider.style.top = newTop + "px";
                    this.mouseDragStart = evt.xy.clone();
                    
                    //设置zoombarDiv、zoombarHighDiv两个元素位置、高度
                    this.zoombarDiv.style.height = parseInt(this.zoombarDiv.style.height) - deltaY + "px";
                    this.zoombarHighDiv.style.top = parseInt(this.zoombarHighDiv.style.top) - deltaY + "px";
                    this.zoombarHighDiv.style.height = parseInt(this.zoombarHighDiv.style.height) + deltaY + "px";
                }
                //如果slider被拖拽的垂直方向位置小于缩放条
                if (evt.clientY < offsetsTop[1])
                {
                    this.map.zoomTo(this.map.getNumZoomLevels() - 1);
                    OpenLayers.Event.stop(evt);
                    return;
                }
            } else {
                if ((evt.clientY - offsetsBottom[1]) > 0 &&
                        (evt.clientY - offsetsBottom[1]) < parseInt(this.zoombarHighDiv.style.height) - 2) {
                    var newTop = parseInt(this.slider.style.top) - deltaY;
                    this.slider.style.top = newTop + "px";
                    this.mouseDragStart = evt.xy.clone();
                    
                    //设置zoombarDiv、zoombarHighDiv两个元素位置、高度
                    this.zoombarDiv.style.height = parseInt(this.zoombarDiv.style.height) - deltaY + "px";
                    this.zoombarHighDiv.style.top = parseInt(this.zoombarHighDiv.style.top) - deltaY + "px";
                    this.zoombarHighDiv.style.height = parseInt(this.zoombarHighDiv.style.height) + deltaY + "px";
                }
            }

            // set cumulative displacement
            this.deltaY = this.zoomStart.y - evt.xy.y;
            OpenLayers.Event.stop(evt);
        }
    },
    /*
     * Method: zoomBarUp
     * Perform cleanup when a mouseup event is received -- discover new zoom
     * level and switch to it.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarUp: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") {
            return;
        }
        if (this.mouseDragStart) {
            this.div.style.cursor = "";
            this.map.events.un({
                "touchmove": this.passEventToSlider,
                "mouseup": this.passEventToSlider,
                "mousemove": this.passEventToSlider,
                scope: this
            });
            var zoomLevel = this.map.zoom;
            if (!this.forceFixedZoomLevel && this.map.fractionalZoom) {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0),
                        this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.max(Math.round(zoomLevel), 0);
            }
            this.map.zoomTo(zoomLevel);
            this.mouseDragStart = null;
            this.zoomStart = null;
            this.deltaY = 0;
            OpenLayers.Event.stop(evt);
        }
    },
    /*
     * Method: moveZoomBar
     * Change the location of the slider to match the current zoom level.
     */
    moveZoomBar: function() {
        var newTop =
                ((this.map.getNumZoomLevels() - 1) - this.map.getZoom()) *
                this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
        
        //设置zoombarDiv、zoombarHighDiv两个元素位置、高度
        this.zoombarDiv.style.height = this.zoomStopHeight * (this.map.getNumZoomLevels() - 1 - this.map.getZoom()) + "px";
        this.zoombarHighDiv.style.top = newTop + "px";
        //注意此处需要考虑slider所占高度，故缩放条实际高度是大于理论上应该设定的高度的
        this.zoombarHighDiv.style.height = this.zoomStopHeight * (this.map.getZoom() + 2 - this.map.getMinZoom()) + "px";
    },
    CLASS_NAME: "OpenLayers.Control.IPanZoomBar"
});