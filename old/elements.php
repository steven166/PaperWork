<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Material Design | Paper Elements</title>
        <link rel="shortcut icon" href="res/icon.png"/>
        <link rel="stylesheet" href="css/icons/google_icons.css"/>
        <link rel="stylesheet" href="css/material/paper.css"/>
        <link rel="stylesheet" href="css/material/paper-button.css"/>
        <link rel="stylesheet" href="css/material/paper-button-float.css"/>
        <link rel="stylesheet" href="css/material/paper-checkbox.css"/>
        <link rel="stylesheet" href="css/material/paper-header.css"/>
        <link rel="stylesheet" href="css/material/paper-list.css"/>
        <link rel="stylesheet" href="css/material/paper-input.css"/>
        <link rel="stylesheet" href="css/material/paper-loading"/>
        <link rel="stylesheet" href="css/material/paper-modal.css"/>
        <link rel="stylesheet" href="css/material/paper-popup.css"/>
        <link rel="stylesheet" href="css/material/paper-table.css"/>
        <link rel="stylesheet" href="css/material/paper-interact.css"/>
        <link rel="stylesheet" href="css/styles/paper-styles.css"/>
        <link rel="stylesheet" href="css/styles/paper-header-styles.css"/>
        <link rel="stylesheet" href="css/styles/paper-list-styles.css"/>
        <link rel="stylesheet" href="css/site.css"/>
        <script src="js/jquery.js"></script>
        <script src="js/jquery.mobile.js"></script>
        <script src="js/test.js"></script>
        <script src="js/material/paper.js"></script>
        <script src="js/material/paper-header.js"></script>
    </head>
    <body>
        <div class="paper-header left-menu large auto deep-orange">
            <button class="paper-header-menu-button">
                <i class="mdi-navigation-menu"></i>
            </button>
            <div class="paper-header-content">
                <a href="index.html">
                    <div class="icon round"></div>
                    <h1>Material Design</h1>
                </a>
                <div class="paper-header-menu">
                    <button class="paper-header-menu-right-toggle"><i class="mdi-navigation-more-vert"></i></button>
                    <div class="paper-header-menu-right">
                        <a href='login.php' class="paper-interact mobile"><i></i>Login</a>
                        <a href='signup.php' class="paper-interact mobile"><i></i>Signup</a>
                    </div>
                    <a href="elements.php" class="paper-interact mobile"><i class="mdi-editor-insert-drive-file"></i>Paper Elements</a>
                    <a href="downloads.html" class="paper-interact mobile"><i class="mdi-file-file-download"></i>Downloads</a>
                </div>
            </div>
            <div class='paper-header-action-bar'>
                <button id="download_button" class="paper-interact">
                    <span class="paper-label">Download</span>
                    <i class="mdi-file-file-download"></i>
                </button>
            </div>
        </div>
        <div class="paper-content large fixed drawer">
            <div class='drawer-nav paper-list active-blue-gray hover'>
                <ul>
                    <li class='paper-list-header icon paper-interact' data-link="elements/paper.ht2ml" data-key="elements">
                        <div class='paper-list-title'>
                            Paper Elements
                        </div>
                    </li>
                    <li class='paper-list-header icon paper-interact' data-link="elements/colors.html" data-key="colors">
                        <div class='paper-list-title'>
                            Colors
                        </div>
                    </li>
                    <li class='paper-list-header icon paper-interact' data-link="elements/buttons.html" data-key="buttons">
                        <div class='paper-list-title'>
                            Buttons
                        </div>
                    </li>
                </ul>
            </div>
            <div class="drawer-content">
                <div class="drawer-content-o">
                    <?php
                    include 'elements/paper.html';
                    ?>
                </div>
            </div>
        </div>
        <script>
            $(".drawer-content").on("swiperight", function swipeleftHandler(event) {
                if ($(window).width() < 600) {
                    history.back();
                }
            });
            $(".drawer-nav").on("swipeleft", function swipeleftHandler(event) {
                if ($(window).width() < 600) {
                    history.forward();
                }
            });
        </script>
    </body>
</html>
