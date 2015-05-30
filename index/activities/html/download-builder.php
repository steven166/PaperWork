<div id="download-builder" class="activity-hide">
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
                        <label>App Name</label>
                        <input type="text" name="project-name"/>

                        <div class="stat"></div>
                        <div class="stat_active"></div>
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

</div>