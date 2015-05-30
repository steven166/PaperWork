/**
 * Material Framework
 * @type {{colors: {assoc}, loaded: boolean}}
 */
var paper = {

    version: 0.01,

    /**
     * Predefined Colors
     */
    colors: {
        red: "#F44336",
        pink: "#E91E63",
        purple: "#9C27B0",
        'deep-purple': "#673AB7",
        indigo: "#3F51B5",
        blue: "#2196F3",
        'light-blue': "#03A9F4",
        cyan: "#00BCD4",
        teal: "#009688",
        green: "#4CAF50",
        'light-green': "#8BC34A",
        lime: "#CDDC39",
        yellow: "#FFEB3B",
        amber: "#FFC107",
        orange: "#FF9800",
        'deep-orange': "#FF5722",
        brown: "#795548",
        gray: "#9E9E9E",
        'dark-gray': "#333333",
        'light-gray': "#CCCCCC",
        'blue-gray': "#607D8B",
        black: "black",
        white: "white",
        transparent: "rgba(0,0,0,0)"
    },

    ready: false,

    /**
     * If page is fully loaded true, if not loaded false
     */
    loaded: false
};

(function(){

    //Check dependency
    if(typeof($) === "undefined"){
        console.error("\'paper\' dependence on JQuery");
    }

    //Watch loading
    $(window).load(function(){
        paper.loaded = true;
        $(".paper-startup").fadeOut(200, function(){
            $(this).remove();
        });
    });

    //Cookie library
    paper.cookie = {
        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    paper.toNormalText = function(text){
        var normalText = text.replace("-", " ");
        return paper.uppercaseWord(normalText);
    };

    paper.uppercaseFirst = function(text){
        return text.substring(0,1).toUpperCase() + text.substring(1).toLowerCase();
    };

    paper.uppercaseWord = function(text){
        var out = "";
        var words = text.split(" ");
        for(var i = 0; i < words.length; i++){
            if(out !== ""){
                out += " ";
            }
            out += paper.uppercaseFirst(words[i]);
        }
        return out;
    };

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-wrippels\' dependence on \'paper\'");
    }

    paper.wrippels = {

        version: 0.01,

        isLightBackground: function(comp) {
            try {
                if($(comp).attr("bg") === "light"){
                    return true;
                }
                if($(comp).attr("bg") === "dark"){
                    return false;
                }

                var bg = $(comp).css("background-color");
                if (bg === "transparent") {
                    return paper.wrippels.isLightBackground($(comp).parent());
                } else if (bg.indexOf("rgba") == 0) {
                    bg = bg.substring(5, bg.length - 1);
                    var clrs = bg.split(",");
                    if (parseInt(clrs[3]) == 0) {
                        return paper.wrippels.isLightBackground($(comp).parent());
                    } else {
                        return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 130;
                    }
                } else {
                    bg = bg.substring(4, bg.length - 1);
                    var clrs = bg.split(",");
                    return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 130;
                }
            } catch (e) {
                console.error(e);
                return true;
            }
        },

        setWrippels: function(element){
            $(element).addClass("wrippels");
        },

        removeWrippels: function(element){
            $(element).removeClass("wrippels");
        }

    };

    var mouseDown = function (event) {
        var tthis = this;
        //calc size
        var w = $(tthis).width();
        w += parseInt($(tthis).css("padding-left"));
        w += parseInt($(tthis).css("padding-right"));
        var h = $(tthis).height();
        h += parseInt($(tthis).css("padding-top"));
        h += parseInt($(tthis).css("padding-bottom"));
        var size = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 2;

        //calc pos
        var offset = $(tthis).offset();
        var x = Math.round(event.pageX - offset.left) - size / 2;
        var y = Math.round(event.pageY - offset.top) - size / 2;

        //find background
        var isLight = paper.wrippels.isLightBackground(tthis);
        var cls = "overlay" + (isLight ? " dark" : "");

        var html = "<div class='" + cls + "' style='width: " + size + "px; height: " + size + "px; top: " + y + "px; left: " + x + "px;'/>";
        var overlay = $(html).appendTo(tthis);
        setTimeout(function () {
            var tick = 0;
            var interval = window.setInterval(function () {
                tick++;
                var scale = tick / 100;
                overlay.css("transform", "scale(" + scale + "," + scale + ")");
                if (overlay.hasClass("wrippel-expand")) {
                    overlay.css("transform", "");
                    window.clearInterval(interval);
                }
                if (tick == 100) {
                    window.clearInterval(interval);
                }
            }, 20);
        }, 10);
    };

    var mouseUp = function (e) {
        var tthis = this;
        var overlay = $(tthis).children(".overlay");
        overlay.addClass("wrippel-ani");
        setTimeout(function () {
            overlay.addClass("wrippel-expand");
            setTimeout(function () {
                overlay.addClass("wrippel-hide");
                setTimeout(function () {
                    overlay.remove();
                }, 300);
            }, 200);
        }, 10);
    };

    //if (paper.isTouchDevice) {
    //    $("body").on("touchstart, mousedown", ".wrippels", mouseDown);
    //    $("body").on("touchend, mouseup, blur, click", ".wrippels", mouseUp);
    //    $("body").on("touchmove", ".wrippels", mouseUp);
    //} else {
        $("body").on("mousedown", ".wrippels:not(.touchonly)", mouseDown);
        $("body").on("mouseup, blur, click", ".wrippels:not(.touchonly)", mouseUp);
        $("body").on("mousemove", ".wrippels:not(.touchonly)", mouseUp);
    //}
})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }

    /**
     * Material List Framework
     * @type {{version: number, create: Function}}
     */
    paper.list = {

        version: 0.01,

        create: function(element, render){
            return new List(element, render);
        }

    };

    function List(element, render){
        this.element = $(element);
        this.renderFunction = render;
    }

    List.prototype.setRender = function(func){
        this.renderFunction = func;
    };

    List.prototype.append = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        doRender(tthis, eList, array, timeout);
    };

    List.prototype.render = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        if(eList.children().length > 0){
            eList.children().addClass("fade");
            setTimeout(function(){
                eList.children().remove();
                doRender(tthis, eList, array, timeout);
            }, 200);
        }else{
            doRender(tthis, eList, array, timeout);
        }
    };

    function doRender(list, eList, array, timeout){
        if(Array.isArray(array)){
            for(var i = 0; i < array.length; i++){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, array[i], false);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
            }
        }else if(!isNumeric(array)){
            for(var key in array){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, key, true);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
                var subArray = array[key];
                for(var i = 0; i < subArray.length; i++){
                    var li2 = $("<li></li>");
                    var ret = list.renderFunction(li2, subArray[i], false);
                    if(ret !== false) {
                        li2.addClass("fade");
                        li2.appendTo(eList);
                    }
                }
            }
        }else{
            throw "Can only render arrays and associative arrays";
        }

        var t = 70;
        if(typeof(timeout) !== "undefined"){
            t = timeout;
        }

        setTimeout(function(){
            var interval = setInterval(function(){
                eList.children(".fade").first().removeClass("fade");
                if(eList.children(".fade").length == 0){
                    clearInterval(interval);
                }
            }, t);
        }, 20);

    }

    function isNumeric(obj) {
        try {
            return (((obj - 0) == obj) && (obj.length > 0));
        } catch (e) {
            return false;
        }
    }

})();
(function () {
    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-header\' dependence on \'paper\'");
    }

    /**
     * Material Header Framework
     * @type {{create: Function, render: Function, attach: Function, update: Function}}
     */
    paper.header = {

        version: 0.01,

        /**
         * Create new header object
         * @param  {{title: string, icon: string, leftAction: null | 'menu' | 'back', actions: [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}]}} options -
         * @returns {Header}
         */
        create: function(options) {
            return new Header(options);
        },

        /**
         * Render the object to jQuery
         * @param {Header} header
         * @returns {jQuery}
         */
        render: function (header) {
            var eHeader = $("<div class='paper-header'></div>");
            eHeader.addClass(header.getColor());
            if(header.getTitle() !== null || (header.getIcon() !== null || header.getLeftAction() !== null)){
                var leftAction = $("<div class='left-action'></div>").appendTo(eHeader);
                if(header.getIcon() != null || header.getLeftAction() != null || header.getSource() != null) {
                    var icon = $("<div class='icon wrippels'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div>").appendTo(leftAction);
                    if (header.getLeftAction() !== null) {
                        icon.addClass("action-" + header.getLeftAction()).addClass("wrippels");
                    } else {
                        var icon_i = $("<i></i>").addClass(header.getIcon()).appendTo(icon);
                        if (header.getSource() != null) {
                            icon_i.css("background-image", "url(" + header.getSource() + ")");
                        }
                    }
                }
                if(header.getTitle() !== null) {
                    var key = header.getTitle();
                    var value = key;
                    var attr = "";
                    if(typeof(paper.lang) !== "undefined"){
                        value = paper.lang.replace(key);
                        if(value !== key){
                            attr = " lang-key='" + paper.lang.extractKey(key) + "'";
                        }
                    }
                    var title = $("<div class='title'" + attr + ">" + key + "</div>").appendTo(leftAction);
                    if(header.getIcon() == null && header.getLeftAction() == null && header.getSource() == null) {
                        title.css("left", 0);
                    }
                }
            }
            var actionBar = $("<div class='action-bar'></div>").appendTo(eHeader);
            var hasOverlay = false;
            for(var i = 0; i < header.getActions().length; i++){
                var a = header.getActions()[i];
                if(a.getContent() != null){
                    var hContent = a.getContent();
                    if(typeof(paper.lang) !== "undefined"){
                        hContent = paper.lang.replace(hContent);
                    }
                    $(hContent).appendTo(actionBar);
                }else {
                    var visibility = a.getShowAsAction();
                    if (visibility === "always" || visibility === "withtext") {
                        var action = $("<div class='action wrippels' tabindex='0'></div>").appendTo(actionBar);
                        if (a.getId() !== null) {
                            action.attr("id", a.getId());
                        }
                        $("<i></i>").addClass(a.getIcon()).appendTo(action);
                    } else {
                        hasOverlay = true;
                    }
                }
            }
            if(hasOverlay) {
                var expandButton = $("<div class='action wrippels expand-button' tabindex='0'><i class='mdi-navigation-more-vert'></i></div>").appendTo(actionBar);
                var actionOverlay = $("<div class='action-overlay hide'></div>").appendTo(actionBar);
                for(var i = 0; i < header.getActions().length; i++){
                    var a = header.getActions()[i];
                    var visibility = a.getShowAsAction();
                    if(visibility === "ifroom" || visibility === "never") {
                        var title = a.getTitle();
                        if(typeof(paper.lang) !== "undefined"){
                            title = paper.lang.replace(title);
                        }
                        var action = $("<div class='action wrippels' tabindex='0'>" + title + "</div>").appendTo(actionOverlay);
                        if(a.getId() !== null){
                            action.attr("id", a.getId());
                        }
                        if(a.getIcon() !== null){
                            $("<i></i>").addClass(a.getIcon()).appendTo(action);
                        }
                    }else{
                        hasOverlay = true;
                    }
                }
            }

            return eHeader;
        },

        /**
         * Attach Header to an element when DOM is ready
         * @param {Header} header
         * @param {html | selector} element - Element to attach the header to
         */
        attach: function (header, element) {
            var attachElement = function(){
                var e = $(element);
                var eHeader = paper.header.render(header);
                eHeader.prependTo(e);
                header.setElement(eHeader);
                //TODO: listen for resizing the header
            };

            if($("body").isReady) {
                attachElement();
            }else{
                $("body").ready(function(){
                    attachElement();
                });
            }
        },

        /**
         * Update changes of the header to the DOM
         * @param {Header} header
         */
        update: function (header) {
            var element = header.getElement();

            element.attr("class", "paper-header " + header.getColor());

            var key = header.getTitle();
            var value = key;
            var attr = null;
            if(typeof(paper.lang) !== "undefined"){
                value = paper.lang.replace(key);
                if(value !== key){
                    attr = paper.lang.extractKey(key);
                }
            }
            element.find(".title").html(value);
            if(attr != null){
                element.find(".title").attr("lang-key", attr);
            }else{
                element.find(".title").removeAttr("lang-key");
            }

            var icon = element.find(".icon").removeClass("action-menu").removeClass("action-back");
            if(header.getLeftAction() === "menu"){
                icon.addClass("action-menu");
            }else if(header.getLeftAction() === "back"){
                icon.addClass("action-back");
            }
            if(header.getIcon() !== null){
                icon.children("i").attr("class", header.getIcon());
            }
            if(header.getSource() !== null){
                icon.children("i").css("background-image", "url(" + header.getSource() + ")");
            }
        }

    };

    //Listen to header action
    $("body").ready(function(){
        var timeout;
        //On expand-button click
        $("body").on("click", ".paper-header .action-bar .action.expand-button", function(){
            var actionOverlay = $(this).parent().children(".action-overlay");
            actionOverlay.addClass("fade").removeClass("hide");
            setTimeout(function(){
                actionOverlay.removeClass("fade");
            }, 20);
        });

        //On expand-button lose focus
        $("body").on("blur", ".paper-header .action-bar .action.expand-button", function(){
            var tthis = $(this).parent().children(".action-overlay").addClass("fade");
            timeout = setTimeout(function(){
                $(tthis).addClass("hide").removeClass("fade");
            }, 200);
        });

        //On action-overlay click
        $("body").on("click", ".paper-header .action-bar .action-overlay", function(){
            var tthis = $(this).addClass("fade");
            setTimeout(function(){
                $(tthis).addClass("hide").removeClass("fade");
            }, 200);
        });

        //On action in overlay gain focus
        $("body").on("focus", ".paper-header .action-bar .action-overlay .action", function(){
            if(timeout){
                clearTimeout(timeout);
            }
            $(this).parent().removeClass("fade");
        });
    });

    /**
     * Header object
     * @param {{color: string, title: string, icon: string, leftAction: null | 'menu' | 'back', actions: [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}]}} options
     * @constructor
     */
    function Header(options) {
        this.element = null;

        this.color = "light-gray";
        this.title = null;
        this.icon = null;
        this.actions = [];
        this.leftAction = null;
        this.src = null;

        if (typeof(options) !== "undefined") {

            if (typeof(options.color) !== "undefined") {
                this.setColor(options.color);
            }
            if (typeof(options.title) !== "undefined") {
                this.setTitle(options.title);
            }
            if (typeof(options.icon) !== "undefined") {
                this.setIcon(options.icon);
            }
            if (typeof(options.actions) !== "undefined") {
                this.setActions(options.actions);
            }
            if (typeof(options.leftAction) !== "undefined") {
                this.setLeftAction(options.leftAction);
            }
            if (typeof(options.src) !== "undefined") {
                this.setSource(options.src);
            }

        }
    }

    Header.prototype.setElement = function(element){
        this.element = element;
    };

    Header.prototype.getElement = function(){
        return this.element;
    };

    Header.prototype.setTitle = function (title) {
        this.title = title;
    };

    Header.prototype.getTitle = function(){
        return this.title;
    };

    Header.prototype.setIcon = function (icon) {
        this.icon = icon;
    };

    Header.prototype.getIcon = function () {
        return this.icon;
    };

    Header.prototype.setSource = function (src) {
        this.src = src;
    };

    Header.prototype.getSource = function () {
        return this.src;
    };

    /**
     * Add Action
     * @param {{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}} action
     */
    Header.prototype.addAction = function (action) {
        this.actions.push(new Action(action));
    };

    /**
     * Remove Action by id
     * @param {string} id - Action id
     */
    Header.prototype.removeAction = function (id) {
        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].getId() === id) {
                this.actions.remove(i);
                break;
            }
        }
    };

    /**
     * Set Actions
     * @param [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}] actions
     */
    Header.prototype.setActions = function (actions) {
        this.actions = [];
        for(var i = 0; i < actions.length; i++){
            this.addAction(actions[i]);
        }
    };

    Header.prototype.getActions = function(){
        return this.actions;
    };

    /**
     * Show defined icon, menu-icon or back-icon
     * @param {null | 'menu' | 'back'} leftAction
     */
    Header.prototype.setLeftAction = function (leftAction) {
        if (leftAction === null || leftAction === "menu" || leftAction === "back") {
            this.leftAction = leftAction;
        } else {
            throw "Wrong usage leftAction: null | 'menu' | 'back'";
        }
    };

    Header.prototype.getLeftAction = function(){
        return this.leftAction;
    };

    Header.prototype.setColor = function (color) {
        if(typeof(paper.colors[color]) === "undefined"){
            throw "Unknown color \'" + color + "\'";
        }else{
            this.color = color;
        }
    };

    Header.prototype.getColor = function(){
        return this.color;
    };

    /**
     * Create new Action
     * @param {{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}} options
     * @constructor
     */
    function Action(options){
        this.orderInCategory = -1;
        this.id = null;
        this.icon = null;
        this.title = null;
        this.showAsAction = "ifRoom";
        this.contet = null;

        if(typeof(options) !== "undefined"){

            if(typeof(options.orderInCategory) !== "undefined"){
                this.orderInCategory = parseInt(options.orderInCategory);
            }
            if(typeof(options.id) !== "undefined"){
                this.id = options.id;
            }
            if(typeof(options.title) !== "undefined"){
                this.title = options.title;
            }
            if(typeof(options.icon) !== "undefined"){
                this.icon = options.icon;
            }
            if(typeof(options.content) !== "undefined"){
                this.content = options.content;
            }
            if(typeof(options.showAsAction) !== "undefined" && options.showAsAction != null){
                var saa = options.showAsAction.toLowerCase();
                if(saa === "ifroom" || saa === "never" || saa === "always" || saa === "withtext") {
                    this.showAsAction = saa;
                }else{
                    throw "Wrong usage showAsAction: always | withtext | ifRoom | never";
                }
            }

        }
    }

    Action.prototype.getOrderInCategory = function(){
        return this.orderInCategory;
    };

    Action.prototype.getId = function(){
        return this.id;
    };

    Action.prototype.getIcon = function(){
        return this.icon;
    };

    Action.prototype.getTitle = function(){
        return this.title;
    };

    Action.prototype.getShowAsAction = function(){
        return this.showAsAction;
    };

    Action.prototype.getContent = function(){
        return this.content;
    };

})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }
    if (typeof(paper.header) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper-header\'");
    }

    var working = false;
    var appTitle = null;

    /**
     * Material Application Framework
     * @type {{version: string, create: Function}}
     */
    paper.app = {

        /**
         * Version of 'paper-app.js'
         */
        version: 0.02,

        /**
         * Create new application
         * @param {string} title - Application title
         * @param {string} color - Default color of your app
         * @param {string} iconSrc - The source path to your icon
         * @returns {App}
         */
        create: function(title, color, iconSrc){
            return new App(title, color, iconSrc);
        }

    };

    /**
     * Create new App
     * @param {string} title - Application title
     * @param {string} color - Default color of your app
     * @param {string} iconSrc - The source path to your icon
     * @constructor
     */
    function App(title, color, iconSrc){
        if(title === null || title === "" || typeof(title) === "undefined" || title === false){
            this.title = "@+app-name+@";
        }else{
            this.title = title;
        }
        if(typeof(paper.colors[color]) === "undefined"){
            throw "Unknown color '" + color + "'";
        }

        this.color = color;
        this.iconSrc = iconSrc;

        this.activityGroups = [];
        this.activities = [];

        this.element;
    }

    /**
     * Create new Activity
     * @param {string} id - Unique name for this activity
     * @param {html | selector} content - Structure of this activity
     * @param {object} activity - Activity object
     */
    App.prototype.activity = function(id, content, activity){
        //Check arguments
        if(typeof(activity) === "undefined"){
            var object = content;
            var pContent = "#" + id;
        }else{
            var pContent = $(content);
            var object = activity;
        }
        if(typeof(object) === "undefined"){
            throw "missing argument";
        }
        if(id === null || id === ""){
            throw "Activity id cannot be empty";
        }
        if(typeof(this.activities[id]) !== "undefined") {
            throw "Activity '" + id + "' already exists";
        }

        //Add properties to activity
        if($(pContent).length == 0){
            pContent = $("<div></div>");
        }
        object.content = $(pContent);
        object.id = id;
        object.visible = false;
        object.isLoaded = false;
        //Store activity
        this.activities[id] = object;
        return id;
    };

    /**
     * Create new ActivityGroup
     * @param {string} id - Unique name for this ActivityGroup
     * @param {{color: string, leftAction: null | 'menu' | 'back', icon: string, title: string, activity_1: Activity, activity_2: Activity, activity_3: Activity}} options - activityGroup settings
     */
    App.prototype.group = function(id, options){
        //Check arguments
        if(id === null || id === ""){
            throw "Group id cannot be empty";
        }
        if(typeof(this.activityGroups[id]) !== "undefined"){
            throw "Group '" + id + "' already exists";
        }
        if(typeof(options.activity_1) === "undefined"){
            throw "'activity_1' must be declared";
        }

        //Store group
        options['id'] = id;
        this.activityGroups[id] = options;
        return id;
    };

    /**
     * Set theme color
     * @param color predefined color
     */
    App.prototype.setTheme = function(color){
        if(typeof(paper.colors[color]) === "undefined"){
            throw "'" + color + "' is not predefined";
        }
        this.element.attr("class", "material-app theme-" + color);
        this.element.children(".app-header").attr("class", "app-header " + color);
        if (typeof(paper.wrippels) !== "undefined") {
            var isLight = paper.wrippels.isLightBackground(app.element.children(".app-header"));
            this.element.children(".app-header").attr("bg", (isLight ? "light" : "dark"));
            this.element.children(".app-content").children(".paper-group").children(".paper-activity").attr("bg", (isLight ? "light" : "dark"));
        }
    };

    /**
     * Get UrlData
     * @param url
     * @returns {*}
     */
    App.prototype.getUrlData = function(url){
        return getPath(url);
    };

    /**
     * Show overlay
     * (use back() to hide it)
     * @param {string} activityName
     * @param {string} arg
     */
    App.prototype.overlay = function(activityName, arg){
        var urlData = getPath();
        urlData.overlay = activityName;
        urlData.overlayArg = arg;
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg), true);
    };

    /**
     * Go back
     */
    App.prototype.back = function(){
        var urlData = getPath();
        if(urlData.overlay !== null){
            urlData.overlay = null;
            urlData.overlayArg = null;
        }else if(urlData.acts.length == 2){
            urlData.acts.splice(1, 1);
        }else if(urlData.acts.length == 1){
            urlData.acts.splice(0, 1);
        }else{
            var group = this.activityGroups[urlData.group];
            var prevGroup = "home";
            if(typeof(group.prevGroup) !== "undefined"){
                prevGroup = group.prevGroup;
            }
            urlData.group = prevGroup;
            urlData.arg = undefined;
        }
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg), true);
    };

    /**
     * Go group back
     * Warning - Does NOT go back in the browser history
     */
    App.prototype.groupBack = function(){
        var urlData = getPath();
        var group = this.activityGroups[urlData.group];
        var prevGroup = "home"
        if(typeof(group.prevGroup) !== "undefined"){
            prevGroup = group.prevGroup;
        }
        urlData.group = prevGroup;
        urlData.arg = undefined;
        urlData.acts = [];
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts), true);
    };

    /**
     * Navigate to home ActivityGroup
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goHome = function(pushState){
        this.goToGroup("home", null, pushState);
    };

    /**
     * Navigate to ActivityGroup
     * @param {string} groupName - ActivityGroup name
     * @param {string} arg - invokeArg
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToGroup = function(groupName, arg, pushState){
        var url = getScriptName() + "#" + groupName;
        if(typeof(arg) !== "undefined" && arg !== null){
            url += ":" + arg
        }
        this.goToUrl(url, pushState);
    };

    /**
     * Navigate to Activity
     * @param {string} activityName - Activity name
     * @param {int} index - index of the Activity (1 or 2)
     * @param {string} arg - invokeArg
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToActivity = function(activityName, index, arg, pushState){
        var app = this;
        var urlData = getPath();
        urlData.overlay = null;
        urlData.overlayArg = null;
        if(index == 2){
            urlData.acts = [{activity:activityName, arg: arg}];
        }else if(index == 3){
            if(typeof(urlData.acts[0]) === "undefined"){
                throw "Activity 2 is not set";
            }
            urlData.acts[1] = {activity:activityName, arg: arg};
        }else{
            throw "Index must be 2 or 3";
        }
        app.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts), pushState);
    };

    /**
     * Navigate to URL
     * @param {string} path - URL
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToUrl = function(path, pushState){
        //Check if the app is initialized
        if(!this.isInit){
            this.init();
        }
        if(working){
            return;
        }
        working = true;
        setTimeout(function(){
            working = false;
        }, 300);
        console.debug("goTo: " + path);
        var app = this;
        var currentGroup = getCurrentGroup(app);
        var urlData = getPath(path);
        var group = app.activityGroups[urlData.group];

        var overlayVisible = app.element.children(".paper-overlay").length > 0;
        hideOverlay(app);

        //Set history
        var title = app.title;

        if(typeof(group) !== "undefined") {
            if (typeof(group.title) !== "undefined" && group.title !== null) {
                title = group.title + " | " + title;
            }
        }
        if(typeof(paper.lang) !== "undefined"){
            title = paper.lang.replace(title);
        }
        for(var i = 0; i < urlData.acts.length; i++){
            var activity = app.activities[urlData.acts[i]];
            if(typeof(activity) !== "undefined"){
                if(typeof(activity.title) !== "undefined" && activity.title !== null){
                    title = activity.title + " - " + title;
                }
            }
        }
        var url = generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg);
        if(url !== location.href) {
            if (pushState || typeof(pushState) === "undefined") {
                var isBack = routingManager.goTo(url, title);
                if(isBack === true){
                    return;
                }
            }else{
                routingManager.replaceUrl(url, title);
            }
        }
        document.title = title;
        $("body").trigger("navigate", [url, urlData]);

        console.debug("check group -> " + currentGroup[0] + ":"  + currentGroup[1] + " === " + urlData.group + ":" + urlData.arg);
        if(currentGroup[0] === urlData.group && currentGroup[1] === urlData.arg){
            console.debug("same group");
            //Change Activities
            if(urlData.acts.length == 0){
                console.debug("clear activity 2 and 3");
                //Remove Activity 2 and 3 if exists
                var activity_2 = getCurrentActivity(app, 1);
                var activity_3 = getCurrentActivity(app, 2);
                if(activity_2 != null){
                    hideActivity(activity_2);
                    setTimeout(function(){
                        destroyActivity(activity_2);
                        app.updateLayout();
                    }, 200);
                }
                if(activity_3 != null){
                    hideActivity(activity_3);
                    setTimeout(function(){
                        destroyActivity(activity_3);
                        app.updateLayout();
                    }, 200);
                }
            }
            if(urlData.acts.length >= 1){
                console.debug("check if activity 2 exists");
                //Check if Activity 2 should change
                var activity_2 = getCurrentActivity(app, 1);
                var shouldChange = activity_2 != null;
                if(shouldChange) {
                    console.debug("yeas");
                    var arg = activity_2.element.attr("data-arg");
                    if (arg === null || typeof(arg) === "undefined") {
                        arg = null;
                    }
                    console.debug("should activity 2 change");
                    if (arg !== urlData.acts[0].arg || activity_2.id !== urlData.acts[0].activity) {
                        console.debug("yes");
                        //Remove activity
                        hideActivity(activity_2);
                        setTimeout(function(){
                            destroyActivity(activity_2);
                            setCurrentActivity(app, urlData.acts[0].activity, 2, urlData.acts[0].arg);
                        }, 200);
                    }
                }else{
                    console.debug("no");
                    setCurrentActivity(app, urlData.acts[0].activity, 2, urlData.acts[0].arg);
                }
            }
            if(urlData.acts.length >= 2){
                console.debug("check if activity 3 exists");
                var activity_3 = getCurrentActivity(app, 2);
                if(activity_3 != null){
                    console.debug("yeas");
                    var arg = activity_3.element.attr("data-arg");
                    if (arg === null || typeof(arg) === "undefined") {
                        arg = null;
                    }
                    console.debug("should activity 3 change");
                    if (arg !== urlData.acts[1].arg || activity_3.id !== urlData.acts[1].activity) {
                        console.debug("yes");
                        //Remove activity
                        hideActivity(activity_3);
                        setTimeout(function(){
                            destroyActivity(activity_3);
                            setCurrentActivity(app, urlData.acts[1].activity, 3, urlData.acts[1].arg);
                        }, 200);
                    }
                }else{
                    console.debug("no");
                    setCurrentActivity(app, urlData.acts[1].activity, 3, urlData.acts[1].arg);
                }
            }else{
                //Remove Activity 3
                var activity_3 = getCurrentActivity(app, 2);
                if(activity_3 != null){
                    hideActivity(activity_3);
                    setTimeout(function(){
                        destroyActivity(activity_3);
                        app.updateLayout();
                    }, 200);
                }
            }
        }else{
            console.debug("different group");
            //Change ActivityGroup
            setCurrentGroup(app, urlData.group, urlData.arg, urlData.acts);
        }

        if(urlData.overlay !== null){
            console.debug("Show overlay '" + urlData.overlay + "'");
            if(overlayVisible){
                setTimeout(function(){
                    showOverlay(app, urlData.overlay, urlData.overlayArg);
                }, 201);
            }else{
                showOverlay(app, urlData.overlay, urlData.overlayArg);
            }
        }
    };

    /**
     * Show activity as overlay
     * @param {App} app
     * @param {string} activityName
     * @param {string} arg
     */
    function showOverlay(app, activityName, arg){
        var activity = app.activities[activityName];

        var clr = app.color;
        var groupName = getCurrentGroup(app)[0];
        var group = app.activityGroups[groupName];
        if(typeof(group.color) !== "undefined"){
            clr = group.color;
        }

        if(typeof(activity) === "undefined"){
            console.error("Cannot find Activity '" + activityName + "'");
        }else{
            if(typeof(activity.color) !== "undefined"){
                clr = activity.color;
            }
        }

        var eActivity = createActivity(app, activityName, arg, clr);
        eActivity.children(".paper-header").removeClass("fade");
        var eOverlay = $("<div class='paper-overlay fade'></div>");
        eActivity.appendTo(eOverlay);
        var leftAction = eActivity.children(".paper-header").children(".left-action");
        var icon = leftAction.children(".icon");
        if(icon.length == 0){
            leftAction.children(".title").css("left", "");
            icon = $("<div class='icon wrippels'><i></i></div>").appendTo(leftAction);
        }
        icon.children("i").attr("class", "mdi-content-clear");

        if(group.drawer === activityName){
            eOverlay.addClass("paper-drawer");
            eActivity.children(".paper-header").remove();
            eActivity.children(".activity-frame").children(".activity-body").children(".drawer-head").addClass("fade");
        }

        eOverlay.appendTo(app.element);
        setTimeout(function(){
            eOverlay.removeClass("fade");
            if(typeof(activity) === "undefined") {
                eActivity.children().removeClass("fade").children().removeClass("fade");
            }else{
                if(group.drawer === activityName){
                    setTimeout(function(){
                        eActivity.children(".activity-frame").children(".activity-body").children(".drawer-head").removeClass("fade");
                    }, 200);
                }
                showActivity(activity);
            }
        }, 20);
    }

    /**
     * Hide all visible overlays
     * @param {App} app
     */
    function hideOverlay (app) {
        var eOverlay = app.element.children(".paper-overlay");
        eOverlay.addClass("fade");
        setTimeout(function(){
            eOverlay.remove();
        }, 200);
        var eActivity = eOverlay.children(".paper-activity");
        if (eActivity.length > 0) {
            var id = eActivity.attr("id");
            if(id !== null && typeof(id) !== "undefined") {
                var activity = app.activities[id.substring(2)];
                if(typeof(activity) !== "undefined") {
                    hideActivity(activity);
                    activity.element.children(".paper-header").removeClass("fade");
                    setTimeout(function () {
                        destroyActivity(activity);
                    }, 200);
                }
            }
        }
    }

    /**
     * Set Activity to current index of the current group
     * @param {App} app
     * @param {string} activityName
     * @param {int} index - 2 or 3
     * @param {string} arg
     */
    function setCurrentActivity(app, activityName, index, arg){
        var eGroup = app.element.children(".app-content").children(".paper-group");
        var group = app.activityGroups[getCurrentGroup(app)[0]];
        var activity = app.activities[activityName];

        var color = app.color;
        if(typeof(group.color) !== "undefined"){
            color = group.color;
        }

        var pos = "normal";
        if(index == 2 && typeof(group.activity_2_type) !== "undefined"){
            pos = group.activity_2_type;
        }else if(index == 3 && typeof(group.activity_3_type) !== "undefined"){
            pos = group.activity_3_type;
        }

        if(typeof(activity) === "undefined"){
            console.error("Cannot find Activity '" + activityName + "'");
            var eActivity = createActivity(app, activityName, arg, color);
            eActivity.addClass("pos-" + pos);
            eActivity.appendTo(eGroup);

            setTimeout(function(){
                eActivity.children().removeClass("fade").children().removeClass("fade");
            }, 20);
            app.updateLayout();
        }else{
            var eActivity = createActivity(app, activityName, arg, color);
            eActivity.addClass("pos-" + pos);
            eActivity.appendTo(eGroup);
            if(typeof(paper.wrippels) !== "undefined"){
                var isLight = paper.wrippels.isLightBackground(app.element.children(".app-header"));
                eGroup.children(".paper-activity").attr("bg", (isLight ? "light" : "dark"));
            }

            setTimeout(function(){
                showActivity(activity);
            }, 20);
            app.updateLayout();
        }
    }


    /**
     * Get current activity by index
     * @param {App} app
     * @param {int} index
     * @returns {Activity}
     */
    function getCurrentActivity (app, index){
        var eActivities = app.element.children(".app-content").children(".paper-group").children(".paper-activity");
        if(eActivities.length <= index){
            return null;
        }
        var eActivity = eActivities.eq(index);
        return app.activities[eActivity.attr("id").substring(2)];
    }

    /**
     * Get current ActivityGroup
     * @param {App} app
     * @returns {[groupName, arg]}
     */
    function getCurrentGroup(app){
        var appContent = app.element.children(".app-content");
        if(appContent.children(".paper-group").length == 0){
            return [null, null];
        }else{
            var groupName = appContent.children(".paper-group").attr("id").substring(2);
            var arg = appContent.children(".paper-group").attr("data-arg");
            if(arg === "" || arg === null || typeof(arg) === "undefined"){
                arg = null;
            }
            return [groupName, arg];
        }
    }

    /**
     * Set current ActivityGroup
     * @param {App} app
     * @param {string} groupName - ActivityGroup
     * @param {string} arg - argument
     * @param {[{activity: Activity, arg: string}]} acts - Activities
     */
    function setCurrentGroup(app, groupName, arg, acts){
        var appContent = app.element.children(".app-content");

        //Check if old group exists
        if(appContent.children(".paper-group").length > 0){
            destroyActivityGroup(app, function(){
                createGroup(app, groupName, arg, acts);
                app.updateLayout();
            });
        }else{
            createGroup(app, groupName, arg, acts);
            app.updateLayout();
        }
    }

    /**
     * Destroy ActivityGroup with children
     * @param {App} app
     * @param {Function} callBack - called when destroyed
     */
    function destroyActivityGroup(app, callBack){
        var eGroup = app.element.children(".app-content").children(".paper-group");
        eGroup.addClass("fade");
        var eActivities = eGroup.children(".paper-activity").each(function(){
            var id = $(this).attr("id").substring(2);
            var activity = app.activities[id];
            if(typeof(activity) !== "undefined") {
                hideActivity(activity);
                destroyActivity(activity);
            }
        });

        setTimeout(function(){
            eGroup.remove();
            if(typeof(callBack) !== "undefined"){
                callBack();
            }
        }, 200);
    }

    /**
     * Create ActivityGroup
     * @param {App} app
     * @param {string} groupName - ActivityGroup name
     * @param {string} arg - argument
     * @param {[{activity: Activity, arg: string}]} acts - Activities
     */
    function createGroup(app, groupName, arg, acts){
        var appContent = app.element.children(".app-content");
        var appHeader = app.element.children(".paper-header");
        var color = app.color;

        var group = app.activityGroups[groupName];
        //Create group
        var eGroup = $("<div class='paper-group fade' id='g-" + groupName + "'></div>");
        if (typeof(arg) !== "undefined" && arg !== null) {
            eGroup.attr("data-arg", arg);
        }
        if(typeof(group) === "undefined"){
            console.error("Cannot find ActivityGroup '" + groupName + "'");
            //Create undefined activity
            var e1 = createActivity(app, undefined, arg, color).appendTo(eGroup);
            e1.addClass("pos-large");
            e1.children().removeClass("fade").children().removeClass("fade");
            app.setTheme(app.color);

            //Add to DOM
            eGroup.appendTo(appContent);
            setTimeout(function(){
                app.updateLayout();
                eGroup.removeClass("fade");
            }, 20);
        }else {
            if(typeof(group.color) !== "undefined"){
                color = group.color;
            }

            //Create activities
            var e1 = createActivity(app, group.activity_1, arg, color).appendTo(eGroup);
            var eTitle = e1.find(".paper-header .title");
            if(eTitle.length > 0){
                eTitle.css("left", "");
            }

            var pos = "normal";
            if (typeof(group.activity_1_type) !== "undefined") {
                pos = group.activity_1_type;
            }
            e1.addClass("pos-" + pos);

            for (var i = 0; i < acts.length; i++) {
                var ex = createActivity(app, acts[i].activity, acts[i].arg, color).appendTo(eGroup);
                var pos = "normal";
                if (i == 0 && typeof(group.activity_2_type) !== "undefined") {
                    pos = group.activity_2_type;
                } else if (i == 1 && typeof(group.activity_3_type) !== "undefined") {
                    pos = group.activity_3_type;
                }
                ex.addClass("pos-" + pos);
            }

            //Update header

            var leftAction = appHeader.children(".left-action");
            var title = app.title;
            if (typeof(group.title) !== "undefined") {
                title = group.title;
            }
            app.header.setTitle(title);
            if(group.leftAction === "menu"){
                app.header.setLeftAction(group.leftAction);
            }else if(group.leftAction === "back"){
                app.header.setLeftAction(group.leftAction);
            }else{
                app.header.setLeftAction(null);
                if(typeof(group.icon) !== "undefined" && group.icon !== null){
                    app.header.setIcon(group.icon);
                }else{
                    app.header.setIcon(app.icon);
                }
            }
            paper.header.update(app.header);

            //Add to DOM
            eGroup.appendTo(appContent);
            app.setTheme(color);
            setTimeout(function(){
                app.updateLayout();
                eGroup.removeClass("fade");
                showActivity(app.activities[group.activity_1]);
                for(var i = 0; i < acts.length; i++){
                    showActivity(app.activities[acts[i].activity]);
                }
            }, 20);
        }

    }

    /**
     * Render Activity to jQuery object
     * @param {App} app
     * @param {string} activityName - Activity name
     * @param {object} invokeArg - Object to pass through to Activity.onCreate function
     * @param {string} color - Default color
     * @param {string} title - Activity title
     * @returns {jQuery}
     */
    function createActivity(app, activityName, invokeArg, color){
        var activity = app.activities[activityName];
        if(typeof(activity) !== "undefined") {
            activity.loaded = function () {};
            activity.isLoaded = false;

            //Create jQuery object
            var eActivity = $("<div class='paper-activity'></div>");
            activity.element = eActivity;
            eActivity.attr("id", "a-" + activity.id);
            var activityArg = invokeArg;
            if (activityArg === null) {
                activityArg = undefined;
            }
            if (typeof(activityArg) !== "undefined") {
                eActivity.attr("data-arg", invokeArg);
            }

            var activityFrame = $("<div class='activity-frame fade'></div>").appendTo(eActivity);
            activityFrame.attr("bg", "light");

            var content = activity.content.clone().removeClass("activity-hide");
            content.addClass("activity-body").addClass("fade");
            content.attr("id", "e-" + activity.id);

            //Call Activity.onCreate
            if (typeof(activity.onCreate) !== "undefined") {
                var succeed = activity.onCreate(content, activityArg);
                if (succeed === false) {
                    activity.loaded = function () {
                        activity.isLoaded = true;
                        if (activity.visible) {
                            activityFrame.addClass("fade");
                            setTimeout(function () {
                                activityFrame.children(".paper-loading").remove();
                                content.appendTo(activityFrame);
                                if(typeof(paper.lang) !== "undefined"){
                                    paper.lang.updateLanguage(activity.element);
                                }
                                setTimeout(function () {
                                    content.removeClass("fade");
                                    activityFrame.removeClass("fade");
                                }, 20);
                            }, 200);
                        }
                    };
                    $("<div class='paper-loading center'><svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg></div>").appendTo(activityFrame);
                } else {
                    activity.isLoaded = true;
                    content.appendTo(activityFrame);
                }
            } else {
                activity.isLoaded = true;
                content.appendTo(activityFrame);
            }
            var hOptions = {color: color, title: activity.title, src: activity.src};
            if (typeof(activity.actions) !== "undefined") {
                hOptions.actions = activity.actions;
            }
            var header = paper.header.create(hOptions);
            paper.header.attach(header, eActivity);
            eActivity.children(".paper-header").addClass("fade");

            return eActivity;
        }else{
            var eActivity = $("<div class='paper-activity'></div>");
            eActivity.attr("id", "a-undefined");
            var activityArg = invokeArg;
            if (activityArg === null) {
                activityArg = undefined;
            }
            if (typeof(activityArg) !== "undefined") {
                eActivity.attr("data-arg", invokeArg);
            }
            var activityFrame = $("<div class='activity-frame fade'></div>").appendTo(eActivity);

            var activityBody = $("<div class='activity-body'></div>").appendTo(activityFrame);
            var content = $("<div class='activity-empty'><h1>File Not Found</h1><h2>Error: 404</h2></div>").appendTo(activityBody);
            content.attr("id", "e-" + activityName);
            return eActivity;
        }
    }

    /**
     * Show Activity (triggers loaded() )
     * @param {Activity} activity - Activity
     */
    function showActivity(activity){
        if(typeof(paper.lang) !== "undefined"){
            paper.lang.updateLanguage($("#a-" + activity.id));
        }
        activity.element.children(".activity-frame").removeClass("fade").children(".activity-body").removeClass("fade");
        activity.element.children(".paper-header").removeClass("fade");
        activity.visible = true;
        if (typeof(activity.onVisible) !== "undefined") {
            activity.onVisible();
        }
        if (activity.isLoaded === true && typeof(activity.loaded) !== "undefined") {
            activity.loaded();
        }
    }

    /**
     * Hide Activity
     * @param {Activity} activity - Activity
     */
    function hideActivity(activity){
        if(typeof(activity.element) !== "undefined") {
            activity.element.children(".activity-frame").children(".activity-body").addClass("fade");
            activity.element.children(".paper-header").addClass("fade");
        }
        activity.visible = false;
        if(typeof(activity.onInvisible) !== "undefined"){
            activity.onInvisible();
        }
    }

    /**
     * Destroy Activity (does not update url)
     * @param {Activity} activity - Activity
     */
    function destroyActivity(activity){
        if(typeof(activity.onDestroy) !== "undefined"){
            activity.onDestroy();
        }
        if(typeof(activity.element) !== "undefined") {
            activity.element.remove();
            activity.element = undefined;
        }
    }

    /**
     * Initialze application
     */
    App.prototype.init = function(){
        if(this.isInit){
           return;
        }
        this.isInit = true;
        var app = this;
        appTitle = app.title;
        $("head").append("<meta name='theme-color' content='" + paper.colors[app.color] + "'>")
        var materialApp = $("<div class='material-app fade'></div>");
        var appHeader = $("<div class='app-header'></div>").addClass(this.color).appendTo(materialApp);
        var header = paper.header.create({
            title: app.title,
            icon: app.iconSrc,
            color: app.color
        });
        app.header = header;
        paper.header.attach(header, materialApp);
        var appContent = $("<div class='app-content'></div>").appendTo(materialApp);

        this.element = materialApp;

        var showApp = function(){
            materialApp.appendTo("body");
            setTimeout(function(){
                materialApp.removeClass("fade");
                routingManager.update();
                installAppListeners(app);
                app.goToUrl(location.href, false);
            }, 20);
        };

        if(paper.loaded){
            showApp();
        }else{
            $(window).load(function(){
                showApp();
            });
        }
    };

    /**
     * Install app listeners
     * @param {App} app
     */
    function installAppListeners(app){
        $(window).resize(function(){
            app.updateLayout();
        });
        $(window).bind("popstate", function(event){
            app.goToUrl(location.href, false);
        });
        $("body").on("click", ".material-app > .paper-overlay > *", function(){
            return false;
        });
        $("body").on("click", ".material-app > .paper-overlay, .material-app > .paper-overlay .paper-header .left-action .icon", function(){
            if($(this).hasClass("paper-overlay") || $(this).hasClass("icon")){
                app.back();
            }
        });
        $("body").on("click", ".material-app > .paper-header .left-action .icon", function(){
            var groupData = getCurrentGroup(app);
            var groupName = groupData[0];
            var groupArg = groupData[1];
            var group = app.activityGroups[groupName];

            if($(this).hasClass("action-menu")){
                //open drawer
                if(typeof(group.drawer) !== "undefined"){
                    app.overlay(group.drawer, groupArg);
                }else if(typeof(group.backAction) !== "undefined"){
                    group.backAction();
                }
            }else if($(this).hasClass("action-back")){
                //back
                var slots = app.element.children(".app-content").attr("slots");
                var groupBack = true;
                if($("body").width() < 1080 && $("body").width() >= 720){
                    if(slots === "3"){
                        groupBack = false;
                    }
                }else if($("body").width() < 720){
                    if(slots === "2" || slots === "3"){
                        groupBack = false;
                    }
                }
                if(groupBack){
                    app.groupBack();
                }else{
                    app.back();
                }
            }else{
                if(typeof(group.backAction) !== "undefined"){
                    group.backAction();
                }
            }
        });
    }

    /**
     * Update positions and sizes of the activities and position of the viewport
     */
    App.prototype.updateLayout = function(){
        console.debug("update layout");
        var eIcon = this.header.getElement().children(".left-action").children(".icon");
        var group = this.element.children(".app-content").children(".paper-group");
        var slots = 0;
        var eActivities = group.children(".paper-activity.pos-normal, .paper-activity.pos-medium, .paper-activity.pos-large");
        eActivities.each(function(){
            if($(this).hasClass("pos-normal")){
                slots += 1;
            }else if($(this).hasClass("pos-medium")){
                slots += 2;
            }else if($(this).hasClass("pos-large")){
                slots += 3;
            }
        });
        if(slots > 3){
            slots = 3;
        }
        group.parent().attr("slots", slots);
        if($("body").width() >= 1080){
            //Set position
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined"){
                    if(activity_1.visible === false){
                        showActivity(activity_1);
                    }
                }

                if(eActivities.eq(0).hasClass("pos-normal")){
                    eActivities.eq(0).attr("pos", "xoo");
                }else if(eActivities.eq(0).hasClass("pos-medium")){
                    eActivities.eq(0).attr("pos", "xxo");
                }else if(eActivities.eq(0).hasClass("pos-large")){
                    eActivities.eq(0).attr("pos", "xxx");
                }
            }else if(eActivities.length == 2){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }

                if(eActivities.eq(1).hasClass("pos-normal")){
                    if(eActivities.eq(0).hasClass("pos-normal")){
                        eActivities.eq(0).attr("pos", "xoo");
                        eActivities.eq(1).attr("pos", "oxo");
                    }else{
                        eActivities.eq(0).attr("pos", "xxo");
                        eActivities.eq(1).attr("pos", "oox");
                    }
                }else{
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxx");
                }
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
            }

            //Remove back icon
            if(eIcon.attr("last-action") === "icon"){
                eIcon.removeClass("action-back").removeClass("action-menu");
                eIcon.removeAttr("last-action");
            }
            if(eIcon.attr("last-action") === "menu"){
                eIcon.addClass("action-menu").removeClass("action-back");
                eIcon.removeAttr("last-action");
            }
        }else if($("body").width() >= 720){
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }

                group.parent().attr("slots", 1);
                eActivities.eq(0).attr("pos", "xxo");
            }else if(eActivities.length == 2){
                if(eActivities.eq(1).hasClass("pos-large") || eActivities.eq(1).hasClass("pos-medium")){
                    var activity_1 = getCurrentActivity(this, 0);
                    var activity_2 = getCurrentActivity(this, 1);
                    if(typeof(activity_1) !== "undefined") {
                        if (activity_1.visible === true) {
                            hideActivity(activity_1);
                        }
                    }
                    if(typeof(activity_2) !== "undefined") {
                        if (activity_2.visible === false) {
                            showActivity(activity_2);
                        }
                    }

                    group.parent().attr("slots", 3);
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxx");
                }else{
                    var activity_1 = getCurrentActivity(this, 0);
                    var activity_2 = getCurrentActivity(this, 1);
                    if(typeof(activity_1) !== "undefined") {
                        if (activity_1.visible === false) {
                            showActivity(activity_1);
                        }
                    }
                    if(typeof(activity_2) !== "undefined") {
                        if (activity_2.visible === false) {
                            showActivity(activity_2);
                        }
                    }
                    group.parent().attr("slots", 1);
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxo");
                }
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
            }

            //Set Back icon if necessary
            if(group.parent().attr("slots") === "3"){
                if(!eIcon.hasClass("action-back")){
                    if(eIcon.hasClass("action-menu")){
                        eIcon.attr("last-action", "menu");
                        eIcon.addClass("action-back").removeClass("action-menu");
                    }else{
                        eIcon.attr("last-action", "icon");
                        eIcon.addClass("action-back")
                    }
                }
            }else{
                if(eIcon.attr("last-action") === "icon"){
                    eIcon.removeClass("action-back").removeClass("action-menu");
                    eIcon.removeAttr("last-action");
                }
                if(eIcon.attr("last-action") === "menu"){
                    eIcon.addClass("action-menu").removeClass("action-back");
                    eIcon.removeAttr("last-action");
                }
            }
        }else{
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }

                group.parent().attr("slots", 1);
                eActivities.eq(0).attr("pos", "xoo");
            }else if(eActivities.length == 2){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === true) {
                        hideActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }

                group.parent().attr("slots", 2);
                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === true) {
                        hideActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === true) {
                        hideActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                group.parent().attr("slots", 3);
                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
            }

            //Set back icon if necessary
            if(group.parent().attr("slots") === "3" || group.parent().attr("slots") === "2"){
                if(!eIcon.hasClass("action-back")){
                    if(eIcon.hasClass("action-menu")){
                        eIcon.attr("last-action", "menu");
                        eIcon.addClass("action-back").removeClass("action-menu");
                    }else{
                        eIcon.attr("last-action", "icon");
                        eIcon.addClass("action-back")
                    }
                }
            }else{
                if(eIcon.attr("last-action") === "icon"){
                    eIcon.removeClass("action-back").removeClass("action-menu");
                    eIcon.removeAttr("last-action");
                }
                if(eIcon.attr("last-action") === "menu"){
                    eIcon.addClass("action-menu").removeClass("action-back");
                    eIcon.removeAttr("last-action");
                }
            }
        }

        var activity_1 = getCurrentActivity(this, 0);
        var activity_2 = getCurrentActivity(this, 1);
        var activity_3 = getCurrentActivity(this, 2);
        var hideTitle = -1;
        if(activity_3 != null){
            if(typeof(activity_3.title) !== "undefined"){
                var slots = group.parent().attr("slots");
                var pos = eActivities.eq(2).attr("pos");
                if($("body").width() >= 720 && $("body").width() < 1080){
                    if(slots == 3 && pos === "oxx"){
                        hideTitle = 2;
                        eActivities.eq(2).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                    }
                }else if($("body").width() < 720){
                    if(slots == 3){
                        hideTitle = 2;
                        eActivities.eq(2).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                    }
                }
            }
        }
        if(hideTitle == -1) {
            if (activity_2 != null) {
                if (typeof(activity_2.title) !== "undefined") {
                    var slots = group.parent().attr("slots");
                    var pos = eActivities.eq(1).attr("pos");
                    if ($("body").width() >= 720 && $("body").width() < 1080) {
                        if (slots == 3 && pos === "oxx") {
                            hideTitle = 1;
                            eActivities.eq(1).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                        }
                    } else if ($("body").width() < 720) {
                        if (slots == 2) {
                            hideTitle = 1;
                            eActivities.eq(1).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                        }
                    }
                }
            }
        }
        if(hideTitle == -1) {
            if (activity_1 != null) {
                if (typeof(activity_1.title) !== "undefined") {
                    var slots = group.parent().attr("slots");
                    var pos = eActivities.eq(0).attr("pos");
                    if ($("body").width() >= 1080) {
                        hideTitle = 0;
                        eActivities.eq(0).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                    } else if ($("body").width() >= 720 && $("body").width() < 1080) {
                        if (slots < 3) {
                            hideTitle = 0;
                            eActivities.eq(0).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                        }
                    } else if ($("body").width() < 720) {
                        if (slots == 1) {
                            hideTitle = 0;
                            eActivities.eq(0).children(".paper-header").children(".left-action").children(".icon").addClass("fade");
                        }
                    }
                }
            }
        }
        var eTitle = this.element.children(".paper-header").children(".left-action").children(".title");
        if(hideTitle != -1){
            eTitle.addClass("fade");
            var showIndex1 = 0;
            var showIndex2 = 1;
            if(hideTitle == 0){
                showIndex1 = 1;
                showIndex2 = 2;
            }else if(hideTitle == 1){
                showIndex1 = 0;
                showIndex2 = 2;
            }
            eActivities.eq(showIndex1).children(".paper-header").children(".left-action").children(".icon").removeClass("fade");
            eActivities.eq(showIndex2).children(".paper-header").children(".left-action").children(".icon").removeClass("fade");
        }else{
            eTitle.removeClass("fade");
            eActivities.eq(0).children(".paper-header").children(".left-action").children(".icon").removeClass("fade");
            eActivities.eq(1).children(".paper-header").children(".left-action").children(".icon").removeClass("fade");
            eActivities.eq(2).children(".paper-header").children(".left-action").children(".icon").removeClass("fade");
        }
    };

    /**
     * Get the name of this script (eg. http://localhost/index.php)
     * @returns {string}
     */
    function getScriptName(){
        var url = window.location.href;
        if(url.indexOf("#") != -1){
            url = url.split("#")[0];
        }
        return url;
    }

    /**
     * Get application path
     */
    function getPath(url) {
        var location = {
            group: "home",
            arg: null,
            acts: [],
            overlay: null,
            overlayArg: null
        };

        if (typeof(url) === "undefined") {
            var u = window.location.href;
        }else{
            var u = url;
        }
        if(u.indexOf("#") != -1){
            var path = u.split("#")[1];
            if(path.indexOf("+") != -1){
                path = path.split("+")[0];
            }
            if(path.indexOf("/") != -1){
                var paths = path.split("/");
                for(var i = 0; i < paths.length; i++){
                    var p = paths[i];
                    if(i == 0){
                        if(p.indexOf(":") != -1){
                            var entry = p.split(":");
                            location.group = entry[0];
                            if(isArgDefined(entry[1])){
                                location.arg = entry[1];
                            }else{
                                location.arg = null;
                            }
                        }else{
                            location.group = p;
                            location.arg = null;
                        }
                    }else{
                        if(p.indexOf(":") != -1){
                            var entry = p.split(":");
                            if(!isArgDefined(entry[1])){
                                entry[1] = null;
                            }
                            location.acts.push({
                                activity: entry[0],
                                arg: entry[1]
                            });
                        }else{
                            location.acts.push({
                                activity: p,
                                arg: null
                            });
                        }
                    }
                }
            }else if(path.indexOf(":") != -1){
                var entry = path.split(":");
                location.group = entry[0];
                if(!isArgDefined(entry[1])){
                    entry[1] = null;
                }
                location.arg = entry[1];
            }else{
                location.group = path;
            }
            if(u.indexOf("+") != -1){
                var overlayName = u.split("+")[1];
                if(typeof(overlayName) !== "undefined" && overlayName !== null && overlayName !== ""){
                    if(overlayName.indexOf(":") != -1){
                        var overlayData = overlayName.split(":");
                        location.overlay = overlayData[0];
                        if(!isArgDefined(overlayData[1])){
                            overlayData[1] = null;
                        }
                        location.overlayArg = overlayData[1];
                    }else{
                        location.overlay = overlayName;
                    }
                }
            }
        }
        return location;
    }

    /**
     * Generate Application path
     * @param group
     * @param arg
     * @param acts
     * @returns {string}
     */
    function generateLocation(group, arg, acts, overlay, overlayArg){
        var url = getScriptName() + "#";
        if(typeof(group.id) === "undefined"){
            url += group;
        }else {
            url += group.id;
        }
        if(isArgDefined(arg)){
            url += ":" + arg;
        }
        if(typeof(acts) !== "undefined"){
            for(var i = 0; i < acts.length; i++){
                if(typeof(acts[i]) !== "undefined") {
                    if (typeof(acts[i].activity.id) === "undefined") {
                        url += "/" + acts[i].activity;
                    } else {
                        url += "/" + acts[i].activity.id;
                    }
                    if(isArgDefined(acts[i].arg)){
                        url += ":" + acts[i].arg;
                    }
                }
            }
        }

        if(typeof(overlay) !== "undefined" && overlay !== null){
            if(typeof(overlay.id) === "undefined"){
                url += "+" + overlay;
            }else{
                url += "+" + overlay.id;
            }
            if(isArgDefined(overlayArg)){
                url += ":" + overlayArg;
            }
        }

        return url;
    }

    function isArgDefined(arg){
        if(typeof(arg) !== "undefined" && arg !== null && arg !== "undefined" && arg !== "null" && arg !== "0"){
            return true;
        }
        return false;
    }

    var routingManager = new function(){

        var manager = this;
        var isInit = false;
        var autoBack = false;

        this.replaceUrl = function(url, title){
            var urls = getHistoryItems();
            urls[urls.length-1] = url;
            setHistoryItems(urls);
            setLastUrl(url);
            history.replaceState(title, title, url);
        };

        /**
         * Check if new url is in the past or future,
         * if future pushState to browser history
         * if past go back in browser history
         * @param {string} url
         * @param {string} title
         * @return {boolean} true if back
         */
        this.goTo = function(newUrl, title){

            var oldLength = getHistoryLength();
            var oldUrls = getHistoryItems();
            var oldUrl = location.href;
            var newLength = history.length;

            if(newUrl !== oldUrl){
                var oldUrlData = getPath();
                var newUrlData = getPath(newUrl);
                var isNewLower = false;
                var isReplace = false;

                if(oldUrlData.overlay !== null && newUrlData.overlay === null){
                    isReplace = true;
                }

                if (newUrlData.group === oldUrlData.group && newUrlData.arg === oldUrlData.arg) {
                    if(newUrlData.acts.length < oldUrlData.acts.length){
                        isNewLower = true;
                    }
                    if(newUrlData.acts.length == oldUrlData.acts.length && newUrlData.overlay === null && oldUrlData.overlay !== null){
                        isNewLower = true
                    }
                }else if(newUrlData.group === "home" && oldUrlData.group !== "home"){
                    isNewLower = true;
                }

                console.debug("isNewLower: " + isNewLower);
                console.debug("isReplace: " + isReplace);
                if(isReplace){
                    //Replace current state
                    manager.replaceUrl(newUrl, title);
                }else if(isNewLower){
                    //Go back
                    var amountBack = -1;
                    for(var i = 0; i < oldUrls.length; i++){
                        var u = oldUrls[oldUrls.length-1-i];
                        if(u === newUrl){
                            amountBack = i;
                            break;
                        }
                    }
                    console.debug("goBack: " + amountBack);
                    if(amountBack == -1){
                        //History item not exists
                        var currentPos = -1;
                        for(var i = 0; i < oldUrls.length; i++){
                            var u = oldUrls[oldUrls.length-1-i];
                            if(u === oldUrl){
                                currentPos = i;
                                break;
                            }
                        }

                        var oldTitle = document.title;
                        history.replaceState(title, title, newUrl);
                        history.pushState(oldTitle, oldTitle, oldUrl);
                        autoBack = true;
                        history.back();
                        if(currentPos == -1) {
                            oldUrls[oldUrls.length - 1] = newUrl;
                            oldUrls.push(oldUrl);
                        }else{
                            var newUrls = [];
                            for(var i = 0; i < oldUrls.length - currentPos -1; i++){
                                newUrls.push(oldUrls[i]);
                            }
                            newUrls.push(newUrl);
                            newUrls.push(oldUrl);
                            for(var i = currentPos; i < oldUrls.length; i++){
                                newUrls.push(oldUrls[i]);
                            }
                            oldUrls = newUrls;
                        }
                        setHistoryItems(oldUrls);
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }else{
                        //History item exists
                        autoBack = true;
                        history.go(-amountBack);
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }
                }else{
                    //Go forward
                    var oldLength = history.length;
                    history.pushState(title, title, newUrl);
                    var newLength = history.length;
                    if(newLength == oldLength +1){
                        //Do nothing
                    }else if(newLength <= oldLength){
                        //Rewrite history
                        var dif = oldLength - newLength;
                        if(dif > oldUrls.length){
                            oldUrls = [];
                        }else{
                            var nurls = [];
                            for(var i = 0; i < oldUrls.length-dif-1; i++){
                                nurls.push(oldUrls[i]);
                            }
                            oldUrls = nurls;
                        }
                    }
                    oldUrls.push(newUrl);

                    setHistoryItems(oldUrls);
                    setHistoryLength(history.length);
                    setLastUrl(newUrl);
                }
            }else{
                setHistoryLength(history.length);
                setLastUrl(newUrl);
            }
            return false;
        };

        /**
         * Check if there are changes in the browser history, and respond to it if necessary
         */
        this.update = function(){
            if(!isInit){
                init();
            }else {
                if(autoBack){
                    autoBack = false;
                    return;
                }

                var oldUrl = getLastUrl();
                var oldLength = getHistoryLength();
                var oldUrls = getHistoryItems();
                var newUrl = location.href;
                var newLength = history.length;

                if(oldLength == null || oldUrls.length == 0 || oldUrl == null){
                    //No session -> do nothing
                }else{
                    var moved = false;
                    if(oldLength == newLength){
                        if(oldUrl === newUrl){
                            //Reload -> do nothing
                        }else{
                            //Moved
                            moved = true;
                        }
                    }else if(oldLength +1 == newLength){
                        //Go forward -> Add new entry
                        oldUrls.push(newUrl);
                    }else if(oldLength +1 < newLength){
                        //Went away - Clear history
                        oldUrls = [newUrl];
                    }else{
                        //Moved
                        moved = true;
                    }
                    if(moved){
                        var amountBack = -1;
                        for(var i = 0; i < oldUrls.length; i++){
                            var u = oldUrls[oldUrls.length-1-i];
                            if(u === oldUrl){
                                amountBack = i;
                                break;
                            }
                        }
                        if(amountBack == -1){
                            //Cannot find current point
                            oldUrls.push(newUrl);
                        }else{
                            //Create new history
                            var newUrls = [];
                            for(var i = 0; i < oldUrls.length - amountBack; i++){
                                newUrls.push(oldUrls[i]);
                            }
                            newUrls.push(newUrl);
                            oldUrls = newUrls;
                        }
                    }
                }

                setHistoryItems(oldUrls);
                setHistoryLength(newLength);
                setLastUrl(newUrl);
            }
        };

        /**
         * Bind popstate listener
         */
        var init = function(){
            if(isInit){
                return;
            }
            isInit = true;
            $(window).bind("popstate", function(){
                manager.update();
            });
            manager.update();
        };

        /**
         * Compare last two urls and add urls between them if the transition is not logical
         * @param {Array} urls
         */
        var checkLastTwoItems = function(urls){
            if(urls.length == 1){
                generateSession(document.title, urls[0]);
            }else{
                var newUrls = [];
                for(var i = 0; i < urls.length -2; i++){
                    newUrls.push(urls[i]);
                }
                var title = document.title;
                var newUrlData = getPath(urls[urls.length-1]);
                var oldUrlData = getPath(urls[urls.length-2]);
                var hasReplaced = false;

                if(newUrlData.group !== oldUrlData.group || newUrlData.arg !== oldUrlData.arg){
                    var u = generateLocation(newUrlData.group, newUrlData.arg, [], null, null);
                    newUrls.push(u);
                    history.replaceState(title, title, u);
                    hasReplaced = true;
                }

                if(newUrlData.acts.length >= 1 && typeof(newUrlData.acts[0]) !== "undefined" && typeof(oldUrlData.acts[0]) !== "undefined") {
                    if (newUrlData.group !== oldUrlData.group || newUrlData.arg !== oldUrlData.arg ||
                            newUrlData.acts[0].activity !== oldUrlData.acts[0].activity || newUrlData.acts[0].arg !== oldUrlData.acts[0].arg) {
                        var u = generateLocation(newUrlData.group, newUrlData.arg, [newUrlData[0]], null, null);
                        newUrls.push(u);
                        if(hasReplaced){
                            history.pushState(title, title, u);
                        }else {
                            history.replaceState(title, title, u);
                            hasReplaced = true;
                        }
                    }
                }

                if(newUrlData.acts.length >= 2 && typeof(newUrlData.acts[1]) !== "undefined" && typeof(oldUrlData.acts[1]) !== "undefined") {
                    if (newUrlData.group !== oldUrlData.group || newUrlData.arg !== oldUrlData.arg ||
                            newUrlData.acts[0].activity !== oldUrlData.acts[0].activity || newUrlData.acts[0].arg !== oldUrlData.acts[0].arg ||
                            newUrlData.acts[1].activity !== oldUrlData.acts[1].activity || newUrlData.acts[1].arg !== oldUrlData.acts[1].arg) {
                        var u = generateLocation(newUrlData.group, newUrlData.arg, newUrlData.acts, null, null);
                        newUrls.push(u);
                        if(hasReplaced){
                            history.pushState(title, title, u);
                        }else {
                            history.replaceState(title, title, u);
                            hasReplaced = true;
                        }
                    }
                }

                if(newUrlData.overlay !== null) {
                    if (newUrlData.group !== oldUrlData.group || newUrlData.arg !== oldUrlData.arg ||
                            newUrlData.overlay !== oldUrlData.overlay || newUrlData.overlayArg !== oldUrlData.overlayArg) {
                        var u = generateLocation(newUrlData.group, newUrlData.arg, newUrlData.acts, newUrlData.overlay, newUrlData.overlayArg);
                        newUrls.push(u);
                        if(hasReplaced){
                            history.pushState(title, title, u);
                        }else {
                            history.replaceState(title, title, u);
                            hasReplaced = true;
                        }
                    }
                }

                newUrls.push(u);
                setHistoryLength(history.length);
                setHistoryItems(newUrls);
            }
        };

        /**
         * Generate new session from home
         * @param {string} title
         * @param {string} url
         */
        var generateSession = function(title, url){
            var urlData = getPath(url);
            var hasReplaced = false;
            var urls = [];
            if(urlData.group != "home"){
                var u = generateLocation("home", null, [], null, null);
                urls.push(u);
                history.replaceState(title, title, u);
                hasReplaced = true;
            }
            if(urlData.acts.length == 0 && urlData.overlay === null){
                urls.push(url);
                if(hasReplaced){
                    history.pushState(title, title, url);
                }
            }else if(urlData.acts.length == 0 && urlData.overlay !== null){
                var u = generateLocation(urlData.group, urlData.arg, [], null, null);
                urls.push(u);
                if(hasReplaced){
                    history.pushState(title, title, u);
                }else{
                    history.replaceState(title, title, u);
                    hasReplaced = true;
                }
                urls.push(url);
                if(hasReplaced){
                    history.pushState(title, title, url);
                }
            }else{
                var u = generateLocation(urlData.group, urlData.arg, [], null, null);
                urls.push(u);
                if(hasReplaced){
                    history.pushState(title, title, u);
                }else{
                    history.replaceState(title, title, u);
                    hasReplaced = true;
                }

                var u = generateLocation(urlData.group, urlData.arg, [urlData.acts[0]], null, null);
                urls.push(u);
                if(hasReplaced){
                    history.pushState(title, title, u);
                }else{
                    history.replaceState(title, title, u);
                    hasReplaced = true;
                }
                if(urlData.acts.length > 1){
                    var u = generateLocation(urlData.group, urlData.arg, urlData.acts, null, null);
                    urls.push(u);
                    if(hasReplaced){
                        history.pushState(title, title, u);
                    }else{
                        history.replaceState(title, title, u);
                        hasReplaced = true;
                    }
                }
                if(urlData.overlay !== null){
                    var u = generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg);
                    urls.push(u);
                    if(hasReplaced){
                        history.pushState(title, title, u);
                    }else{
                        history.replaceState(title, title, u);
                        hasReplaced = true;
                    }
                }
            }

            setHistoryLength(history.length);
            setHistoryItems(urls);
        };

        /**
         * Get the last url
         * @returns {string,null}
         */
        var getLastUrl = function(){
            return window.sessionStorage.getItem(appTitle + ".routing.lasturl");
        };

        /**
         * Get the last history length from sessionStorage
         * @returns {string,null}
         */
        var getHistoryLength = function(){
            return window.sessionStorage.getItem(appTitle + ".routing.length");
        };

        /**
         * Get array of history items from sessionStorage
         * @returns {Array} urls
         */
        var getHistoryItems = function(){
            var itemLength = window.sessionStorage.getItem(appTitle + ".routing.items");
            var items = [];
            if(itemLength != null){
                for(var i = 0; i < itemLength; i++){
                    items.push(window.sessionStorage.getItem(appTitle + ".routing.item_" + i));
                }
            }
            return items;
        };

        /**
         * Set the last url in the sessionStorage
         * @param {int} historyLength
         */
        var setLastUrl = function(lastUrl){
            window.sessionStorage.setItem(appTitle + ".routing.lasturl", lastUrl);
        };

        /**
         * Set the current history length in the sessionStorage
         * @param {int} historyLength
         */
        var setHistoryLength = function(historyLength){
            window.sessionStorage.setItem(appTitle + ".routing.length", historyLength);
        };

        /**
         * Set the history items in the sessionStorage
         * @param {Array} items - urls
         */
        var setHistoryItems = function(items){
            window.sessionStorage.setItem(appTitle + ".routing.items", items.length);
            for(var i = 0; i < items.length; i++){
                window.sessionStorage.setItem(appTitle + ".routing.item_" + i, items[i]);
            }
        };

    };

})();
(function () {

    $("body").ready(function () {
        $("body").on("keyup", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);

            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            if (passed) {
                stat.css("background-color", "#2196F3");
                label.css("color", "#2196F3");
            } else {
                stat.css("background-color", "#E87C71");
                label.css("color", "#E87C71");
            }
        });

        $("body").on("focus", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);

            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            label.addClass("selected");
            if (passed) {
                stat.css("background-color", "#2196F3");
                label.css("color", "#2196F3");
            } else {
                stat.css("background-color", "#F44336");
                label.css("color", "#F44336");
            }

            stat.css("width", stat.parent().width() - 20 + "px");
        });

        $("body").on("change focus", ".paper-input select", function () {
            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            stat.css("background-color", "#2196F3");
            label.css("color", "#2196F3");
            stat.css("width", stat.parent().width() - 20 + "px");
        });

        $("body").on("blur", ".paper-input input, .paper-input textarea", function () {
            $(this).parent().children("label").css("color", "");
            if ($(this).val() == null || $(this).val() == "") {
                $(this).parent().children("label").removeClass("selected");
            }
            $(this).parent().children(".stat_active").css("width", "");
        });
        
        $("body").on("blur", ".paper-input select", function(){
            $(this).parent().children("label").css("color", "");
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            $(this).parent().children(".stat_active").css("width", "");
        });

        $(".paper-input.paper-label input, .paper-input.paper-label textarea").each(function () {
            if ($(this).val() == null || $(this).val() == "") {
                $(this).parent().children("label").removeClass("selected");
            } else {
                $(this).parent().children("label").addClass("selected");
            }
        });

        $(".paper-input").each(function () {
            if ($(this).children(".stat").length == 0) {
                $(this).append("<div class='stat'></div>");
            }
            if ($(this).children(".stat_active").length == 0) {
                $(this).append("<div class='stat_active'></div>");
            }
        });
    });

    function validatePaperInput(input) {
        var value = $(input).val();
        var required = $(input).attr("required");
        var max_length = $(input).attr("max-length");
        var email = $(input)[0].type == "email";
        var youtube = false;
        var cls = $(input).attr("class");
        if (cls != null) {
            youtube = cls.indexOf("ytb-field") > -1;
        }

        var passed = true;
        if (required && (value == null || value == "") && false) {
            passed = false;
        }
        if (max_length && value != null) {
            if (value.length > max_length) {
                passed = false;
            }
        }
        if (email && value != null) {
            var atpos = value.indexOf("@");
            if (atpos < 1 || atpos + 1 >= value.length) {
                passed = false;
            }
        }

        if (youtube) {
            if (!isValidYoutubeCode(value)) {
                passed = false;
            }
        }

        return passed;
    }

})();
(function(){

    $("body").on("click", ".paper-checkbox", function(){
        if (typeof ($(this).children("input").attr("checked")) !== "undefined") {
            $(this).children("input").removeAttr("checked");
            $(this).removeClass("checked");
        } else {
            $(this).children("input").attr("checked", true);
            $(this).addClass("checked");
        }
        $(this).trigger("change");
    });

    $("body").on("click", ".paper-radio", function () {
        $("input[name='" + $(this).children("input").attr("name") + "']").removeAttr("checked");
        $("input[name='" + $(this).children("input").attr("name") + "']").parent().removeClass("checked");
        if (!(typeof ($(this).children("input").attr("checked")) !== "undefined")){
            $(this).children("input").attr("checked", true);
            $(this).addClass("checked");
        }
    });

    $(".paper-radio input[type='radio']").each(function(){
        if($(this).prop("checked")){
            $(this).parent().click();
        }
    });
    $(".paper-radio.checked input[type='radio']").each(function(){
        if(!$(this).prop("checked")){
            $(this).parent().click();
        }
    });

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.lang = {

        version: 0.02,

        getLanguage: function () {
            return language;
        },

        get: function(key){
            var map = paper.lang.getLanguageMap();
            if(map != null){
                return map[key];
            }
            return null;
        },

        replace: function(text){
            if(text.indexOf("@+") != -1){
                var blocks = text.split("@+");
                for(var i = 1; i < blocks.length; i++){
                    var block = blocks[i];
                    if(block.indexOf("+@") != -1){
                        var key = block.split("+@")[0];
                        text = text.replace("@+" + key + "+@", paper.lang.get(key));
                    }
                }
            }
            return text;
        },

        extractKey: function(key){
            if(key.indexOf("@+") != -1){
                var blocks = key.split("@+");
                for(var i = 1; i < blocks.length; i++){
                    var block = blocks[i];
                    if(block.indexOf("+@") != -1){
                        return block.split("+@")[0];
                    }
                }
            }
            return key;
        },

        getLanguageMap: function(lang){
            var l = lang;
            if(typeof(lang) === "undefined"){
                l = language;
            }
            if(typeof(languages[l]) !== "undefined") {
                return languages[l];
            }else{
                return null;
            }
        },

        getLanguages: function(){
            return languages;
        },

        getSupportedLanguages: function(){
            return supportedLanguages;
        },

        getBrowserLanguage: function () {
            var language = navigator.browserLanguage;
            if (navigator.appName == 'Netscape') {
                language = navigator.language;
            }
            if(language.indexOf("-") != -1){
                language = language.split("-")[0];
            }
            return language.toLowerCase();
        },

        setSupportedLanguages: function(langs){
            supportedLanguages = langs;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(language === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(supported == false){
                paper.lang.setLanguage(supportedLanguages[0]);
            }
        },

        setLanguage: function (lang) {
            init = false;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(lang === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(!supported){
                throw "Language '" + lang + "' is not supported"
            }
            language = lang;
            localStorage.setItem("language", lang);
            if(typeof(languages[lang]) !== "undefined"){
                paper.lang.updateLanguage();
            }
        },

        updateLanguage: function (element) {
            var e = $(element);
            if(typeof(element) === "undefined"){
                e = $("body");
            }
            if(typeof(languages[language]) !== "undefined") {
                var map = languages[language];
                e.find("[lang-key]").each(function(){
                    var langKey = $(this).attr("lang-key");
                    var langValue = map[langKey];
                    if(typeof(langValue) === "undefined"){
                        langValue = "";
                    }
                    $(this).html(langValue);
                });
                init = true;
            }
        },

        installLanguage: function (key, map) {
            if(key.length == 2){
                var langName = key.toLowerCase();
                if(typeof(languages[langName]) !== "undefined"){
                    for(var key in map){
                        languages[langName][key] = map[key];
                    }
                }else{
                    languages[key.toLowerCase()] = map;
                }

                if(init = false && key.toLowerCase() === language){
                    paper.lang.updateLanguage();
                }
            }else{
                "Key must be two letter code (iso 639-1)";
            }
        }

    };

    var init = false;

    var languages = {};
    var supportedLanguages = [];
    var language = paper.lang.getBrowserLanguage();
    if(localStorage.getItem("language") != null){
        language = localStorage.getItem("language");
    }

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.modal = {

        version: 0.01,

        info: function (title, message, func, btnText) {
            paperPop(func, THEME_INFO, title, message, false, btnText);
        },

        warning: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_WARNING, title, message, cancelTxt, okText);
        },

        error: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_ERROR, title, message, cancelTxt, okText);
        },

        question: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_QUESTION, title, message, cancelTxt, okText);
        },

        input: function (title, value, placeholder, required, func, okText, cancelTxt) {
            if (value == null) {
                value = "";
            }
            if (placeholder == null) {
                placeholder = "";
            }

            var message = "<form onsubmit='$(\".paper-modal .paper-modal-footer .actionbtn\").click(); return false;'>\n\
                                <div class='paper-input paper-label'>\n\
                                <div class='paper-input-field'>\n\
                                <label>" + placeholder + "</label>\n\
                                <input type='text' value='" + value + "' name='modal-input'";
            if (required) {
                message += " required=''";
            }
            message += ">\n\
                        <div class='stat'></div>\n\
                        <div class='stat_active'></div></div></form>";
            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            if (okText == null) {
                okText = "Save";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, okText);
        },


        options: function(title, options, selectedOptions, func, cancelTxt){
            if(selectedOptions == null){
                selectedOptions = -1;
            }

            var message = "";
            for(var i = 0; i < options.length; i++){
                var checked = options[i] === selectedOptions;
                message += "<div class='paper-radio" + (checked ? " checked" : "") + "'>";
                message += '<input type="radio" name="modal-options" value="1"' + (checked ? " checked='checked'" : "") + '/>';
                message += "<div class='box-overlay wrippels'>";
                message += '<div class="box"></div>';
                message += '</div>';
                message += "<div class='paper-radio-label'>";
                message += '<h4>' + options[i] + '</h4>';
                message += '</div>';
                message += '</div>';

            }

            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, false);
        }


    };

    var THEME_INFO = 'modal-info';
    var THEME_WARNING = 'modal-warning';
    var THEME_ERROR = 'modal-error';
    var THEME_QUESTION = 'modal-question';
    var THEME_INPUT = 'modal-input';

    function paperPop(action, theme, title, message, btnCancel, btnOk) {
        $(".paper-modal").remove();
        $("body").append(generatePaperModalHTML(theme, title, message, btnCancel, btnOk));
        setTimeout(function () {
            installListeners();
            show();
        }, 10);

        var FADE_TIME = 500;

        var installListeners = function () {
            $(".paper-modal-overlay").click(function () {
                destroy();
            });
            $(".paper-modal .paper-modal-footer .d-button").click(function () {
                destroy();
            });
            $(".paper-modal .paper-modal-footer .actionbtn").click(function () {
                if (theme === THEME_INPUT && $("input[name='modal-input']").prop('required')) {
                    if ($("input[name='modal-input']").val() == null || $("input[name='modal-input']").val() === "") {
                        $("input[name='modal-input']").focus();
                        var stat = $("input[name='modal-input']").parent().children(".mat_input_stat_active");
                        var label = $("input[name='modal-input']").parent().children("label");
                        stat.css("background-color", "#F44336");
                        label.css("color", "#F44336");
                        return;
                    }
                }
                destroy();
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action($("input[name='modal-input']").val());
                    } else {
                        action();
                    }
                }
            });
            if (theme === THEME_INPUT) {
                $("input[name='modal-input']").select();
            }
            $(".paper-modal .paper-radio").click(function(){
                var value = $(this).find("h4").html();
                destroy();
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action(value);
                    } else {
                        action();
                    }
                }
            });
        };

        var show = function () {
            $(".paper-modal").addClass("paper-show");
        }

        var destroy = function () {
            $(".paper-modal").removeClass("paper-show");
            setTimeout(function () {
                $(".paper-modal").remove();
            }, FADE_TIME);
        };
    }

    function generatePaperModalHTML(theme, title, message, btnCancel, btnOk) {
        if (theme == null) {
            theme = THEME_INFO;
        }
        if (title == null) {
            title = "Modal title";
        }
        if (message == null) {
            message = "One fine body...";
        }
        if (btnCancel == null) {
            btnCancel = "Cancel";
        }
        if (btnOk == null) {
            btnOk = "Ok";
        }

        var buttonType;
        if (theme == THEME_INFO) {
            buttonType = "blue";
        } else if (theme == THEME_WARNING) {
            buttonType = "orange";
        } else if (theme == THEME_ERROR) {
            buttonType = "red";
        } else if (theme == THEME_QUESTION) {
            buttonType = "blue";
        } else if (theme == THEME_INPUT) {
            buttonType = "blue";
        } else {
            throw "Unknown theme: " + theme;
        }

        var btn_cancel_html = (btnCancel === false ? "" : "<button type='button' class='paper-button wrippels d-button' data-dismiss='modal'>" + btnCancel + "</button>");
        var btn_ok_html = (btnOk === false ? "" : "<button type='button' class='paper-button wrippels " + buttonType + " actionbtn'>" + btnOk + "</button>");
        return "<div class='paper-modal " + theme + "'>\n\
                    <div class='paper-modal-overlay'></div>\n\
                    <div class='paper-modal-dialog'>\n\
                        <div class='paper-modal-content'>\n\
                            <div class='paper-modal-header'>\n\
                                <h4 class='paper-modal-title'>" + title + "</h4>\n\
                            </div>\n\
                            <div class='paper-modal-body'>\n\
                                " + message + "\n\
                            </div>\n\
                            <div class='paper-modal-footer'>\n\
                                " + btn_cancel_html + "\n\
                                " + btn_ok_html + "\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>";
    }

})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-snackbar-toast\' dependence on \'paper\'");
    }

    $("body").on("click", ".paper-toast, .paper-snackbar", function(){
        var tthis = this;
        $(tthis).addClass("fade");
        setTimeout(function(){
            $(tthis).remove();
        }, 200);
    });

    /**
     * Material Snackbar and Toast Framework
     * @type {{version: number}}
     */
    paper["snackbar-toast"] = {
        version: 0.01
    };

    /**
     * Create and show snackbar
     * @param {type} msg snackbar text
     * @param {type} actionText text of the button: eg. 'Undo' or 'Dismiss'
     * @param {type} color the color of the button
     * @param {type} func when the button is clicked
     * @returns {jQuery} snackbar
     */
    paper.snackbar = function(msg, actionText, color, func){
        if(msg == null || msg == ""){
            throw "Can't create empty snackbar";
        }

        if($(".paper-snackbar").length > 0){
            var oldSnack = $(".paper-snackbar").addClass("fade");
            setTimeout(function(){
                oldSnack.remove();
            }, 200);
        }

        var html = "<div class='paper-snackbar fade'><span>" + msg + "</span>";

        if(actionText && color){
            var cls = "";
            var styls = "";
            cls = " class='fg-" + color + "'";
            html += "<button" + cls + styls + ">" + actionText + "</button>";
            if(typeof(func) !== 'function'){
                throw "Second argument should be a function";
            }
        }
        html += "</div>";
        var snackbar = $(html).appendTo($("body"));
        setTimeout(function(){
            snackbar.removeClass("fade");
            $(snackbar).children("button").click(function(){
                if(typeof(func) !== 'function'){
                    func();
                }
            });
        }, 20);
        return $(snackbar);
    };

    /**
     * Create and show toast
     * @param {type} msg toast test
     * @param {type} hideTimeout timeout to fadeout (null == never)
     * @returns {jQuery} toast
     */
    paper.toast = function(msg, hideTimeout){
        if(msg == null || msg == ""){
            throw "Can't create empty toast";
        }

        if($(".paper-toast").length > 0){
            var oldToast = $(".paper-toast").addClass("fade");
            setTimeout(function(){
                oldToast.remove();
            }, 200);
        }

        var html = "<div class='paper-toast fade'><span>" + msg + "</span></div>";
        var toast = $(html).appendTo($("body"));
        setTimeout(function(){
            toast.removeClass("fade");
            if(hideTimeout !== null){
                if(!hideTimeout){
                    hideTimeout = 3000;
                }
                setTimeout(function(){
                    $(toast).click();
                }, hideTimeout);
            }
        }, 20);

        return $(toast);
    };

})();