<?php
ob_start();
$folders = array_diff(scandir("../"), array("..", ".", ".idea", "old", "scripts"));
foreach($folders as $folder){
    if(is_file("../$folder")){
        continue;
    }
    ob_clean();
    $js_folder = "../" . $folder . "/activities/js";
    $js_shared_folder = "../shared/activities/js";
    $js_output = "../" . $folder . "/bundle.js";
    if(file_exists($js_output)) {
        unlink($js_output);
    }
    if(file_exists($js_folder)){
        $js_files = array_merge(array_diff(scandir($js_folder), array("..", ".")), array_diff(scandir($js_shared_folder), array("..", ".")));
        ob_clean();
        if(count($js_files) != 0) {
            echo "(function(){\n";
            $app_file = $js_folder . "/_app.js";
            $groups_file = $js_folder . "/_groups.js";
            if(file_exists($app_file) && is_file($app_file)){
                echo trim(file_get_contents($app_file));
            }else{
                echo "console.error(\"'_app.js' is missinging\");\n";
            }
            foreach ($js_files as $js_file) {
                if($js_file === "_app.js" || $js_file === "_groups.js"){
                    continue;
                }
                $file = $js_folder . "/" . $js_file;
                if(file_exists($file) && is_file($file)){
                    echo trim(file_get_contents($file));
                }else{
                    $shared_file = $js_shared_folder . "/"  . $js_file;
                    if(file_exists($shared_file) && is_file($shared_file)){
                        echo trim(file_get_contents($shared_file));
                    }
                }
            }
            if(file_exists($groups_file) && is_file($groups_file)){
                echo trim(file_get_contents($groups_file));
            }else{
                echo "console.error(\"'_groups.js' is missinging\");\n";
            }
            echo "\n})();";
            file_put_contents($js_output, ob_get_contents());
        }
    }

    ob_clean();
    $css_folder = "../" . $folder . "/activities/css";
    $css_shared_folder = "../shared/activities/css";
    $css_output = "../" . $folder . "/bundle.css";
    if(file_exists($css_output)) {
        unlink($css_output);
    }
    if(file_exists($css_folder)){
        $css_files = array_merge(array_diff(scandir($css_folder), array("..", ".")), array_diff(scandir($css_shared_folder), array("..", ".")));
        if(count($css_files) != 0) {
            foreach ($css_files as $css_file) {
                $file = $css_folder . "/" . $css_file;
                if(file_exists($file) && is_file($file)){
                    echo trim(file_get_contents($file));
                }else{
                    $shared_file = $css_shared_folder . "/" . $css_file;
                    if(file_exists($shared_file) && is_file($shared_file)){
                        echo trim(file_get_contents($shared_file));
                    }
                }
            }
            file_put_contents($css_output, ob_get_contents());
        }
    }
}