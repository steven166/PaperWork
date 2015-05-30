(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }
    if (typeof(paper.header) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper-header\'");
    }

    var working = false;

    /**
     * Material Application Framework
     * @type {{version: string, create: Function}}
     */
    paper.app = {

        /**
         * Version of 'paper-app.js'
         */
        version: 0.01,

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
        if(title === null || title === ""){
            throw "Title cannot be empty";
        }
        if(typeof(paper.colors[color]) === "undefined"){
            throw "Unknown color '" + color + "'";
        }

        this.title = title;
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
        object.content = $(pContent);
        object.id = id;
        object.visible = false;
        object.isLoaded = false;
        //Store activity
        this.activities[id] = object;
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
            app.element.children(".app-header").attr("class", "app-header " + color);
            if (typeof(paper.wrippels) !== "undefined") {
                var isLight = paper.wrippels.isLightBackground(app.element.children(".app-header"));
                appHeader.attr("bg", (isLight ? "light" : "dark"));
                eGroup.children(".paper-activity").attr("bg", (isLight ? "light" : "dark"));
            }
            var leftAction = appHeader.children(".left-action");
            var title = app.title;
            if (typeof(group.title) !== "undefined") {
                title = group.title;
            }
            leftAction.children(".title").html(title);
            if (group.leftAction === "menu") {
                leftAction.children(".icon").addClass("action-menu").removeClass("action-back");
            } else if (group.leftAction === "back") {
                leftAction.children(".icon").addClass("action-back").removeClass("action-menu");
            } else {
                if (typeof(group.icon) !== "undefined" && group.icon !== null) {
                    leftAction.children(".icon").children("i").attr("class", group.icon);
                } else {
                    leftAction.children(".icon").children("i").attr("class", app.icon);
                }
            }

            //Add to DOM
            eGroup.appendTo(appContent);
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
                    $("<div class='paper-loading center fg-" + color + "'><svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg></div>").appendTo(activityFrame);
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
            return window.sessionStorage.getItem("routing.lasturl");
        };

        /**
         * Get the last history length from sessionStorage
         * @returns {string,null}
         */
        var getHistoryLength = function(){
            return window.sessionStorage.getItem("routing.length");
        };

        /**
         * Get array of history items from sessionStorage
         * @returns {Array} urls
         */
        var getHistoryItems = function(){
            var itemLength = window.sessionStorage.getItem("routing.items");
            var items = [];
            if(itemLength != null){
                for(var i = 0; i < itemLength; i++){
                    items.push(window.sessionStorage.getItem("routing.item_" + i));
                }
            }
            return items;
        };

        /**
         * Set the last url in the sessionStorage
         * @param {int} historyLength
         */
        var setLastUrl = function(lastUrl){
            window.sessionStorage.setItem("routing.lasturl", lastUrl);
        };

        /**
         * Set the current history length in the sessionStorage
         * @param {int} historyLength
         */
        var setHistoryLength = function(historyLength){
            window.sessionStorage.setItem("routing.length", historyLength);
        };

        /**
         * Set the history items in the sessionStorage
         * @param {Array} items - urls
         */
        var setHistoryItems = function(items){
            window.sessionStorage.setItem("routing.items", items.length);
            for(var i = 0; i < items.length; i++){
                window.sessionStorage.setItem("routing.item_" + i, items[i]);
            }
        };

    };

})();