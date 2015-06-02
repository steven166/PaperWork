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
                var hasIcon = header.getPushLeft();
                if(header.getIcon() != null || header.getLeftAction() != null || header.getSource() != null) {
                    hasIcon = true;
                    var icon = $("<div class='icon'><div class='bar-container'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div><i></i></div>").appendTo(leftAction);
                    if(header.hasWrippels()){
                        icon.addClass("wrippels");
                    }
                    if (header.getLeftAction() !== null) {
                        icon.addClass("action-" + header.getLeftAction()).addClass("wrippels");
                    } else {
                        var icon_i = icon.find("i").addClass(header.getIcon()).appendTo(icon);
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
                    if(hasIcon){
                        title.addClass("push-left");
                    }
                }
            }
            updateActionButtons(header, eHeader);

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
                eHeader.bind("resize", function(){
                    updateActionButtons(header, eHeader);
                });
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
         * Detach Header from DOM
         * @param {Header} header
         */
        detach: function(header){
            var eHeader = header.getElement();
            eHeader.unbind("resize");
            header.setElement(null);
            eHeader.remove();
        },

        /**
         * Update changes of the header to the DOM
         * @param {Header} header
         */
        update: function (header) {
            var element = header.getElement();

            element.attr("class", "paper-header " + header.getColor());

            var renderIcon = !(header.getLeftAction() === null && header.getSource() === null && header.getIcon() === null);
            var eLeftAction = element.find(".left-action");
            if(renderIcon || header.getTitle() !== null){
                if(eLeftAction.length === 0){
                    eLeftAction = $("<div class='left-action'></div>").prependTo(element);
                }
            }else{
                eLeftAction.remove();
            }

            var key = header.getTitle();
            if(key !== null){
                var value = key;
                var attr = null;
                if(typeof(paper.lang) !== "undefined"){
                    value = paper.lang.replace(key);
                    if(value !== key){
                        attr = paper.lang.extractKey(key);
                    }
                }
                var eTitle = eLeftAction.find(".title");
                if(eTitle.length === 0){
                    eTitle = $("<div class='title'></div>").appendTo(eLeftAction);
                }
                eTitle.html(value);
                if(attr != null){
                    eTitle.attr("lang-key", attr);
                }else{
                    eTitle.removeAttr("lang-key");
                }
                var pushLeft = renderIcon || header.getPushLeft();
                if(pushLeft){
                    eTitle.addClass("push-left");
                }else{
                    eTitle.removeClass("push-left");
                }
            }else{
                eLeftAction.find(".title").remove();
            }

            if(renderIcon){
                var icon = eLeftAction.find(".icon");
                if(icon.length === 0){
                    icon = $("<div class='icon'><div class='bar-container'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div><i></i></div>").prependTo(eLeftAction);
                }
                icon.removeClass("action-menu").removeClass("action-back").removeClass("wrippels");
                if(header.hasWrippels()){
                    icon.addClass("wrippels");
                }

                if(header.getLeftAction() === "menu"){
                    icon.addClass("action-menu");
                }else if(header.getLeftAction() === "back"){
                    icon.addClass("action-back");
                }
                if(header.getIcon() !== null){
                    icon.find("i").attr("class", header.getIcon());
                }
                if(header.getSource() !== null){
                    icon.find("i").css("background-image", "url(" + header.getSource() + ")");
                }
                if(header.getLeftAction() === null && header.getSource() === null){
                    icon.remove();
                }

            }else{
                eLeftAction.find(".icon").remove();
            }

            updateActionButtons(header, element);
        }

    };

    var updateActionButtons = function(header, eHeader){
        var actionList = header.getActions();

        //Remove actionbar if empty
        if(actionList.length === 0){
            eHeader.find(".action-bar").remove();
            return;
        }

        //Add action bar if missing
        var eActionBar = eHeader.find(".action-bar");
        if(eActionBar.length === 0 ){
            eActionBar = $("<div class='action-bar'></div>").appendTo(eHeader);
        }
        eActionBar.children().remove();

        //Order actions
        var orderedList = orderActions(actionList);

        //Render always icons
        var takenSlots = 0;
        if(typeof(orderedList["always"]) !== "undefined"){
            takenSlots = orderedList["always"].length;
            for (var i = 0; i < orderedList["always"].length; i++) {
                var action = orderedList["always"][i];
                if(action.getContent() != null){
                    var hContent = action.getContent();
                    if(typeof(paper.lang) !== "undefined"){
                        hContent = paper.lang.replace(hContent);
                    }
                    $(hContent).appendTo(eActionBar);
                }else {
                    var eAction = $("<div class='action wrippels' tabindex='0'></div>").appendTo(eActionBar);
                    if (action.getId() !== null) {
                        eAction.attr("id", action.getId());
                    }
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                }
            }
        }

        //Find amount of slot available
        var headerWidth = eHeader.width();
        var slots = 0;
        if(headerWidth <= 400){
            slots = 1;
        }else if(headerWidth <= 456){
            slots = 2;
        }else if(headerWidth <= 512){
            slots = 3;
        }else{
            slots = 4;
        }
        var freeSlots = slots - takenSlots;
        var overlaySlosts = 0;
        if(typeof(orderedList["never"]) !== "undefined"){
            overlaySlosts = orderedList["never"].length;
        }
        var renderedActions = [];

        //Render ifroom and withtext actions
        for(var i = 0; i < orderedList["all"].length; i++){
            if(freeSlots <= 0){
                break;
            }
            var action = orderedList["all"][i];
            if(action.getShowAsAction() === "ifroom" || action.getShowAsAction() === "withtext"){
                if(action.getContent() != null){
                    var hContent = action.getContent();
                    if(typeof(paper.lang) !== "undefined"){
                        hContent = paper.lang.replace(hContent);
                    }
                    $(hContent).appendTo(actionBar);
                    freeSlots += -1;
                    renderedActions.push(action.getId());
                }else {
                    var eAction = $("<div class='action wrippels' tabindex='0'></div>").appendTo(eActionBar);
                    if (action.getId() !== null) {
                        eAction.attr("id", action.getId());
                    }
                    if(action.getShowAsAction() === "withtext"){
                        eAction.addClass("with-text");
                    }
                    if(action.getShowAsAction() === "withtext" && freeSlots >= 3){
                        var title = action.getTitle();
                        if(typeof(paper.lang) !== "undefined"){
                            title = paper.lang.replace(title);
                        }
                        $("<span>" + title + "</span>").appendTo(eAction);
                        freeSlots += -3;
                    }else{
                        freeSlots += -1;
                    }
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                    renderedActions.push(action.getId());
                }
            }
        }

        var eOverlay = $("<div class='action-overlay hide'></div>");
        for(var i = 0; i < orderedList["all"].length; i++){
            var action = orderedList["all"][i];
            if(action.getShowAsAction() !== "always"){
                var exists = false;
                for(var j = 0; j < renderedActions.length; j++){
                    if(renderedActions[j] === action.getId()){
                        exists = true;
                    }
                }
                if(exists){
                    continue;
                }

                var title = action.getTitle();
                if(typeof(paper.lang) !== "undefined"){
                    title = paper.lang.replace(title);
                }
                var eAction = $("<div class='action wrippels' tabindex='0'>" + title + "</div>").appendTo(eOverlay);
                if(action.getId() !== null){
                    eAction.attr("id", action.getId());
                }
                if(action.getIcon() !== null){
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                }

            }
        }
        if(eOverlay.children().length > 0){
            var expandButton = $("<div class='action wrippels expand-button' tabindex='0'><i class='mdi-navigation-more-vert'></i></div>").appendTo(eActionBar);
            eOverlay.appendTo(eActionBar);
        }
        setTimeout(function(){
            var eTitle = eHeader.find(".title");
            if(eTitle.length > 0){
                var width = eActionBar.width();
                eTitle.css("right", width + "px");
            }
        }, 20);
    };

    var orderActions = function(actionList){
        var orderList = {};
        var min = 0;
        var max = 0;
        for(var i = 0; i < actionList.length; i++){
            var action = actionList[i];
            var order = action.getOrderInCategory();
            if(typeof(orderList[order]) === "undefined"){
                orderList[order] = [];
                if(order > max){
                    max = order;
                }
                if(order < min){
                    min = order;
                }
            }
            orderList[order].push(action);
        }

        var newActionList = {"all":[]};
        for(var i = min; i <= max; i++){
            if(typeof(orderList[i]) !== "undefined"){
                for(var j = 0; j < orderList[i].length; j++){
                    var action = orderList[i][j];
                    if(typeof(newActionList[action.getShowAsAction()]) === "undefined"){
                        newActionList[action.getShowAsAction()] = [];
                    }
                    newActionList[action.getShowAsAction()].push(action);
                    newActionList["all"].push(action);
                }
            }
        }
        return newActionList;
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
        this.pushLeft = false;
        this.wrippels = true;

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
            if (typeof(options.pushLeft) !== "undefined") {
                this.setPushLeft(options.pushLeft);
            }
            if (typeof(options.wrippels) !== "undefined") {
                this.setWrippels(options.wrippels);
            }

        }
    }

    Header.prototype.setWrippels = function(wrippels){
        this.wrippels = wrippels;
    };

    Header.prototype.hasWrippels = function(){
        return this.wrippels;
    };

    Header.prototype.setPushLeft = function(pushLeft){
        this.pushLeft = pushLeft;
    };

    Header.prototype.getPushLeft = function(){
        return this.pushLeft;
    };

    Header.prototype.setElement = function(element){
        this.element = element;
    };

    Header.prototype.getElement = function(){
        return this.element;
    };

    Header.prototype.setTitle = function (title) {
        if(typeof(title) === "undefined"){
            this.title = null;
        }else{
            this.title = title;
        }
    };

    Header.prototype.getTitle = function(){
        return this.title;
    };

    Header.prototype.setIcon = function (icon) {
        if(typeof(icon) === "undefined"){
            this.icon = null;
        }else{
            this.icon = icon;
        }
    };

    Header.prototype.getIcon = function () {
        return this.icon;
    };

    Header.prototype.setSource = function (src) {
        if(typeof(src) === "undefined"){
            this.src = null;
        }else{
            this.src = src;
        }
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

    Header.prototype.render = function(){
        return paper.header.render();
    };

    Header.prototype.update = function(){
        paper.header.update(this);
    };

    Header.prototype.attach = function(element){
        paper.header.attach(this, element);
    };

    Header.prototype.detach = function(){
        paper.header.detach(this);
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