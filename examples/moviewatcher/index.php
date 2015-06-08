<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="manifest-app.json"/>
    <link rel="icon" sizes="192x192" href="../../shared/images/icons/icon-4x.png">

    <title>MovieWatcher</title>
</head>
<body>
    <?php
    //Include startup html
    include '../../shared/inc/startup.php';
    ?>

    <!-- Style sheets -->
    <link rel="stylesheet" href="../../shared/css/icons/google_icons.css"/>
    <link rel="stylesheet" href="../../shared/css/paper-bundle.css"/>

    <!-- Javascript Frameworks -->
    <script src="../../shared/js/jquery.min.js"></script>
    <script src="../../shared/js/paper-bundle.js"></script>

    <!--Language files -->
    <script src="lang/en.js"></script>
    <script src="lang/nl.js"></script>

    <!-- Create app -->
    <script src="js/_app.js"></script>

    <!-- Activities -->
    <link rel="import" href="activities/download.html"/>
    <link rel="import" href="activities/film-info.html"/>
    <link rel="import" href="activities/index-drawer.html"/>
    <link rel="import" href="activities/index-panel.html"/>
    <link rel="import" href="activities/search-flow.html"/>
    <link rel="import" href="activities/settings.html"/>
    <link rel="import" href="activities/settings-about.html"/>
    <link rel="import" href="activities/settings-general.html"/>
    <link rel="import" href="activities/trailer-overlay.html"/>
    <link rel="import" href="activities/watchlist.html"/>

    <!-- Initialize App -->
    <script src="js/_init.js"></script>

</body>
</html>