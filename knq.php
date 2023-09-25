<?php
/**
 * Plugin Name: KNQuiz
 * Plugin URI: http://capan.ro/
 * Description: knQuiz
 * Version: 1.0
 * Author: Matei Capan
 * Author URI: http://capan.ro
 * License: GPL2
 */

/**
 * Register style sheet.
 */

include 'php/knq-questions.php';
include 'php/knq-quizzes.php';
include 'php/knq-options.php';
include 'php/knq-statistics.php';
include 'php/knq-frontend.php';

function knq_load_textdomain()
{
    load_plugin_textdomain('knq', false, basename(dirname(__FILE__)) . '/languages/');
}

add_action('init', 'knq_load_textdomain');

function debug_to_console($data)
{
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

function knq_scripts()
{
    wp_register_style('knqcss', plugins_url('/css/knq.css', __FILE__), "1.4.0");
    wp_enqueue_style('knqcss');
    wp_enqueue_script('knq-js', plugins_url('knq/js/knq.js'), array('jquery', 'jquery-ui-core', 'jquery-ui-sortable', 'jquery-ui-tooltip'), '1.4.0', true);
    wp_localize_script('knq-js', 'knq_object', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('knq-func-js', plugins_url('knq/js/knq-func.js'), array(), '1.4.0', true);
    wp_enqueue_script('fullscreen-js', plugins_url('knq/js/jquery.fullscreen.min.js'), array(), '1.4.0', true);

    wp_enqueue_script('knq-wordsearch-js', plugins_url('knq/js/knq-wordsearch.js'), array(), '1.4.0', true);
    wp_enqueue_script('knq-crossword-js', plugins_url('knq/js/knq-crossword.js'), array(), '1.4.0', true);
    wp_enqueue_script('sortable-js', plugins_url('knq/js/Sortable.min.js'), array(), '1.14.0', true);
    wp_enqueue_script('swap-js', plugins_url('knq/js/Swap.js'), array(), '1.14.0', true);
    wp_enqueue_script('mousetrap-js', plugins_url('knq/js/mousetrap.min.js'), array(), '1.6.5', true);
    wp_enqueue_script('pixelate', plugins_url('knq/js/pixelate.min.js'), array(), '1.14.0', true);
    wp_enqueue_script("jquery-ui-draggable");
    wp_enqueue_script("jquery-ui-droppable");

}

function knqb_scripts($hook)
{
    wp_enqueue_script('knqb-js', plugin_dir_url(__FILE__) . '/js/knqb.js', array(), '1.4.0', true);
    wp_register_style('chosencss', plugins_url('css/chosen.min.css', __FILE__), true, '', 'all');
    wp_register_style('farbtastic', plugins_url('css/farbtastic.css', __FILE__), true, '', 'all');
    wp_register_script('chosenjs', plugins_url('js/chosen.jquery.min.js', __FILE__), array('jquery'), '', true);
    wp_enqueue_style('chosencss');
    wp_enqueue_style('farbtastic');
    wp_enqueue_script('chosenjs');
    wp_enqueue_script('sortable-js', plugins_url('knq/js/Sortable.min.js'), array(), '1.14.0', true);
    wp_enqueue_script('pixelate', plugins_url('knq/js/pixelate.min.js'), array(), '1.14.0', true);
    wp_enqueue_script('farbtastic', plugins_url('knq/js/farbtastic.js'), array(), '1.15.0', true);
    //wp_enqueue_script('SortableJS', 'https://SortableJS.github.io/Sortable/Sortable.min.js');
    wp_enqueue_script('jquery-ui-core');
    wp_enqueue_script('jquery-ui-sortable');
}

add_action('wp_enqueue_scripts', 'knq_scripts');
add_action('admin_enqueue_scripts', 'knqb_scripts');


add_action('wp_ajax_detaliiIntrebare', 'funcDetaliiIntrebare');
add_action('wp_ajax_nopriv_detaliiIntrebare', 'funcDetaliiIntrebare');

add_action('wp_ajax_updateScore', 'funcUpdateScore');
add_action('wp_ajax_nopriv_updateScore', 'funcUpdateScore');

/**
 * Central location to create all shortcodes.
 */
function shortcodes_init()
{
    add_shortcode('knq', 'funcKNQ');
}

add_action('init', 'shortcodes_init');


function knq_menu()
{
    add_menu_page('Admin', 'kn' . __('Quizzes', 'knq'), 10, 'knquizzes', "knq_options", 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0naXNvLTg4NTktMSc/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOTcgMjk3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjk3IDI5NyI+CiAgPGc+CiAgICA8Zz4KICAgICAgPHBhdGggZD0ibTIwNi41MSwzMmMtMC4yNjktMTcuNzE4LTE0LjcwNi0zMi0zMi40ODctMzJoLTQ5LjM3OWMtMTcuNzgxLDAtMzIuMjE5LDE0LjI4Mi0zMi40ODcsMzJoLTQyLjY1N3YyNjVoMTk4di0yNjVoLTQwLjk5em0tODEuODY2LTE2aDQ5LjE4OSAwLjE5YzkuMDk5LDAgMTYuNSw3LjQwMiAxNi41LDE2LjVzLTcuNDAxLDE2LjUtMTYuNSwxNi41aC00OS4zNzljLTkuMDk5LDAtMTYuNS03LjQwMi0xNi41LTE2LjVzNy40MDEtMTYuNSAxNi41LTE2LjV6bTIzLjg1NiwyMzloLTY2di0xNmg2NnYxNnptMC01MGgtNjZ2LTE2aDY2djE2em0wLTQ5aC02NnYtMTZoNjZ2MTZ6bTAtNTBoLTY2di0xNmg2NnYxNnptNDMuNzY4LDE2MC4wMjlsLTE5LjU0MS0xNi4yMDQgMTAuMjEzLTEyLjMxNiA3Ljc5Myw2LjQ2MiAxMi4xOS0xMy4zNjIgMTEuODIsMTAuNzgzLTIyLjQ3NSwyNC42Mzd6bTAtNTBsLTE5LjU0MS0xNi4yMDQgMTAuMjEzLTEyLjMxNiA3Ljc5Myw2LjQ2MiAxMi4xOS0xMy4zNjIgMTEuODIsMTAuNzgzLTIyLjQ3NSwyNC42Mzd6bTAtNDlsLTE5LjU0MS0xNi4yMDQgMTAuMjEzLTEyLjMxNiA3Ljc5Myw2LjQ2MiAxMi4xOS0xMy4zNjIgMTEuODIsMTAuNzgzLTIyLjQ3NSwyNC42Mzd6bTAtNTBsLTE5LjU0MS0xNi4yMDQgMTAuMjEzLTEyLjMxNiA3Ljc5Myw2LjQ2MiAxMi4xOS0xMy4zNjIgMTEuODIsMTAuNzgzLTIyLjQ3NSwyNC42Mzd6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=', 2);
    add_submenu_page('knquizzes', __("Settings", "knq"), __("Settings", "knq"), 10, "knquizzes", "knq_options");
    add_submenu_page('knquizzes', __("Quizzes management", "knq"), __("Quizzes", "knq"), 10, "knq-quizzes", "knq_quizzes");
    add_submenu_page('knquizzes', __("Questions management", "knq"), __("Questions", "knq"), 10, "knq-questions", "knq_questions");
    add_submenu_page('knquizzes', __("Statistics", "knq"), __("Statistics", "knq"), 10, "knq-statistics", "knq_statistici");
}

add_action('admin_menu', 'knq_menu');
