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

    var ajaxRegister = [];

    var findEmptyKey = function(map, i){
        if(typeof(i) === "undefined"){
            i = 1;
        }
        if(typeof(map[i]) === "undefined"){
            return i;
        }else{
            return findEmptyKey(map, i+1);
        }
    };

    /**
     * Material Application Framework
     * @type {{version: string, create: Function}}
     */
    paper.app = {

        /**
         * Create new application
         * @param {string} title - Application title
         * @param {string} color - Default color of your app
         * @param {string} iconSrc - The source path to your icon
         * @returns {App}
         */
        create: function(title, color, iconSrc){
            return new App(title, color, iconSrc);
        },

        post: function(url, data, success, dataType){
            if(typeof(this.id) !== "undefined"){
                return this.ajax({url: url, data: data, success: success, dataType: dataType, type: "POST"});
            }else{
                return paper.app.ajax({url: url, data: data, success: success, dataType: dataType, type: "POST"});
            }
        },

        get: function(url, data, success, dataType){
            if(typeof(this.id) !== "undefined"){
                return this.ajax({url: url, data: data, success: success, dataType: dataType, type: "GET"});
            }else{
                return paper.app.ajax({url: url, data: data, success: success, dataType: dataType, type: "GET"});
            }
        },

        ajax: function(url, settings){
            var jqXHR = $.ajax(url, settings);
            var onFail = undefined;
            var onAlways = undefined;

            var customJqXHR = {
                done: jqXHR.done,
                fail: function(func){
                    onFail = func;
                },
                always: function(func){
                    onAlways = func;
                },
                then: jqXHR.then,
                readyState: jqXHR.readyState,
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                responseXML : jqXHR.responseXML ,
                responseText : jqXHR.responseText ,
                setRequestHeader: jqXHR.setRequestHeader,
                getAllResponseHeaders: jqXHR.getAllResponseHeaders,
                getResponseHeader: jqXHR.getResponseHeader,
                statusCode: jqXHR.statusCode,
                abort: jqXHR.abort,
                original: jqXHR
            };

            if(typeof(this.ajaxRegister) !== "undefined"){
                var index = findEmptyKey(this.ajaxRegister);
                var xhrStore = this.ajaxRegister;
                this.ajaxRegister[index] = customJqXHR;
            }else{
                var index = findEmptyKey(ajaxRegister);
                var xhrStore = ajaxRegister;
                ajaxRegister[index] = customJqXHR;
            }

            jqXHR.fail(function(jqXHR, textStatus, errorThrown){
                var canceled = false;
                if(typeof(onFail) !== "undefined"){
                    canceled = onFail(jqXHR, textStatus, errorThrown) === false;
                }

                if(canceled){return;}
                if(typeof(paper.app.errorHandlers[jqXHR.status]) !== "undefined"){
                    canceled = paper.app.errorHandlers[jqXHR.status](jqXHR, textStatus, errorThrown) === false;
                }

                if(canceled){return;}
                if (jqXHR.status === 0) {
                    if (jqXHR.statusText === 'abort') {
                        if(typeof(paper.app.errorHandlers.canceled) !== "undefined"){
                            canceled = paper.app.errorHandlers.canceled(jqXHR, textStatus, errorThrown) === false;
                        }
                    }else{
                        if(typeof(paper.app.errorHandlers.connectionError) !== "undefined") {
                            canceled = paper.app.errorHandlers.connectionError(jqXHR, textStatus, errorThrown) === false;
                        }
                    }
                }else if(jqXHR.status >= 400 && jqXHR.status < 500){
                    if(typeof(paper.app.errorHandlers.connectionError) !== "undefined") {
                        canceled = paper.app.errorHandlers.connectionError(jqXHR, textStatus, errorThrown) === false;
                    }
                }else if(jqXHR.status >= 500){
                    if(typeof(paper.app.errorHandlers.serverError) !== "undefined") {
                        canceled = paper.app.errorHandlers.serverError(jqXHR, textStatus, errorThrown) === false;
                    }
                }
                if(canceled){return;}
                if(!(jqXHR.status === 0 && jqXHR.statusText === "abort")){
                    if(typeof(paper.app.errorHandlers.error) !== "undefined") {
                        paper.app.errorHandlers.error(jqXHR, textStatus, errorThrown) === false;
                    }
                }
            });
            jqXHR.always(function(data, textStatus, jqXHR){
                if(typeof(onAlways) !== "undefined"){
                    onAlways(data, textStatus, jqXHR);
                }
                delete xhrStore[index];
            });

            return customJqXHR;
        },

        errorHandlers: {
            error: undefined,
            canceled: undefined,
            connectionError: undefined,
            serverError: undefined,
            notfound: "<h1><i class='mdi-alert-error fg-red'></i>Nothing here...</h1><h2>You'd better go <button onclick='history.back()' class='paper-button wrippels'><i class='mdi-navigation-arrow-back'></i>back</button></h2>"
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
            var clss = content;
            var pContent = "[activity='" + id + "']";
        }else{
            var pContent = content;
            var clss = activity;
        }
        if(typeof(clss) === "undefined"){
            throw "missing argument";
        }
        if(id === null || id === ""){
            throw "Activity id cannot be empty";
        }
        if(typeof(this.activities[id]) !== "undefined") {
            throw "Activity '" + id + "' already exists";
        }

        //Add properties to activity
        var props = {};
        props.content = pContent;
        props.id = id;
        props["class"] = clss

        //Store activity
        this.activities[id] = props;
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
        $("head meta[name='theme-color']").attr("content", paper.colors[color]);
        if (typeof(paper.wrippels) !== "undefined") {
            var isLight = paper.wrippels.isLightBackground(this.element.children(".app-header"));
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
        leftAction.children(".title").addClass("push-left");
        if(icon.length == 0){
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
            var activityId = eActivity.attr("activity");
            if(activityId !== null && typeof(activityId) !== "undefined") {
                var activity = app.activities[activityId];
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
        return app.activities[eActivity.attr("activity")];
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
            var groupName = appContent.children(".paper-group").attr("group");
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
            var activityId = $(this).attr("activity");
            var activity = app.activities[activityId];
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
        var eGroup = $("<div class='paper-group fade' group='" + groupName + "'></div>");
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
            app.header.update();

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
        console.debug("Create Activity: " + activityName);
        var activity = app.activities[activityName];
        if(typeof(activity) !== "undefined") {
            //Reset settings
            activity.loaded = function () {};
            activity.isLoaded = false;

            //Create jQuery object
            var eActivity = $("<div class='paper-activity'></div>");
            activity.element = eActivity;
            eActivity.attr("activity", activity.id);
            var activityArg = invokeArg;
            if (activityArg === null) {
                activityArg = undefined;
            }
            if (typeof(activityArg) !== "undefined") {
                eActivity.attr("data-arg", invokeArg);
            }

            //Add activity-frame
            var activityFrame = $("<div class='activity-frame fade'></div>").appendTo(eActivity);
            activityFrame.attr("bg", "light");

            //Add content from the activity it self
            var clone = activity.content.clone();
            var content = $("<div></div>");
            content.html(clone.html());
            content.addClass("activity-body").addClass("fade");
            content.attr("id", "body-" + activity.id);
            content.removeAttr("activity");

            //Call Activity.onCreate
            if (typeof(activity.onCreate) !== "undefined") {
                var succeed = activity.onCreate(content, activityArg);
                if (succeed === false) {
                    //Activity is still loading
                    //Add loaded callback to continue initializing the activity when it is loaded
                    activity.loaded = function () {
                        activity.isLoaded = true;
                        if (activity.visible) {
                            // Hide load rotator and show content
                            // (Only when the activity is visible, otherwise it will be called on the onVisible event)
                            activityFrame.addClass("fade");
                            setTimeout(function () {
                                activityFrame.children(".paper-loading").remove();
                                paper.initModules(content);
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
                    //Add load rotator when the activity is still loading
                    paper.loading.create().addClass("center").appendTo(activityFrame);
                } else {
                    //Append content to frame
                    activity.isLoaded = true;
                    paper.initModules(content);
                    content.appendTo(activityFrame);
                }
            } else {
                //Append content to frame
                activity.isLoaded = true;
                paper.initModules(content);
                content.appendTo(activityFrame);
            }

            //Create header
            var hOptions = {color: color, title: activity.title, src: activity.src, pushLeft: activity.pushLeft};
            if (typeof(activity.actions) !== "undefined") {
                hOptions.actions = activity.actions;
            }
            var header = paper.header.create(hOptions);
            paper.header.attach(header, eActivity);
            activity.header = header;

            //Add fade in class
            eActivity.children(".paper-header").addClass("fade");

            //Move <style> from activity-body to activity root
            var styles = content.children("style");
            if(styles.length > 0) {
                styles.prependTo(eActivity);
            }

            return eActivity;
        }else{
            //Activity does not exists
            //Show 'Not found' message
            var eActivity = $("<div class='paper-activity'></div>");
            eActivity.attr("activity", "undefined");
            var activityArg = invokeArg;
            if (activityArg === null) {
                activityArg = undefined;
            }
            if (typeof(activityArg) !== "undefined") {
                eActivity.attr("data-arg", invokeArg);
            }
            var activityFrame = $("<div class='activity-frame fade'></div>").appendTo(eActivity);

            var activityBody = $("<div class='activity-body'></div>").appendTo(activityFrame);
            var content = $("<div class='activity-empty'>" + paper.app.errorHandlers.notfound + "</div>").appendTo(activityBody);
            content.attr("activity", activityName);
            return eActivity;
        }
    }

    /**
     * Show Activity (triggers loaded() )
     * @param {Activity} activity - Activity
     */
    function showActivity(activity){
        if(activity.visible){
            return;
        }
        console.debug("Show Activity: " + activity.id);
        if(typeof(paper.lang) !== "undefined"){
            paper.lang.updateLanguage($("[activity=" + activity.id + "]"));
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
        if(!activity.visible){
            return;
        }
        console.debug("Hide Activity: " + activity.id);
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
        console.debug("Destory Activity: " + activity.id);
        if(typeof(activity.onDestroy) !== "undefined"){
            activity.onDestroy();
        }
        if(typeof(activity.header) !== "undefined"){
            activity.header.detach();
        }
        if(typeof(activity.element) !== "undefined") {
            activity.element.remove();
            activity.element = undefined;
        }
        if(typeof(activity.ajaxRegister) !== "undefined"){
            for(var key in activity.ajaxRegister){
                var customXHR = activity.ajaxRegister[key];
                customXHR.abort();
            }
            activity.ajaxRegister = [];
        }
    }

    /**
     * Initialze application
     */
    App.prototype.init = function(){
        if(this.isInit){
            return;
        }
        console.info("init app");
        if (!("import" in document.createElement("link"))) {
            // HTML5 Imports not supported
            // Do it manually
            $.holdReady(true);
            var importsTodo = 0;
            $("link[rel='import']").each(function(){
                importsTodo++;
                var url = $(this).attr("href");
                var getter = $.get(url);
                getter.done(function(data){
                    $("body").append(data);
                });
                getter.always(function(){
                    importsTodo--;
                    if(importsTodo == 0){
                        $.holdReady(false);
                    }
                });
            });
        }

        this.isInit = true;
        var app = this;
        appTitle = app.title;
        if(typeof(paper.lang) !== "undefined"){
            appTitle = paper.lang.replace(appTitle);
        }
        $("head").append("<meta name='theme-color' content='" + paper.colors[app.color] + "'>");
        var materialApp = $("<div class='material-app fade'></div>");
        var appHeader = $("<div class='app-header'></div>").addClass(this.color).appendTo(materialApp);
        var header = paper.header.create({
            icon: app.iconSrc,
            color: app.color
        });
        paper.header.attach(header, materialApp);
        app.header = header;
        var appContent = $("<div class='app-content'></div>").appendTo(materialApp);

        this.element = materialApp;

        var showApp = function(){
            // Call activities
            console.info("init activities");
            for(var key in app.activities){
                var prop = app.activities[key];
                var object = new prop["class"]();

                object.content = prop.content;
                object.id = prop.id;
                object.visible = false;
                object.isLoaded = false;
                object.post = paper.app.post;
                object.get = paper.app.get;
                object.ajax = paper.app.ajax;
                object.ajaxRegister = [];

                app.activities[key] = object;
            }

            //Get content from imports
            var importedHtml = [];
            $("link[rel='import']").each(function(){
                if(this.import !== null && typeof(this.import) !== "undefined") {
                    var template = $(this.import.querySelector("template"));
                    if (template.length > 0) {
                        importedHtml.push(template);
                        console.debug("load import: " + $(this).attr("href"));
                    }
                }
            });

            //Init activities
            for(var key in app.activities){
                var activity = app.activities[key];
                var content = $(activity.content);
                console.log("content length: " + activity.content);
                if(content.length == 0){
                    //Not found in DOM -> Search imports
                    var exists = false;
                    for(var i = 0; i < importedHtml.length; i++){
                        var template = importedHtml[i];
                        if(template.attr("activity") === key){
                            //Copy template into div
                            content = $("<div></div>").html(template.html());
                            var attributes = template[0].attributes;
                            $.each(attributes, function() {
                                content.attr(this.name, this.value);
                            });
                            exists = true;
                            break;
                        }
                    }

                    if(!exists) {
                        //Create new element
                        content = $("<div></div>");
                    }
                }else{
                    content.remove();
                }
                activity.content = content;
            }

            //Add app to DOM
            materialApp.appendTo("body");
            setTimeout(function(){
                materialApp.removeClass("fade");
                routingManager.update();
                installAppListeners(app);
                app.goToUrl(location.href, false);

                if(typeof(paper.wrippels) !== "undefined"){
                    var lightBackground = paper.wrippels.isLightBackground(appHeader);
                    header.getElement().attr("bg", (lightBackground ? "light" : "dark"));
                }
            }, 20);
        };

        $("body").ready(function(){
            showApp();
        });
    };

    /**
     * Install app listeners
     * @param {App} app
     */
    function installAppListeners(app){
        //When window resizes
        $(window).resize(function(){
            app.updateLayout();
        });
        //When navigate (eg. forward and back)
        $(window).bind("popstate", function(event){
            app.goToUrl(location.href, false);
        });

        $("body").on("click", ".material-app > .paper-overlay > *", function(){
            return false;
        });
        //Close overlay when click on close button, or the overlay
        $("body").on("click", ".material-app > .paper-overlay, .material-app > .paper-overlay .paper-header .left-action .icon", function(){
            if($(this).hasClass("paper-overlay") || $(this).hasClass("icon")){
                app.back();
            }
        });
        //Fire activity.onVisible and activity.onInvisible when tab becomes invisible
        document.addEventListener("visibilitychange", function(){
            for (var i = 0; i <= 3; i++) {
                var activity = getCurrentActivity(app, i);
                if(activity != null){
                    if(document.hidden && activity.visible){
                        if(typeof(activity.onInvisible) !== "undefined"){
                            activity.onInvisible();
                        }
                    }else if(!document.hidden && activity.visible){
                        if(typeof(activity.onVisible) !== "undefined"){
                            activity.onVisible();
                        }
                    }

                }
            }
        }, false);
        //Click event on icon button (top-left icon)
        $("body").on("click", ".material-app > .paper-header .left-action .icon", function(){
            var groupData = getCurrentGroup(app);
            var groupName = groupData[0];
            var groupArg = groupData[1];
            var group = app.activityGroups[groupName];

            if($(this).hasClass("action-menu")){
                //open drawer
                if(typeof(group) !== "undefined") {
                    if (typeof(group.drawer) !== "undefined") {
                        app.overlay(group.drawer, groupArg);
                    } else if (typeof(group.onLeftAction) !== "undefined") {
                        group.onLeftAction();
                    }
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
                if(typeof(group) !== "undefined") {
                    if (typeof(group.onLeftAction) !== "undefined") {
                        group.onLeftAction();
                    }
                }
            }
        });
    }

    /**
     * Update positions and sizes of the activities and position of the viewport
     */
    App.prototype.updateLayout = function(){
        console.debug("update layout");
        var selectedActivity = 1;
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
                    selectedActivity = 2;
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
                selectedActivity = 2;
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
                selectedActivity = 2;
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
                selectedActivity = 3;
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

        var title = this.title;
        var groupName = getCurrentGroup(this)[0];
        var vGroup = this.activityGroups[groupName];
        if(typeof(vGroup) !== "undefined") {
            if (typeof(vGroup.title) !== "undefined") {
                title = vGroup.title;
            }
        }

        if(selectedActivity > 1){
            for(var i = 1; i < selectedActivity; i++){
                var iActivity = getCurrentActivity(this, i-1);
                if(typeof(iActivity.title) !== "undefined"){
                    title = iActivity.title;
                }
            }
        }

        var vActivity = getCurrentActivity(this, selectedActivity-1);
        if(typeof(vActivity) !== "undefined") {
            if (typeof(vActivity.title) !== "undefined") {
                title = vActivity.title;
            }
            vActivity.header.setTitle(title);
            vActivity.header.setPushLeft(true);
            vActivity.header.setIcon(null);
            vActivity.header.setSource(null);
            vActivity.header.setWrippels(true);
            vActivity.header.update();
            if(selectedActivity != 1){
                var iActivity = getCurrentActivity(this, 0);
                if(typeof(iActivity) !== "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
            if(selectedActivity != 2){
                var iActivity = getCurrentActivity(this, 1);
                if(typeof(iActivity) !==  "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
            if(selectedActivity != 3){
                var iActivity = getCurrentActivity(this, 2);
                if(typeof(iActivity) !==  "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
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
        while(u.substring(u.length-1, u.length) === "*"){
            u = u.substring(0, u.length-1);
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

    function RoutingManager(){

        var manager = this;
        var isInit = false;
        var autoBack = false;

        var customStates = [];

        /**
         * Find the current position
         * @param urlList list of urls in the history
         * @param url Current url
         * @returns {number, boolean} position or false if the url does not exists in the url list
         */
        var findPosition = function(urlList, url){
            console.debug("routing -> [FIND POSITION] " + url);
            var pos = -1;
            for(var i = 0; i < urlList.length; i++){
                var u = urlList[i];
                var indexBack = urlList.length - i - 1;
                if(u === url){
                    console.debug("routing -> " + indexBack + ". (x) " + u);
                    pos = indexBack;
                }else{
                    console.debug("routing -> " + indexBack + ". ( ) " + u);
                }
            }
            console.debug("routing -> [POSITION] " + pos);
            if(pos === -1){
                return false;
            }else{
                return pos;
            }
        };

        /**
         * Find how many positions the new url is back from the current position
         * @param newUrl The new URL
         * @param oldUrl The current URL
         * @param oldUrls List of all the urls in the history
         * @returns {boolean, int} number of positions back, false if it cannot find the new or the old position
         */
        var getAmountBack = function(oldUrls, oldUrl, newUrl){
            var newIndex = findPosition(oldUrls, newUrl);
            var currentIndex = findPosition(oldUrls, oldUrl);

            var amountBack = false;
            if(newIndex !== false && currentIndex !== false) {
                var amountBack = currentIndex - newIndex;
            }
            console.debug("routing -> [AMOUNT BACK] " + amountBack);
            return amountBack;
        };

        /**
         * Find out how many popups should be closed
         * @param oldUrl
         * @param newUrl
         * @return {int} amount of popups should close
         */
        var shouldClosePopup = function(oldUrl, newUrl){
            var oldPopupCount = 0;
            var newPopupCount = 0;
            //Count old popups
            console.debug("routing -> POPUPS OLD: " + oldUrl);
            for(var i = 0; i < oldUrl.length; i++){
                var sub = oldUrl.substring(oldUrl.length-1-i, oldUrl.length-i);
                if(sub === "*"){
                    oldPopupCount++;
                }else{
                    break;
                }
            }
            //Count new popups
            console.debug("routing -> POPUPS NEW: " + newUrl);
            for(var i = 0; i < newUrl.length; i++){
                var sub = newUrl.substring(newUrl.length-1-i, newUrl.length-i);
                if(sub === "*"){
                    newPopupCount++;
                }else{
                    break;
                }
            }
            console.debug("routing -> PopupCount [" + oldPopupCount + "] [" + newPopupCount + "]");
            var dif = oldPopupCount - newPopupCount;
            if(dif < 0){
                dif = 0;
            }
            return dif;
        };

        /**
         * Register new pushState with callBack
         * @param callBack - called when the popup should close
         */
        this.pushCustomState = function(callBack){
            console.debug("routing -> [POPUP] " + location.href);
            customStates.push(callBack);
            history.pushState(document.title, document.title, location.href + "*");
            var urls = getHistoryItems();
            urls.push(location.href);
            setHistoryItems(urls);
            setHistoryLength(history.length);
            setLastUrl(location.href);
        };

        /**
         * Replace current URL with a new one
         * @param url - new url
         * @param title - new title
         */
        this.replaceUrl = function(url, title){
            console.debug("routing -> [REPLACE] " + location.href + " ->" + url);
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
         * @param {boolean} modifyHistory
         * @return {boolean} true if back
         */
        this.goTo = function(newUrl, title, old, modifyHistory){
            var oldUrl = old;
            if(typeof(oldUrl) === "undefined"){
                oldUrl = location.href;
            }
            var modHistory = true;
            if(modifyHistory === false){
                modHistory = false;
            }
            console.debug("routing -> [GOTO] " + oldUrl + " ->" + newUrl);

            var oldLength = getHistoryLength();
            var oldUrls = getHistoryItems();
            var newLength = history.length;

            if(newUrl !== oldUrl){
                console.debug("routing -> [LOCATION CHANGED]");
                var oldUrlData = getPath(oldUrl);
                var newUrlData = getPath(newUrl);
                var isNewLower = false;
                var isReplace = false;

                //Check if popups should close
                var popupsShouldClose = shouldClosePopup(oldUrl, newUrl);
                //Close popups
                for(var i = 0; i < popupsShouldClose; i++){
                    console.debug("routing -> [CLOSE POPUP]");
                    if(typeof(customStates[customStates.length - 1]) !== "undefined"){
                        customStates[customStates.length - 1]();
                        customStates.splice(customStates.length - 1, 1);
                    }
                }

                if(oldUrlData.overlay === newUrlData.overlay &&
                        oldUrlData.overlayArg === newUrlData.overlayArg &&
                        oldUrlData.group === newUrlData.group &&
                        oldUrlData.arg === newUrlData.arg &&
                        oldUrlData.acts.length === newUrlData.acts.length){
                    var same = true;
                    for(var i = 0; i < oldUrlData.acts.length; i++){
                        if(oldUrlData.acts[i].activity !== newUrlData.acts[i].activity ||
                            oldUrlData.acts[i].arg !== newUrlData.acts[i].arg){
                            same = false;
                        }
                    }
                    if(same){
                        console.debug("routing -> [LOCATION SAME]");
                        for(var i = 0; i < popupsShouldClose; i++){
                            if(oldUrls.length >= 3) {
                                var closeUrl = oldUrls[oldUrls.length - 1];
                                var gotoUrl = oldUrls[oldUrls.length - 2];
                                if(closeUrl.substring(closeUrl.length-1, closeUrl.length) === "*"){
                                    console.debug("routing -> [CLOSE URL] " + closeUrl + " -> " + gotoUrl);
                                    var title = document.title;
                                    autoBack = true;
                                    history.go(-1);
                                    setTimeout(function(){
                                        history.pushState(title, title, gotoUrl);
                                    }, 10);
                                    oldUrls.splice(oldUrls.length-1, 1);
                                }
                            }
                        }

                        setHistoryItems(oldUrls);
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }
                }

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

                console.debug("routing -> [isNewLower] " + isNewLower);
                console.debug("routing -> [isReplace] " + isReplace);
                if(isReplace && !isNewLower){
                    //Replace current state
                    manager.replaceUrl(newUrl, title);
                }else if(isNewLower){
                    //Go back
                    var amountBack = getAmountBack(oldUrls, oldUrl, newUrl);

                    console.debug("routing -> [goBack] " + amountBack);
                    if(amountBack === false){
                        //History item not exists
                        console.debug("routing -> [NOT FOUND]");

                        var oldTitle = document.title;
                        history.replaceState(title, title, newUrl);
                        history.pushState(oldTitle, oldTitle, oldUrl);
                        if(modHistory) {
                            autoBack = true;
                            history.back();
                        }
                        var currentPos = findPosition(oldUrls, oldUrl);
                        if(currentPos === false) {
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
                        console.debug("routing -> [GO BACK] " + amountBack);
                        autoBack = true;
                        if(modHistory) {
                            history.go(amountBack);
                        }
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }
                }else{
                    console.debug("routing -> [GO FORWARD]");
                    //Go forward
                    var oldLength = history.length;
                    if(modHistory) {
                        history.pushState(title, title, newUrl);
                    }
                    var newLength = history.length;
                    if(newLength == oldLength +1){
                        //Do nothing
                        console.debug("routing -> [DO NOTHING]");
                    }else if(newLength <= oldLength){
                        //Rewrite history
                        console.debug("routing -> [REWRITE HISTORY]");
                        console.debug("routing -> [OLD LENGTH] " + oldLength);
                        console.debug("routing -> [NEW LENGTH] " + newLength);
                        var dif = oldLength - newLength;
                        console.debug("routing -> [DIFFERENTS] " + dif);
                        if(dif > oldUrls.length){
                            oldUrls = [];
                        }else{
                            var nurls = [];
                            for(var i = 0; i < oldUrls.length-dif-1; i++){
                                nurls.push(oldUrls[i]);
                            }
                            oldUrls = nurls;
                        }
                        console.debug("routing -> [NEW HISTORY] -> " + oldUrls.length);
                    }
                    oldUrls.push(newUrl);

                    setHistoryItems(oldUrls);
                    setHistoryLength(history.length);
                    setLastUrl(newUrl);
                }
            }else{
                console.debug("routing -> [LOCATION SAME]");

                setHistoryLength(history.length);
                setLastUrl(newUrl);
            }
            return false;
        };

        /**
         * Check if there are changes in the browser history, and respond to it if necessary
         */
        this.update = function(){
            console.debug("routing -> [UPDATE]");
            if(!isInit){
                init();
            }else {
                if(autoBack){
                    console.debug("routing -> [AUTO BACK]");
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
                    console.debug("routing -> [NEW SESSION]");
                    oldUrls.push(newUrl);
                    setHistoryItems(oldUrls);
                    setHistoryLength(newLength);
                    setLastUrl(newUrl);
                }else{
                    var moved = false;
                    if(oldLength == newLength){
                        if(oldUrl === newUrl){
                            //Reload -> do nothing
                            console.debug("routing -> [RELOAD]");
                        }else{
                            //Moved
                            moved = true;
                            console.debug("routing -> [MOVED]");
                        }
                    }else if(oldLength +1 == newLength){
                        //Go forward -> Add new entry
                        oldUrls.push(newUrl);
                        console.debug("routing -> [FORWARD]");
                    }else if(oldLength +1 < newLength){
                        //Went away - Clear history
                        oldUrls = [newUrl];
                        console.debug("routing -> [AWAY]");
                    }else{
                        //Moved
                        moved = true;
                        console.debug("routing -> [MOVED]");
                    }
                    if(moved){
                        manager.goTo(newUrl, document.title, oldUrl, false);
                        //var amountBack = getAmountBack(oldUrls, oldUrl, newUrl);
                        //if(amountBack === false){
                        //    //Cannot find current point
                        //    oldUrls.push(newUrl);
                        //    console.debug("routing -> not found: push " + newUrl);
                        //}else{
                        //    //Create new history
                        //    console.debug("routing -> [CREATE NEW HISTORY]");
                        //    console.debug(oldUrls);
                        //    var newUrls = [];
                        //    for(var i = 0; i < oldUrls.length + amountBack; i++){
                        //        newUrls.push(oldUrls[i]);
                        //    }
                        //    newUrls.push(newUrl);
                        //    console.debug(newUrls);
                        //    oldUrls = newUrls;
                        //}
                    }else{
                        setHistoryItems(oldUrls);
                        setHistoryLength(newLength);
                        setLastUrl(newUrl);
                    }
                }
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
            console.debug("routing -> [INIT]");
            $(window).bind("popstate", function(){
                manager.update();
            });
            manager.update();
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

    var routingManager = new RoutingManager();
    paper.app.routingManager = routingManager;

})();