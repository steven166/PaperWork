<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="../../shared/manifest-app.json"/>
    <link rel="icon" sizes="192x192" href="../../shared/images/icons/icon-4x.png">

<!--    <link rel="stylesheet" href="activities/css/app.css"/>-->

    <title>PaperWork</title>
</head>
<body>
    <?php
    //Include startup html
    include '../../shared/inc/startup.php';
    ?>

    <!-- Style sheets -->
    <link rel="stylesheet" href="../../shared/css/icons/google_icons.css"/>
    <link rel="stylesheet" href="../../shared/css/paper-bundle.css"/>
    <link rel="stylesheet" href="../../shared/bundle.css"/>

    <!-- Javascript Frameworks -->
    <script src="../../shared/js/jquery.min.js"></script>
    <script src="../../shared/js/paper-bundle.js"></script>

    <!--Language files -->
    <script src="../../shared/lang/en.js"></script>

    <!-- Create app -->
    <script>

        console.log("Load app");
        var app = paper.app.create(false, "green", "paperwork");
    </script>

    <!-- Activities -->
    <link rel="import" href="activities/index.html"/>
    <link rel="import" href="activities/download-builder.php"/>
    <link rel="import" href="activities/get-started.html"/>

    <!-- Initialize App -->
    <script>

        console.log("init app");
        app.group("home", new function(){
            this.activity_1 = "index";
            this.activity_1_type = "large";
        });

        app.group("download", new function(){
            this.color = "blue";
            this.title = "@+download+@";
            this.leftAction = "back";
            this.activity_1 = "download-builder";
            this.activity_1_type = "large";
        });

        app.group("get-started", new function(){
            this.color = "green";
            this.title = "@+get-started+@";
            this.leftAction = "back";
            this.activity_1 = "get-started";
        });

        app.init();
    </script>

    <!-- Material App goes under here -->
</body>
</html>