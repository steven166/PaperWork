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
                    var title = $("<div class='title'>" + header.getTitle() + "</div>").appendTo(leftAction);
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
            //TODO: paper.header.update()
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