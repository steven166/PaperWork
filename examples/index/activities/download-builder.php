<template activity="download-builder">
    <style>
        form{
            width: 100%;
            height: 100%;
            overflow: auto;
        }

        .project-settings-wrapper{
            overflow: hidden;
            transition-duration: 0.2s;
            transition-property: height;
        }

        .project-settings{
            margin-left: 58px;
            margin-right: 20px;
        }

        .project-settings h4{
            margin: 10px;
        }

        .project-settings .project-color {
            padding: 10px;
        }

        .project-settings .project-color > div{
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 3px;
            cursor: pointer;
            transition-duration: 0.5s;
            transition-property: box-shadow;
        }

        .project-settings .project-color > div i {
            position: absolute;
            top: 6px;
            left: 6px;
            font-size: 20px;
        }

        .project-settings .project-color div:hover{
            box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px 0px, rgba(0, 0, 0, 0.117647) 0px 1px 6px 0px;
        }

        .project-settings .project-color div.selected{
            box-shadow: rgba(0, 0, 0, 0.227451) 0px 3px 10px 0px, rgba(0, 0, 0, 0.156863) 0px 3px 10px 0px;
        }

        form > h4{
            font-weight: bold;
            margin-left: 20px;
            margin-right: 20px;
            padding: 5px;
            border-bottom: 1px solid rgb(150,150,150);
        }
    </style>
    <div class="paper-col-2 center">
        <form action="index/services/download.php">
            <h4>Customize Download</h4>
            <div class="paper-checkbox checked" id="check-build">
                <input type="checkbox" checked name="build-project"/>

                <div class='box-overlay wrippels' bg="dark">
                    <div class="box"></div>
                </div>
                <div class='paper-checkbox-label'>
                    <h4>App Setup</h4>
                </div>
            </div>
            <div class="project-settings-wrapper">
                <div class="project-settings">
                    <div class="paper-input paper-label">
                        <input type="text" name="project-name"/>
                        <label>App Name</label>

                        <div class="stat"></div>
                        <div class="stat-active"></div>
                    </div>
                    <h4>Theme: <b id="selected-theme">Blue</b></h4>

                    <div class="project-color">
                        <div class="red wrippels"></div>
                        <div class="pink wrippels"></div>
                        <div class="purple wrippels"></div>
                        <div class="deep-purple wrippels"></div>
                        <div class="indigo wrippels"></div>
                        <div class="blue wrippels selected"><i class="mdi-navigation-check"></i></div>
                        <div class="light-blue wrippels"></div>
                        <div class="cyan wrippels"></div>
                        <div class="teal wrippels"></div>
                        <div class="green wrippels"></div>
                        <div class="light-green wrippels"></div>
                        <div class="lime wrippels"></div>
                        <div class="yellow wrippels"></div>
                        <div class="amber wrippels"></div>
                        <div class="orange wrippels"></div>
                        <div class="deep-orange wrippels"></div>
                        <div class="brown wrippels"></div>
                        <div class="gray wrippels"></div>
                        <div class="light-gray wrippels"></div>
                        <div class="dark-gray wrippels"></div>
                        <div class="blue-gray wrippels"></div>
                        <div class="white wrippels"></div>
                        <div class="black wrippels"></div>
                    </div>
                </div>
            </div>
            <div class="paper-checkbox checked">
                <input type="checkbox" checked name="minify"/>

                <div class='box-overlay wrippels' bg="dark">
                    <div class="box"></div>
                </div>
                <div class='paper-checkbox-label'>
                    <h4>Minify PaperWork framework</h4>
                    <article>Remove (white)spaces from the PaperWork framework code, so your App will load faster.
                    </article>
                </div>
            </div>
            <h4>Customize Modules</h4>
            <div class="customize-download">
                <?php
                $modules = array(
                    "paper-wrippels",
                    "paper-list",
                    "paper-header",
                    "paper-app",
                    "paper-input",
                    "paper-button",
                    "paper-checkbox",
                    "paper-lang",
                    "paper-modal",
                    "paper-snackbar-toast"
                );
                foreach ($modules as $module) {
                    echo '<div class="paper-checkbox checked">';
                    echo '<input type="checkbox" checked name="module-' . $module . '"/>';
                    echo '<div class="box-overlay wrippels" bg="dark">';
                    echo '<div class="box"></div>';
                    echo '</div>';
                    echo '<div class="paper-checkbox-label">';
                    echo '<h4>' . $module . "</h4>";
                    echo '</div>';
                    echo '</div>';
                }
                ?>
            </div>
            <button id="hide-submit-button" type="submit" style="display:none"></button>
        </form>
    </div>
    <div id="submit-button" class="paper-button float wrippels" bg="dark"><i class="mdi-file-file-download"></i></div>
</template>
<script>
    app.activity("download-builder", function(){

        $("body").on("click", "[activity=download-builder] .project-color div", function(){
            var tthis = this;
            $(tthis).parent().children(".selected").removeClass("selected").html("");
            $(tthis).addClass("selected").html('<i class="mdi-navigation-check"></i>');
            var clss = $(tthis).attr("class");
            clss = clss.replace("selected", "").replace("wrippels", "").trim();
            app.setTheme(clss);
            $("#e-download-builder #selected-theme").html(paper.toNormalText(clss));
        });

        $("body").on("change", "[activity=download-builder] #check-build", function(){
            var height = $("[activity=download-builder] .project-settings").height();
            $("[activity=download-builder] .project-settings-wrapper").css("height", height + "px");
            if(!$(this).hasClass("checked")){
                setTimeout(function(){
                    $("[activity=download-builder] input[name='project-name']").removeAttr("required");
                    $("[activity=download-builder] .project-settings-wrapper").css("height", 0);
                }, 20);
            }else{
                $("[activity=download-builder] input[name='project-name']").attr("required", "true");
                $("[activity=download-builder] input[name='project-name']").focus();
            }
        });

        $("body").on("click", "#e-download-builder #submit-button", function(){
            $("[activity=download-builder] form #hide-submit-button").click();
        });

        this.onVisible = function(){
            $("[activity=download-builder] input[name='project-name']").attr("required", "true");
            $("[activity=download-builder] input[name='project-name']").focus();
        };

    });
</script>