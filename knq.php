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
    wp_register_style('knqcss', plugins_url('/css/knq.css', __FILE__), "1.3.0");
    wp_enqueue_style('knqcss');
    wp_enqueue_script('knq-js', plugins_url('knq/js/knq.js'), array('jquery', 'jquery-ui-core', 'jquery-ui-sortable', 'jquery-ui-tooltip'), '1.3.0', true);
    wp_localize_script('knq-js', 'knq_object', array('ajax_url' => admin_url('admin-ajax.php')));
    wp_enqueue_script('knq-func-js', plugins_url('knq/js/knq-func.js'), array(), '1.3.0', true);
    wp_enqueue_script('fullscreen-js', plugins_url('knq/js/jquery.fullscreen.min.js'), array(), '1.3.0', true);

    wp_enqueue_script('knq-wordsearch-js', plugins_url('knq/js/knq-wordsearch.js'), array(), '1.3.0', true);
    wp_enqueue_script('knq-crossword-js', plugins_url('knq/js/knq-crossword.js'), array(), '1.3.0', true);
    wp_enqueue_script('sortable-js', plugins_url('knq/js/Sortable.min.js'), array(), '1.14.0', true);
    wp_enqueue_script('swap-js', plugins_url('knq/js/Swap.js'), array(), '1.14.0', true);
    wp_enqueue_script('mousetrap-js', plugins_url('knq/js/mousetrap.min.js'), array(), '1.6.5', true);
    //wp_enqueue_script('SortableJS', 'https://SortableJS.github.io/Sortable/Sortable.min.js');
    wp_enqueue_script("jquery-ui-draggable");
    wp_enqueue_script("jquery-ui-droppable");
}

function knqb_scripts($hook)
{
    wp_enqueue_script('knqb-js', plugin_dir_url(__FILE__) . '/js/knqb.js', array(), '1.3.0', true);
    wp_register_style('chosencss', plugins_url('css/chosen.min.css', __FILE__), true, '', 'all');
    wp_register_script('chosenjs', plugins_url('js/chosen.jquery.min.js', __FILE__), array('jquery'), '', true);
    wp_enqueue_style('chosencss');
    wp_enqueue_script('chosenjs');
    wp_enqueue_script('sortable-js', plugins_url('knq/js/Sortable.min.js'), array(), '1.14.0', true);
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


function funcUpdateScore()
{
    global $wpdb;
    $userScore = $_POST['score'];
    $crtid = $_POST['quizId'];
    $score = $wpdb->get_results($wpdb->prepare("SELECT score FROM " . $wpdb->prefix . "knq_user_scores WHERE quiz_id=" . $crtid . " AND user_id='" . (_wp_get_current_user()->ID - 0) . "'"));
    $attempts = $wpdb->get_results($wpdb->prepare("SELECT attempts FROM " . $wpdb->prefix . "knq_user_scores WHERE quiz_id=" . $crtid . " AND user_id='" . (_wp_get_current_user()->ID) . "'"));
    if (count($attempts) != 0) {
        $attempts = $attempts[0]->attempts - 0;
        $attempts += 1;
    }
    $response = 0;
    if (count($score) == 0) {
        $wpdb->query(
            $wpdb->prepare("INSERT INTO `" . $wpdb->prefix . "knq_user_scores` (`user_id`, `score`, `timestamp`, `quiz_id`, `attempts`) VALUES ('" . (_wp_get_current_user()->ID - 0) . "', '" . $userScore . "', NOW(), '" . $crtid . "', 1)")
        );
        if ($wpdb->last_error !== '') {
            // Display or log the database error message
            $response = "Database error: " . $wpdb->last_error;
        }
    } else if ($score[0]->score + 0 < $userScore + 0) {
        $wpdb->query(
            $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_user_scores SET score=" . $userScore . ", timestamp=NOW(), attempts=" . $attempts . " WHERE quiz_id=" . $crtid . " AND user_id='" . (_wp_get_current_user()->ID - 0) . "'")
        );
        $response = 1;
    } else {
        $response = 2;
    }
    echo json_encode($response);
    wp_die();
}


function funcDetaliiIntrebare()
{
    global $wpdb;
    $iduri = $_POST['iduri'];
    $crti = $_POST['crti'];
    $iduri = explode("|", $iduri);
    $response = $wpdb->get_results($wpdb->prepare("SELECT * FROM " . $wpdb->prefix . "knq WHERE (knq_id=" . $iduri[$crti - 1] . ") "));
    echo json_encode($response);
    wp_die();
}


function funcKNQ($atts = [], $content = null, $tag = '')
{
    global $wpdb;
    $atts = array_change_key_case((array)$atts);
    $knq_atts = shortcode_atts(
        array(
            'id' => '1',
            'title' => '0',
            'description' => '0',
        ), $atts, $tag
    );
    $crtid = (int)$knq_atts['id'];
    $showTitle = (int)$knq_atts['title'];
    $showDescription = (int)$knq_atts['description'];
    $o = "<div id='quiz' class='ibox'>";
    //$o .= "<span><a id='fullscreen-link'><i class='fa fa-expand'></i></a></span>";
    $o .= "<p id='quizId' style='display: none'>" . $crtid . "</p><a id='fullscreen-link' style='float:right;cursor: pointer;' title='Comută pe ecran plin'><i class='fa fa-expand'></i></a>";
    $score = $wpdb->get_results($wpdb->prepare("SELECT score, timestamp FROM " . $wpdb->prefix . "knq_user_scores WHERE quiz_id=" . $crtid . " AND user_id='" . (_wp_get_current_user()->ID - 0) . "'"));

    if (count($score) == 0) {
        $o .= "<p id='quizCompletion' completed_before='0'><span id='score'>" . __("Current score", "knq") . ": 0</span>. Nu ați mai completat acest chestionar.</p><span style='display: none' id='points'>0</span>";
    } else {
        $o .= "<p id='quizCompletion' completed_before='1'><span id='score'>" . __("Current score", "knq") . ": 0</span>. " . __('Previous score', 'knq') . " : " . $score[0]->score . " (" . date_i18n(get_option('time_format'), strtotime($score[0]->timestamp)) . ", " . date_i18n(get_option('date_format'), strtotime($score[0]->timestamp)) . ").</p><span style='display: none' id='points'>0</span>";
    }
    if ($showTitle == 1) {
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='title'"));
        if (count($title) !== 0) {
            $o .= "<h1>" . $title[0]->option_value . "</h1>";
        }
    }
    if ($showDescription == 1) {
        $description = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='description'"));
        if (count($description) !== 0) {
            $o .= "<h1>" . $description[0]->option_value . "</h1>";
        }
    }


    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_answers'"));
    if (count($globalShuffleAnswers) == 0) {
        $globalShuffleAnswers = '3';
    } else {
        $globalShuffleAnswers = $globalShuffleAnswers[0]->option_value;
    }
    $randomAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='random_answers'"));
    $o .= '<p id="shuffleAnswers" style="display: none">' . (count($randomAnswers) != 0 ? $randomAnswers[0]->option_value : $globalShuffleAnswers) . '</p>';

    $cate = $wpdb->get_row($wpdb->prepare("SELECT COUNT(order_id) AS cate FROM " . $wpdb->prefix . "knq WHERE quiz_id=$crtid AND order_id>0"));
    $cate = $cate->cate - 0;

    $iduri = $wpdb->get_col($wpdb->prepare("SELECT knq_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=$crtid AND order_id>0 ORDER BY order_id"));
    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_questions'"));
    if (count($globalShuffleQuestions) == 0) {
        $globalShuffleQuestions = '3';
    } else {
        $globalShuffleQuestions = $globalShuffleQuestions[0]->option_value;
    }
    $randomQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='random_questions'"));
    if ((count($randomQuestions) == 0 && $globalShuffleQuestions == '1') || (count($randomQuestions) != 0 && $randomQuestions[0]->option_value == 1)) {
        shuffle($iduri);
    }

    $iduri = implode("|", $iduri);
    $o .= "<div id='questionContainer'></div>";
    $o .= "<button id='redoQuiz' style='display: none' class='button button-primary'>" . __("Redo quiz", "knq") . "</button>";
    $o .= '<script type="text/javascript">iduri="' . $iduri . '";';
    $o .= 'cate=' . $cate . ';crti=1;';
    $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='answer_question'"));
    if (count($answerQuestion) == 0) {
        $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='answer_question'"));
        if (count($answerQuestion) == 0) {
            $answerQuestion = __('Done!', 'knq');
        } else {
            $answerQuestion = $answerQuestion[0]->option_value;
        }
    } else {
        $answerQuestion = $answerQuestion[0]->option_value;
    }

    $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='next_question'"));
    if (count($nextQuestion) == 0) {
        $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='next_question'"));
        if (count($nextQuestion) == 0) {
            $nextQuestion = __('Next!', 'knq');
        } else {
            $nextQuestion = $nextQuestion[0]->option_value;
        }
    } else {
        $nextQuestion = $nextQuestion[0]->option_value;
    }

    $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='finish_quiz'"));
    if (count($finishQuiz) == 0) {
        $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='finish_quiz'"));
        if (count($finishQuiz) == 0) {
            $finishQuiz = __('Finish!', 'knq');
        } else {
            $finishQuiz = $finishQuiz[0]->option_value;
        }
    } else {
        $finishQuiz = $finishQuiz[0]->option_value;
    }

    $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='correct_answer_message'"));
    if (count($correctAnswerMessage) == 0) {
        $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_answer_message'"));
        if (count($correctAnswerMessage) == 0) {
            $correctAnswerMessage = __('Correct!', 'knq');
        } else {
            $correctAnswerMessage = $correctAnswerMessage[0]->option_value;
        }
    } else {
        $correctAnswerMessage = $correctAnswerMessage[0]->option_value;
    }

    $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='wrong_answer_message'"));
    if (count($wrongAnswerMessage) == 0) {
        $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_answer_message'"));
        if (count($wrongAnswerMessage) == 0) {
            $wrongAnswerMessage = __('Wrong!', 'knq');
        } else {
            $wrongAnswerMessage = $wrongAnswerMessage[0]->option_value;
        }
    } else {
        $wrongAnswerMessage = $wrongAnswerMessage[0]->option_value;
    }

    $o .= 'msg_done="' . $answerQuestion . '";msg_next="' . $nextQuestion . '";msg_finish="' . $finishQuiz . '";msg_correct="' . $correctAnswerMessage . '";msg_wrong="' . $wrongAnswerMessage . '"; find_words="' . __('Find above the following words', 'knq') . '"';
    $o .= '</script>';


    // enclosing tags
    if (!is_null($content)) {
        // secure output by executing the_content filter hook on $content
        $o .= apply_filters('the_content', $content);

        // run shortcode parser recursively
        $o .= do_shortcode($content);
    }

    // end box
    $o .= '</div></div>';

    // return output
    return $o;
}

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
    add_submenu_page('knquizzes', __("Quizzes management", "knq"), __("Quizzes", "knq"), 10, "knq-quizzes", "knq_quizuri");
    add_submenu_page('knquizzes', __("Questions management", "knq"), __("Questions", "knq"), 10, "knq-questions", "knq_questions");
    add_submenu_page('knquizzes', __("Statistics", "knq"), __("Statistics", "knq"), 10, "knq-statistics", "knq_statistici");
}

add_action('admin_menu', 'knq_menu');

function knq_options()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-cogs" aria-hidden="true"></i> ' . __('General options', 'knq') . '</h2><br>';
    echo '<form method="post"><input type="hidden" value="1" name="valid1">';
    $check = true;
    if (isset($_POST['valid1'])) {
        if ($_POST['answerQuestion'] != __('Default value', 'knq')) {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["answerQuestion"] . "' WHERE quiz_id=0 AND option_name='answer_question'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'answer_question', '" . __('Done!', 'knq') . "')")
            );
            if (!$result || !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['nextQuestion'] != __('Default value', 'knq')) {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["nextQuestion"] . "' WHERE quiz_id=0 AND option_name='next_question'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'next_question', '" . __('Next!', 'knq') . "')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['finishQuiz'] != __('Default value', 'knq')) {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["finishQuiz"] . "' WHERE quiz_id=0 AND option_name='finish_quiz'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'finish_quiz', '" . __('Finish!', 'knq') . "')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['correctAnswerMessage'] != __('Default value', 'knq')) {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["correctAnswerMessage"] . "' WHERE quiz_id=0 AND option_name='correct_answer_message'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'correct_answer_message', '" . __('Correct!', 'knq') . "')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['wrongAnswerMessage'] != __('Default value', 'knq')) {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["wrongAnswerMessage"] . "' WHERE quiz_id=0 AND option_name='wrong_answer_message'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'wrong_answer_message', '" . __('Wrong!', 'knq') . "')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['globalDifficulty'] != '0') {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["globalDifficulty"] . "' WHERE quiz_id=0 AND option_name='global_difficulty'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'global_difficulty', '3')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['globalShuffleQuestions'] != '-1') {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["globalShuffleQuestions"] . "' WHERE quiz_id=0 AND option_name='global_shuffle_questions'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'global_shuffle_questions', '0')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($_POST['globalShuffleAnswers'] != '-1') {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["globalShuffleAnswers"] . "' WHERE quiz_id=0 AND option_name='global_shuffle_answers'")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, 'global_shuffle_answers', '0')")
            );
            if (!$result && !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("Settings updated succesfully!", "knq") . '</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __("Error updating the settings!", "knq") . '</strong></p></div>';
        }
    }

    $o = '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;
    $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='answer_question'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="answerQuestion">' . __('Text button for answering a question','knq') . ':</label></td><td><input style="width: 100%" type="text" id="answerQuestion" name="answerQuestion" value="' . (count($answerQuestion) == 0?__('Default value', 'knq'):$answerQuestion[0]->option_value) . '"></td></tr>';
    $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='next_question'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="nextQuestion">' . __('Text button for next question','knq') . ':</label></td><td><input style="width: 100%" type="text" id="nextQuestion" name="nextQuestion" value="' . (count($nextQuestion) == 0?__('Default value', 'knq'):$nextQuestion[0]->option_value) . '"></td></tr>';
    $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='finish_quiz'"));
	$o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="finishQuiz">' . __('Text button for finishing quiz','knq') . ':</label></td><td><input style="width: 100%" type="text" id="finishQuiz" name="finishQuiz" value="' . (count($finishQuiz) == 0?__('Default value', 'knq'):$finishQuiz[0]->option_value) . '"></td></tr>';
    $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_answer_message'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="correctAnswerMessage">' . __('Message when answered correctly','knq') . ':</label></td><td><input style="width: 100%" type="text" id="correctAnswerMessage" name="correctAnswerMessage" value="' . (count($correctAnswerMessage) == 0 ? __('Default value', 'knq') : $correctAnswerMessage[0]->option_value) . '"></td></tr>';
    $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_answer_message'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="wrongAnswerMessage">' . __('Message when answered wrongly','knq') . ':</label></td><td><input style="width: 100%" type="text" id="wrongAnswerMessage" name="wrongAnswerMessage" value="' . (count($wrongAnswerMessage) == 0 ? __('Default value', 'knq') : $wrongAnswerMessage[0]->option_value) . '"></td></tr>';

    $globalDifficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_difficulty'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalDifficulty">' . __('Difficulty level', 'knq') . ':</label></td><td><select id="globalDifficulty" name="globalDifficulty">';
    if (count($globalDifficulty) == 0) {
        $o .= '<option selected value="0">' . __('Default value', 'knq') . '</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>';
    } else {
        $o .= '<option ' . ($globalDifficulty[0]->option_value == 1 ? 'selected' : '') . ' value="1">1</option><option ' . ($globalDifficulty[0]->option_value == 2 ? 'selected' : '') . ' value="2">2</option><option ' . ($globalDifficulty[0]->option_value == 3 ? 'selected' : '') . ' value="3">3</option><option ' . ($globalDifficulty[0]->option_value == 4 ? 'selected' : '') . ' value="4">4</option><option ' . ($globalDifficulty[0]->option_value == 5 ? 'selected' : '') . ' value="5">5</option>';
    }
    $o .= '</select></td></tr>';

    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_questions'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalShuffleQuestions">' . __('Shuffle questions', 'knq') . ': </label></td><td><select id="globalShuffleQuestions" name="globalShuffleQuestions">';
    if (count($globalShuffleQuestions) == 0) {
        $o .= '<option selected value="-1">' . __('Default value', 'knq') . '</option><option value="0">' . __("No", "knq") . '</option><option value="1">' . __("Yes", "knq") . '</option></td></tr>';
    } else {
        $o .= '<option ' . ($globalShuffleQuestions[0]->option_value == 0 ? 'selected' : '') . ' value="0">' . __("No", "knq") . '</option><option ' . ($globalShuffleQuestions[0]->option_value == 1 ? 'selected' : '') . ' value="1">' . __("Yes", "knq") . '</option>';
    }
    $o .= '</select></td></tr>';

    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_answers'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalShuffleAnswers">' . __('Shuffle answers', 'knq') . ': </label></td><td><select id="globalShuffleAnswers" name="globalShuffleAnswers">';
    if (count($globalShuffleAnswers) == 0) {
        $o .= '<option selected value="-1">' . __('Default value', 'knq') . '</option><option value="0">' . __("No", "knq") . '</option>value="1">' . __("Yes", "knq") . '</option>';
    } else {
        $o .= '<option ' . ($globalShuffleAnswers[0]->option_value == 0 ? 'selected' : '') . ' value="0">' . __("No", "knq") . '</option><option ' . ($globalShuffleAnswers[0]->option_value == 1 ? 'selected' : '') . ' value="1">' . __("Yes", "knq") . '</option>';
    }
    $o .= '</select></td></tr>';
    $o .= '<tr><td><input type="submit" class="button button-primary" value="' . __('Update options', 'knq') . '"></td></tr></table>';
    echo $o;
}

function knq_quizuri()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-list-check" aria-hidden="true"></i> ' . __('Quizzes management', 'knq') . '</h2><br>';

    // definire formular alegere quiz
    $codform = '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="option_page" value="general" /><input type="hidden" name="valid" value="1" />';
    $codform .= "<select onchange='this.form.submit()' class='chosen-select' size=1 name='quizId' id='quizId'>";
    $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
    $idu = $quizzes[0]->maxqid;
    $check = true;
    if (isset($_POST["valid2"])) {
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=%d", $idu)
        );
        if (!$result || !(gettype($result) == 'integer')) {
            $check = false;
        }
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq WHERE quiz_id=%d", $idu)
        );
        if (!$result && $result != 0) {
            $check = false;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("Quiz deleted succesfully", "knq") . '!</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __("Error on deleting the quiz", "knq") . '!</strong></p></div>';
        }
        $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
        if (sizeof($quizzes) != 0) {
            $idu = $quizzes[0]->maxqid;
        }
    }
    if (isset($_POST["valid"])) {
        //am submis formularul
        $idu = $_POST["quizId"] - 0;
    }
    $check = true;
    if (isset($_POST["valid1"])) {
        $idu = $_POST["quizId1"] - 0;
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='title'"));
        if (count($title) == 0) {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'title', '" . $_POST["titleArea"] . "')")
            );
            if (!$result || !(gettype($result) == 'integer')) {
                $check = false;
            }
        } else {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["titleArea"] . "' WHERE quiz_id=" . $idu . " AND option_name='title'")
            );
            if ($result == false && $result != 0) {
                $check = false;
            }
        }
        $description = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='description'"));
        if ($_POST["descriptionArea"] == "") {
            if (count($description) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='description'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($description) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'description', '" . $_POST["descriptionArea"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["descriptionArea"] . "' WHERE quiz_id=" . $idu . " AND option_name='description'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $difficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='difficulty'"));
        if ($_POST["difficulty"] == "0") {
            if (count($difficulty) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='difficulty'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($difficulty) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'difficulty', '" . $_POST["difficulty"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["difficulty"] . "' WHERE quiz_id=" . $idu . " AND option_name='difficulty'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $randomQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='random_questions'"));
        if ($_POST["randomQuestions"] == "-1") {
            if (count($randomQuestions) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='random_questions'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($randomQuestions) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'random_questions', '" . $_POST["randomQuestions"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["randomQuestions"] . "' WHERE quiz_id=" . $idu . " AND option_name='random_questions'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $randomAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='random_answers'"));
        if ($_POST["randomAnswers"] == "-1") {
            if (count($randomAnswers) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='random_answers'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($randomAnswers) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'random_answers', '" . $_POST["randomAnswers"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["randomAnswers"] . "' WHERE quiz_id=" . $idu . " AND option_name='random_answers'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='answer_question'"));
        if ($_POST["answerQuestion"] == "") {
            if (count($answerQuestion) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='answer_question'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($answerQuestion) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'answer_question', '" . $_POST["answerQuestion"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["answerQuestion"] . "' WHERE quiz_id=" . $idu . " AND option_name='answer_question'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='next_question'"));
        if ($_POST["nextQuestion"] == "") {
            if (count($nextQuestion) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='next_question'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($nextQuestion) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'next_question', '" . $_POST["nextQuestion"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["nextQuestion"] . "' WHERE quiz_id=" . $idu . " AND option_name='next_question'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='finish_quiz'"));
        if ($_POST["finishQuiz"] == "") {
            if (count($finishQuiz) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='finish_quiz'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($finishQuiz) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'finish_quiz', '" . $_POST["finishQuiz"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["finishQuiz"] . "' WHERE quiz_id=" . $idu . " AND option_name='finish_quiz'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='correct_answer_message'"));
        if ($_POST["correctAnswerMessage"] == "") {
            if (count($correctAnswerMessage) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='correct_answer_message'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($correctAnswerMessage) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'correct_answer_message', '" . $_POST["correctAnswerMessage"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["correctAnswerMessage"] . "' WHERE quiz_id=" . $idu . " AND option_name='correct_answer_message'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='wrong_answer_message'"));
        if ($_POST["wrongAnswerMessage"] == "") {
            if (count($wrongAnswerMessage) != 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='wrong_answer_message'")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }
            }
        } else {
            if (count($wrongAnswerMessage) == 0) {
                $result = $wpdb->query(
                    $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'wrong_answer_message', '" . $_POST["wrongAnswerMessage"] . "')")
                );
                if (!$result || !(gettype($result) == 'integer')) {
                    $check = false;
                }

            } else {
                $result = $wpdb->query(
                    $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST["wrongAnswerMessage"] . "' WHERE quiz_id=" . $idu . " AND option_name='wrong_answer_message'")
                );
                if ($result == false && $result != 0) {
                    $check = false;
                }
            }
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __('Quiz updated', 'knq') . '</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __('Error updating quiz', 'knq') . '</strong></p></div>';
        }
    }
    if (isset($_POST["valid3"])) {
        $idu = $_POST["quizId3"] - 0;
        for ($i = 1; $i <= $_POST['questions_counter']; $i++) {
            $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq SET order_id=" . $i . " WHERE quiz_id=" . $idu . " AND knq_id='" . $_POST['question_id_' . $i] . "'")
            );
        }
    }
    if (isset($_POST["valid4"])) {
        $qid = $wpdb->get_row($wpdb->prepare("SELECT MAX(quiz_id) AS counter FROM " . $wpdb->prefix . "knq_details"))->counter - 0;
        $qid++;
        $idu = $qid;
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'title', '" . __('Demo quiz (please configure)', 'knq') . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'description', '" . __('Demo description (please configure)', 'knq') . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'user_id', '" . (_wp_get_current_user()->ID - 0) . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'created', NOW())")
        );
    }
    $quizuri = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT quiz_id, option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id!=0 AND option_name='title' ORDER BY option_value"));

    foreach ($quizuri as $quiz) {
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quiz->quiz_id . " AND option_name='title'"));
        $codform .= '<option value="' . $quiz->quiz_id . '"' . ($quiz->quiz_id == $idu ? 'selected' : '') . '>' . (count($title) == 0 ? 'Chestionar ' : $title[0]->option_value) . " [id:" . $quiz->quiz_id . "]</option>";
    }
    $codform .= '</select>';
    $codform .= '</form>';

    $codform .= '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="valid4" value="1" /><input type="submit" class="button button-primary" value="' . __("Add new quiz", "knq") . '" id="addNewQuiz"></form>';

    // daca am ales un quiz
    //am submis formularul
    $quizId = $idu;

    $codform .= "<br>";
    $codform2 = '<form method="post" action="" onsubmit="return checkQuizFormData()" novalidate="novalidate"><input type="hidden" name="valid1" value="1" /><input type="hidden" name="quizId1" value="' . $quizId . '" />';

    $codform2 .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;

    $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='title'"));
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    $date = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE option_name = 'created' AND quiz_id = " . $quizId));
    $codform .= $codform2 . '<center><h2>' . __("Selected quiz", "knq") . ': ' . (count($title) == 0 ? "" : $title[0]->option_value) . '</h2>(' . $user[0]->display_name . ', ' . date_i18n(get_option('date_format'), strtotime($date[0]->option_value)) . ', ' . date_i18n(get_option('time_format'), strtotime($date[0]->option_value)) . ')</center><br>' .
        '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='titleArea'>" . __('Title', 'knq') . ":</label></td><td><input type='text' size=50 name='titleArea' id='titleArea' value='" . (count($title) == 0 ? "" : $title[0]->option_value) . "'></td></tr>";

    // $scores = $wpdb->get_results($wpdb->prepare("SELECT score,timestamp,attempts,wp_knq_user_scores.quiz_id,display_name,option_value FROM " . $wpdb->prefix . "knq_user_scores, " . $wpdb->prefix . "users, " . $wpdb->prefix . "knq_details WHERE (" . $wpdb->prefix . "knq_user_scores.user_id=" . $wpdb->prefix . "users.ID AND " . $wpdb->prefix . "knq_user_scores.quiz_id=" . $wpdb->prefix . "knq_details.quiz_id AND option_name='title') ORDER BY timestamp DESC limit 25");
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    if (count($user) == 0) {
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'user_id', 1)")
        );
    }


    $description = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='description'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='descriptionArea'>" . __('Description', 'knq') . ":</label></td><td><label><textarea rows='5' cols='100' name='descriptionArea' id='descriptionArea'>" . (count($description) == 0 ? "" : $description[0]->option_value) . "</textarea></td></tr>";

    $globalDifficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_difficulty'"));
    if (count($globalDifficulty) == 0) {
        $globalDifficulty = '3';
    } else {
        $globalDifficulty = $globalDifficulty[0]->option_value;
    }
    $difficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='difficulty'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='difficulty'>" . __("Difficulty level", "knq") . ":</label></td><td><select id='difficulty' name='difficulty'><option " . (count($difficulty) == 0 ? "selected" : "") . " value='0'>" . __('Global value', 'knq') . " (" . $globalDifficulty . ")</option><option value='1'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 1 ? 'selected' : '') . ">1</option><option value='2'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 2 ? 'selected' : '') . ">2</option><option value='3'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 3 ? 'selected' : '') . ">3</option><option value='4'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 4 ? 'selected' : '') . ">4</option><option value='5'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 5 ? 'selected' : '') . ">5</option></select></td></tr>";

    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_questions'"));
    if (count($globalShuffleQuestions) == 0) {
        $globalShuffleQuestions = '0';
    } else {
        $globalShuffleQuestions = $globalShuffleQuestions[0]->option_value;
    }
    $randomQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='random_questions'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='randomQuestions'>" . __("Shuffle questions", "knq") . ":</label></td><td><select id='randomQuestions' name='randomQuestions'><option " . (count($randomQuestions) == 0 ? "selected" : "") . " value='-1'>" . __('Global value', 'knq') . " (" . ($globalShuffleQuestions == '0' ? __("No", "knq") : __("Yes", "knq")) . ")</option><option value='1'" . (count($randomQuestions) != 0 && $randomQuestions[0]->option_value == 1 ? 'selected' : '') . ">" . __("Yes", "knq") . "</option><option value='0'" . (count($randomQuestions) != 0 && $randomQuestions[0]->option_value == 0 ? 'selected' : '') . ">" . __("No", "knq") . "</option></select></td></tr>";

    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='global_shuffle_answers'"));
    if (count($globalShuffleAnswers) == 0) {
        $globalShuffleAnswers = '0';
    } else {
        $globalShuffleAnswers = $globalShuffleAnswers[0]->option_value;
    }
    $randomAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='random_answers'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='randomAnswers'>" . __("Shuffle answers", "knq") . ":</label></td><td><select id='randomAnswers' name='randomAnswers'><option " . (count($randomAnswers) == 0 ? "selected" : "") . " value='-1'>" . __('Global value', 'knq') . " (" . ($globalShuffleAnswers == '0' ? __("No", "knq") : __("Yes", "knq")) . ")</option><option value='1'" . (count($randomAnswers) != 0 && $randomAnswers[0]->option_value == 1 ? 'selected' : '') . ">" . __("Yes", "knq") . "</option><option value='0'" . (count($randomAnswers) != 0 && $randomAnswers[0]->option_value == 0 ? 'selected' : '') . ">" . __("No", "knq") . "</option></select></td></tr>";

    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td colspan="2"><strong>' . __('Leave following inputs empty if you wish to use the global value', 'knq') . ':</strong></td></tr>';

    $globalAnswerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='answer_question'"));
    if (count($globalAnswerQuestion) == 0) {
        $globalAnswerQuestion = 'Done!';
    } else {
        $globalAnswerQuestion = $globalAnswerQuestion[0]->option_value;
    }
    $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='answer_question'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='answerQuestion'>" . __("Text button for answering a question", "knq") . ":</label></td><td><input id='answerQuestion' name='answerQuestion' value='" . (count($answerQuestion) == 0 ? '' : $answerQuestion[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='answerQuestion'>" . __('Global value', 'knq') . ": " . $globalAnswerQuestion . "</label></td></tr>";

    $globalNextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='next_question'"));
    if (count($globalNextQuestion) == 0) {
        $globalNextQuestion = 'Next!';
    } else {
        $globalNextQuestion = $globalNextQuestion[0]->option_value;
    }
    $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='next_question'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='nextQuestion'>" . __("Text button next question", "knq") . ":</label></td><td><input id='nextQuestion' name='nextQuestion' value='" . (count($nextQuestion) == 0 ? '' : $nextQuestion[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='nextQuestion'>" . __('Global value', 'knq') . ": " . $globalNextQuestion . "</label></td></tr>";

    $globalFinishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='finish_quiz'"));
    if (count($globalFinishQuiz) == 0) {
        $globalFinishQuiz = 'Next!';
    } else {
        $globalFinishQuiz = $globalFinishQuiz[0]->option_value;
    }
    $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='finish_quiz'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='finishQuiz'>" . __("Text button finish quiz", "knq") . ":</label></td><td><input id='finishQuiz' name='finishQuiz' value='" . (count($finishQuiz) == 0 ? '' : $finishQuiz[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='finishQuiz'>" . __('Global value', 'knq') . ": " . $globalFinishQuiz . "</label></td></tr>";

    $globalCorrectAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_answer_message'"));
    if (count($globalCorrectAnswerMessage) == 0) {
        $globalCorrectAnswerMessage = 'Next!';
    } else {
        $globalCorrectAnswerMessage = $globalCorrectAnswerMessage[0]->option_value;
    }
    $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='correct_answer_message'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='correctAnswerMessage'>" . __("Message when answered correctly", "knq") . ":</label></td><td><input id='correctAnswerMessage' name='correctAnswerMessage' value='" . (count($correctAnswerMessage) == 0 ? '' : $correctAnswerMessage[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='correctAnswerMessage'>" . __('Global value', 'knq') . ": " . $globalCorrectAnswerMessage . "</label></td></tr>";

    $globalWrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_answer_message'"));
    if (count($globalWrongAnswerMessage) == 0) {
        $globalWrongAnswerMessage = 'Next!';
    } else {
        $globalWrongAnswerMessage = $globalWrongAnswerMessage[0]->option_value;
    }
    $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='wrong_answer_message'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='wrongAnswerMessage'>" . __("Message when answered wrongly", "knq") . ":</label></td><td><input id='wrongAnswerMessage' name='wrongAnswerMessage' value='" . (count($wrongAnswerMessage) == 0 ? '' : $wrongAnswerMessage[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='wrongAnswerMessage'>" . __('Global value', 'knq') . ": " . $globalWrongAnswerMessage . "</label></td></tr>";

    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%></td><td><input type='submit' style='margin-top: 0.5vw' class='button button-primary' value='" . __('Update Quiz', 'knq') . "' id='updateQuiz'></td></tr></table>";
    $codform .= "</form><br>";

    // TODO: first time saving question of type word search does not save the word search area
    // TODO: first time saving question of type matching there is an error with the column width

    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT knq_id, question, order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    $codform .= '<form method="post" action="" onsubmit="return reorderQuestions();" novalidate="novalidate"><input type="hidden" name="questions_counter" value="' . count($intrebari) . '"><input type="hidden" name="valid3" value="1" /><input type="hidden" name="quizId3" value="' . $quizId . '" />';
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $mockId = 1;
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td width="20%">' . __("Reorder questions", "knq") . ':</td><td><div id="questions">';
    foreach ($intrebari as $intrebare) {
        $codform .= '<div style="margin-top: 1vw; margin-bottom: 1vw;" class="question" id="question' . $mockId . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input type="hidden" name="question_id_' . $mockId . '" value="' . $intrebare->knq_id . '"><input class="question_text" type="text" size="50" readonly value="' . $intrebare->question . '"></div>';
        $mockId++;
    }
    $codform .= '</div></td></tr><tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td width="20%"></td><td><input type="submit" style="margin-top: 0.5vw" class="button button-primary" value="' . __("Update order of questions", "knq") . '" id="updateQuestionOrder"></td></tr></table></form><br>';

    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - just the quiz", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title and the description", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1 description=1]'></td></tr>";
    $codform .= "</table><br>";

    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= "<tr class=inactive><td width=20% style='vertical-align:middle;'>" . __("Be careful! When you delete a quizz, there is no undo!", "knq") . "</td><td style='vertical-align:middle;'><form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuiz' value='" . __("Delete quizz", "knq") . "' onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'><input type='hidden' name='valid2' value='1'><input type='hidden' name='quizId2' value='" . $quizId . "' /></form></td></tr></table>";
    echo $codform;
    echo '</div>';
}


function insertDefaultAnswerList()
{
    $codform = "<ul style='display: none' id='answers'>";
    $codform .= "<li id='answerLi1' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer1' id='answerContainer1'><i style='margin-right: 1vw' class='fa-solid fa-arrows-up-down'></i><input autocomplete='off' size='80' class='answer' name='answer1' value=''>";
    $codform .= "<button type=button style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(1, 1)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
    $codform .= "<input type='checkbox' onclick='uncheckAnswers(1)' class='correct' id='correct1' name='correct1' value='correct'>";
    $codform .= "<label class='correct_label' for='correct1'>Corect</label></div></li>";
    $codform .= "<li id='answerLi2' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer2' id='answerContainer2'><i style='margin-right: 1vw' class='fa-solid fa-arrows-up-down'></i><input autocomplete='off' size='80' class='answer' name='answer2' value=''>";
    $codform .= "<button type=button style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(1, 1)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
    $codform .= "<input type='checkbox' onclick='uncheckAnswers(2)' class='correct' id='correct2' name='correct2' value='correct'>";
    $codform .= "<label class='correct_label' for='correct2'>Corect</label></div></li></ul>";
    $codform .= "<div style='display: none' id='addNewAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(1); return false' counter='2' name='addNewAnswer' id='addNewAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    return $codform;
}

function insertDefaultSingleAnswer()
{
    return "<div style='display:none;' id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer''></textarea><div style='display: none' id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><br><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div><p id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar (pipe), the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</strong></p><p id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p></div>";
}

function insertDefaultImageAnswers()
{
    return "<div style='display:none;' id='imagesContainer'><button class='button button-primary' id='selectImages' type='button'>Select Images</button><br><div id='imageWidthContainer'><label for='imageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='imageWidth' name='imageWidth' type='number' value='10'><label for='imageWidth'>%</label></div></div>";
}

function insertDefaultWordSearch()
{
    $codform = "<div style='display: none' id='wordSearch'>";
    $codform .= '<div style="display: flex"><div class="searchAreaContainer" id="searchAreaContainer1"><textarea style="font-family: Courier New;" rows="12" cols="12" autocomplete="off" id="spaceSearch1" name="spaceSearch1" class="spaceSearch"></textarea><br><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: auto; margin-right: auto; display: block" onclick="deleteAnswer(1,8)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>';
    $codform .= "<div style='display: none' id='addNewWordSearchAnswerContainer'>" . __("To add a new word search area, click here", "knq") . ": <button onclick='newAnswer(8); return false' counter='2' name='addNewWordSearchAnswer' id='addNewWordSearchAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    $codform .= '<p>' . __('Words to be searched, separated by one space', 'knq') . '.<br><input autocomplete="off" type="text" id="wordsSearch" name="wordsSearch" size="80" value=""></p>';
    $codform .= '<p>' . __('If unused letters forms a message, please write it below', 'knq') . ':<br><input type="text" id="restLit" name="restLit" size="80" value=""></p>';
    $codform .= "</div>";
    return $codform;
}

function insertDefaultMatching()
{
    $codform = '<div style="display: none" id="matching">';
    $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer1" id="matchingContainer1"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer1" value=""><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect1" value=""><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(1,11)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
    $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer2" id="matchingContainer2"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer2" value=""><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect2" value=""><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(2,11)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
    $codform .= '</div>';
    $codform .= "<div style='display: none' id='addNewMatchingAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(11); return false' counter='2' name='addNewAnswer' id='addNewMatchingAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    return $codform;
}


function knq_questions()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-circle-question" aria-hidden="true"></i> ' . __('Questions management', 'knq') . '</h2><br>';

    // definire formular alegere quiz
    $codform = "";
    $codform .= '<script type="text/javascript">msg_delq="' . __("Are you sure? There is no undo to that!", "knq") . '";</script>';
    $codform .= '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="option_page" value="general" /><input type="hidden" name="valid" value="1" />';
    $codform .= "<select onchange='this.form.submit()' data-placeholder='" . __('Choose a quiz', 'knq') . "' class='chosen-select' size=1 name='quizId' id='quizId'>";
    $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
    $idu = $quizzes[0]->maxqid;
    $qid = 0;
    $check = true;
    if (isset($_POST["valid4"])) {
        $idu = $_POST["quizId4"] - 0;
        $qid = $_POST["questionId4"] - 0;
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq WHERE quiz_id=%d AND order_id=%d", $idu, $qid)
        );
        if (!$result || !(gettype($result) == 'integer')) {
            $check = false;
        }
        $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $idu . "  ORDER BY order_id"));
        if (sizeof($intrebari) != 0) {
            $qid = $intrebari[0]->order_id;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("Question deleted succesfully", "knq") . '!</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __("Error on deleting the question", "knq") . '!</strong></p></div>';
        }

    }
    if (isset($_POST["valid3"])) {
        $idu = $_POST["quizId3"] - 0;
        $qid = $_POST["questionId3"] - 0;
    }
    if (isset($_POST["valid2"])) {
        $idu = $_POST["quizId2"] - 0;
        $qid = $_POST["questionId2"] - 0;
    }
    if (isset($_POST["valid"])) {
        //am submis formularul
        $idu = $_POST["quizId"] - 0;
    }
    $quizuri = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT quiz_id, option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id!=0 AND option_name='title' ORDER BY option_value"));
    $crttitle = "";
    foreach ($quizuri as $quiz) {
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quiz->quiz_id . " AND option_name='title'"));
        $codform .= '<option value="' . $quiz->quiz_id . '"' . ($quiz->quiz_id == $idu ? 'selected' : '') . '>' . (count($title) == 0 ? $quiz->quiz_id : $title[0]->option_value) . " [id:" . $quiz->quiz_id . "]</option>";
        if ($quiz->quiz_id == $idu)
            $crttitle = (count($title) == 0 ? $quiz->quiz_id : $title[0]->option_value);
    }
    $codform .= '</select>';
    $codform .= '</form>';

    // daca am ales un quiz
    //am submis formularul
    $quizId = $idu;

    $check = true;
    if (isset($_POST["valid3"])) {
        $answerCounter = $_POST["answerCounter"];
        $answerBuilder = "";
        $correctAnswerBuilder = "";
        if ($_POST["typeSelect"] == '1' || $_POST["typeSelect"] == '2' || $_POST["typeSelect"] == '3') {
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["answer" . $i]) && $_POST["answer" . $i] != "") {
                    $answerBuilder .= $_POST["answer" . $i] . "|";
                    if (isset($_POST["correct" . $i]) && $_POST["correct" . $i] == "correct") {
                        $correctAnswerBuilder .= $i . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
        } else if ($_POST["typeSelect"] == '4') {
            $answerBuilder .= $_POST["singleAnswer"];
        } else if ($_POST["typeSelect"] == '5') {
            $answerBuilder .= $_POST["singleAnswer"] . '|' . $_POST["extraWords"];
        } else if ($_POST["typeSelect"] == '6' || $_POST["typeSelect"] == '7') {
            $answerBuilder .= $_POST['imageWidth'] . "|";
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["imageUrl" . $i]) && $_POST["imageUrl" . $i] != "") {
                    $answerBuilder .= $_POST["imageUrl" . $i] . "|";
                    if (isset($_POST["correctImage" . $i]) && $_POST["correctImage" . $i] == "correct") {
                        $correctAnswerBuilder .= $i . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
        } else if ($_POST["typeSelect"] == '8') {
            $wordsSearch = $_POST["wordsSearch"];
            //împotriva spațiilor în plus fac câteva replace-uri
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace(" ", "#", $wordsSearch);
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["spaceSearch" . $i]) && $_POST["spaceSearch" . $i] != '') {
                    $spS = $_POST["spaceSearch" . $i];
                    $nr = "";
                    if (is_numeric(substr($spS, -2))) {
                        $nr .= substr($spS, -2);
                        $spS = substr($spS, 0, -3);
                    } else if (is_numeric(substr($spS, -1))) {
                        $nr .= substr($spS, -1);
                        $spS = substr($spS, 0, -2);
                    }
                    if ($nr != "")
                        $nr = sprintf("%02d", $nr);
                    $answerBuilder .= $nr . $spS . "[]";
                }
            }
            $answerBuilder = rtrim($answerBuilder, "[]");
            $answerBuilder = trim(preg_replace('/\s+/', '#', $answerBuilder));
            $answerBuilder .= "|" . $wordsSearch . "|" . $_POST["restLit"];
        } else if ($_POST["typeSelect"] == '11') {
            $answerBuilder .= $_POST['answerColumnWidth'] . '[[';
            for ($i = 0; $i < $answerCounter; $i++) {
                if (isset($_POST["matchingAnswer" . $i]) && $_POST["matchingAnswer" . $i] != "") {
                    $answerBuilder .= $_POST["matchingAnswer" . $i] . "|";
                    if (isset($_POST["matchingCorrect" . $i]) && $_POST["matchingCorrect" . $i] != "") {
                        $correctAnswerBuilder .= $_POST["matchingCorrect" . $i] . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
        }
        $sql = "UPDATE " . $wpdb->prefix . "knq SET question='" . addslashes(stripslashes($_POST["questionArea"])) . "', type=" . $_POST["typeSelect"] . ", answers='" . addslashes(stripslashes($answerBuilder)) . "', right_one='" . $correctAnswerBuilder . "', feedbackp='" . addslashes(stripslashes($_POST["positiveArea"])) . "', feedbackn='" . addslashes(stripslashes($_POST["negativeArea"])) . "', image='" . $_POST["imageUrl"] . "', image_position='" . $_POST["image_position"] . "' WHERE quiz_id=" . $quizId . " AND order_id=" . $qid;
        // aici actualizez în baza de date întrebarea
        $result = $wpdb->query($wpdb->prepare($sql));
        if ($result == false && $result != 0) {
            $check = false;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __('Question updated', 'knq') . '</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __('Error updating question', 'knq') . '</strong></p></div>';
        }
    }
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    $date = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE option_name = 'created' AND quiz_id = " . $quizId));
    $codform .= "<center><h2>" . __("Selected quiz", "knq") . ": " . $crttitle . "</h2>(" . $user[0]->display_name . ', ' . date_i18n(get_option('date_format'), strtotime($date[0]->option_value)) . ', ' . date_i18n(get_option('time_format'), strtotime($date[0]->option_value)) . ")</center><br>";
    $codform .= "<br>";

    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT count(order_id) as howm FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    if ($intrebari[0]->howm - 0 == 0) {
        $wpdb->query($wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq (quiz_id,order_id,question,type,answers,right_one,feedbackp,feedbackn,image,image_position) VALUES ($quizId,1,'" . __('Demo question (please configure).', 'knq') . "',1,'" . __('option 1|option 2', 'knq') . "','1','','','','')"));
    }

    // the list of quiz form was submited
    if (isset($_POST["valid2"])) {
        if ($_POST["intrebare"] == 0) {
            // was chosen the option to add a new question
            $intrebari = $wpdb->get_results($wpdb->prepare("SELECT max(order_id) as max FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
            $wpdb->query($wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq (quiz_id,order_id,question,type,answers,right_one,feedbackp,feedbackn,image,image_position) VALUES ($quizId," . ($intrebari[0]->max - 0 + 1) . ",'" . __('Demo question (please configure).', 'knq') . "',1,'" . __('option 1|option 2', 'knq') . "','1','','','','')"));
            $qid = $intrebari[0]->max - 0 + 1;
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("A new question was added. Do not forget to configure the question!", "knq") . '</strong></p></div>';
        } else $qid = $_POST["intrebare"];
    }
    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT question, order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    // definire formular alegere intrebare
    $codformS = '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="questions_page" value="general" /><input type="hidden" name="valid2" value="1" /><input type="hidden" name="quizId2" value="' . $quizId . '" /><input type="hidden" name="questionId2" value="' . $qid . '" />';
    $codformS .= "<select onchange='this.form.submit()' size=1 name='intrebare' id='intrebare'><option value=0>" . __("ADD NEW QUESTION", "knq") . "</option>";
    if ($qid == 0) {
        $qid = $intrebari[0]->order_id;
    }
    $mockId = 1;
    foreach ($intrebari as $intrebare) {
        $codformS .= '<option class="question_option" value="' . $intrebare->order_id . '"' . ($intrebare->order_id == $qid ? 'selected' : '') . '>' . __("Question", "knq") . ' ' . $mockId . ': ' . $intrebare->question . "</option>";
        $mockId++;
    }
    $codformS .= '</select>';
    $codformS .= '</form>';
    $detaliiIntrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT question, type, answers, right_one, feedbackp, feedbackn, image, image_position FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . " AND order_id=" . $qid));
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= '<tr style="background-color:#A6C4DD;"><td align=center>' . $codformS . '</td></tr></table>';
    $codform .= '<form method="post" action="" onsubmit="return checkQuestionFormData();" novalidate="novalidate"><input type="hidden" name="valid3" value="1" /><input type="hidden" name="quizId3" value="' . $quizId . '" /><input type="hidden" name="questionId3" value="' . $qid . '"><table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $counter = 1;
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='questionArea'>" . __("Question", "knq") . ":</label></td><td><textarea rows='5' cols='100' name='questionArea' id='questionArea'>" . $detaliiIntrebari[0]->question . "</textarea></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='typeSelect'>" . __("Question type", "knq") . ":</label></td><td><select name='typeSelect' id='typeSelect'><option value='1'" . ($detaliiIntrebari[0]->type == 1 ? "selected" : "") . ">" . __("Multiple choice (check box)", "knq") . "</option><option style='margin-left: 1vw' value='2'" . ($detaliiIntrebari[0]->type == 2 ? "selected" : "") . ">" . __("Single choice (radio box)", "knq") . "</option><option value='6'" . ($detaliiIntrebari[0]->type == 6 ? "selected" : "") . ">" . __("Multiple choice with images (check box)", "knq") . "</option><option value='7'" . ($detaliiIntrebari[0]->type == 7 ? "selected" : "") . ">" . __("Single choice with images (radio box)", "knq") . "</option><option value='3'" . ($detaliiIntrebari[0]->type == 3 ? "selected" : "") . ">" . __("Sort the answers (sorting)", "knq") . "</option><option value='4'" . ($detaliiIntrebari[0]->type == 4 ? "selected" : "") . ">" . __("Choose the words from lists (select box)", "knq") . "</option><option value='5'" . ($detaliiIntrebari[0]->type == 5 ? "selected" : "") . ">" . __("Word bank (drag & drop)", "knq") . "</option><option value='8'" . ($detaliiIntrebari[0]->type == 8 ? "selected" : "") . ">" . __("Word search", "knq") . "</option><option value='11'" . ($detaliiIntrebari[0]->type == 11 ? "selected" : "") . ">" . __("Text matching", "knq") . "</option></select></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label>" . __("Answer(s)", "knq") . ":</label></td><td>";
    if ($detaliiIntrebari[0]->type == 1 || $detaliiIntrebari[0]->type == 2 || $detaliiIntrebari[0]->type == 3) {
        $codform .= "<ul id='answers'>";
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        foreach ($answersArray as $answer) {
            $codform .= '<li id="answerLi' . $counter . '" class="answerLi" style="padding: 0.5vw; width:fit-content;"><div class="answerContainer" style="display: inline-block" name="answerContainer' . $counter . '" id="answerContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="80" class="answer" name="answer' . $counter . '" value="' . $answer . '">';
            $codform .= "<button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer($counter," . $detaliiIntrebari[0]->type . ")' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
            if ($detaliiIntrebari[0]->type == 3) {
                $codform .= "<input type='checkbox' onclick='uncheckAnswers(" . $counter . ")' class='correct' style='display: none' id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                $codform .= "<label class='correct_label' style='display: none' for='correct" . $counter . "'>" . __("Correct", "knq") . "</label></div></li>";
            } else {
                if (strpos($detaliiIntrebari[0]->right_one, "" . $counter) !== false) {
                    $codform .= "<input type='" . ($detaliiIntrebari[0]->type==1?'checkbox':'radio') . "' onclick='uncheckAnswers(" . $counter . ")' class='correct' checked id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                } else {
                    $codform .= "<input type='" . ($detaliiIntrebari[0]->type==1?'checkbox':'radio') . "' onclick='uncheckAnswers(" . $counter . ")' class='correct' id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                }
                $codform .= "<label class='correct_label' for='correct" . $counter . "'>" . __("Correct", "knq") . "</label></div></li>";
            }
            $counter++;
        }
        $codform .= "</ul><div id='addNewAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(" . $detaliiIntrebari[0]->type . "); return false' counter='$counter' name='addNewAnswer' id='addNewAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 4 || $detaliiIntrebari[0]->type == 5) {
        $codform .= insertDefaultAnswerList();
        if ($detaliiIntrebari[0]->type == 4) {
            $codform .= "<div id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer'>" . $detaliiIntrebari[0]->answers . "</textarea>";
			$codform .= "<p id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar (pipe), the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</p>";
            //$codform .= "<div style='display: none' id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div>";
        } else {
            $answers = explode('|', $detaliiIntrebari[0]->answers);
            $codform .= "<div id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer'>" . $answers[0] . "</textarea>";
			$codform .= "<p id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p>";
            if (count($answers) > 1) {
                $codform .= "<div id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'>" . $answers[1] . "</textarea></div>";
            } else {
                $codform .= "<div id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div>";
            }

        }
        //$codform .= "<p " . ($detaliiIntrebari[0]->type == 5 ? "style='display: none'" : "") . " id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar, the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</p>";
        //$codform .= "<p " . ($detaliiIntrebari[0]->type == 4 ? "style='display: none'" : "") . " id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p>";
        $codform .= "</div>";
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 6 || $detaliiIntrebari[0]->type == 7) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        $codform .= "<div id='imagesContainer'><button class='button button-primary' id='selectImages' style='margin-bottom: 0.5vw' type='button'>".__("Select images","knq")."</button><br><div id='imageWidthContainer'><label for='imageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='imageWidth' name='imageWidth' type='number' value='" . $answersArray[0] . "'><label for='imageWidth'>%</label></div>";
        for ($i = 1; $i < count($answersArray); $i++) {
            $answer = $answersArray[$i];
            $imageInfo = explode('[]', $answer);
            $codform .= '<div class="imageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" data-id="' . $imageInfo[1] . '" class="imageUrl" id="imageUrl' . $counter . '" name="imageUrl' . $counter . '" value="' . $answer . '"><img src="' . $imageInfo[0] . '" style="max-height: 100px; width: auto;"><br><input type="' . ($detaliiIntrebari[0]->type==6?"checkbox":"radio") . '" onclick="uncheckImages(' . $counter . ')" class="correctImage" id="correctImage' . $counter . '" name="correctImage' . $counter . '" ' . (strpos($detaliiIntrebari[0]->right_one, "" . $counter) !== false ? 'checked' : '') . ' value="correct"><label for="correctImage' . $counter . '">Corect</label></div>';
            $counter++;
        }
        $codform .= "</div>";
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 8) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        $careuri = explode("[]", $answersArray[0]);
        $counter = sizeOf($careuri) - 0 + 1;
        $codform .= "<div id='wordSearch'><div style='display: flex'>";
        for ($i = 1; $i < sizeOf($careuri) - 0 + 1; $i++) {
            $carcrt = $careuri[$i - 1];
            $diag = 0;
            if (is_numeric(substr($carcrt, 0, 1))) {
                //dacă începe cu un digit are de fapt 2 digiți la începuți indicând numărul de diagonale
                $diag = substr($carcrt, 0, 2) - 0;
                $carcrt = substr($carcrt, 2);
            }

            $careul = str_replace("#", "\n", $carcrt) . ($diag ? "\n" . $diag : "");
            $codform .= '<div class="spaceSearchContainer" id="spaceSearchContainer' . $i . '"><textarea style="font-family: Courier New;" rows="12" cols="12" autocomplete="off" id="spaceSearch' . $i . '" name="spaceSearch' . $i . '" class="spaceSearch">' . $careul . '</textarea><br><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: auto; margin-right: auto; display: block" onclick="deleteAnswer(' . $i . ',' . $detaliiIntrebari[0]->type . ')" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
        }
        $codform .= "</div><br><div id='addNewWordSearchAnswerContainer'>" . __("To add a new word search area, click here", "knq") . ": <button onclick='newAnswer(" . $detaliiIntrebari[0]->type . "); return false' counter='$counter' name='addNewWordSearchAnswer' id='addNewWordSearchAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
        $codform .= '<p>' . __('Words to be searched, separated by one space', 'knq') . '.<br><input autocomplete="off" type="text" id="wordsSearch" name="wordsSearch" size="80" value="' . str_replace("#", " ", $answersArray[1]) . '"></p>';
        $codform .= '<p>' . __('If unused letters forms a message, please write it below.', 'knq') . '<br><input type="text" id="restLit" name="restLit" size="80" value="' . $answersArray[2] . '"></p>';
        $codform .= "</div>";
        $codform .= insertDefaultMatching();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 11) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= '<div id="matching">';
        $firstColumnWidth = explode('[[', $detaliiIntrebari[0]->answers);
        $codform .= '<div style="width: 50%" id="answerColumnWidthContainer"><label for="answerColumnWidth">First column width: </label><input id="answerColumnWidth" name="answerColumnWidth" min="1" max="100" type="number" value="' . $firstColumnWidth[0] . '"><label for="answerColumnWidth">%</label></div>';
        $answersArray = explode("|", $firstColumnWidth[1]);
        $rightOnesArray = explode("|", $detaliiIntrebari[0]->right_one);
        for ($i = 1; $i <= count($answersArray); $i++) {
            $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer' . $i . '" id="matchingContainer' . $i . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer' . $i . '" value="' . $answersArray[$i - 1] . '"><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect' . $i . '" value="' . $rightOnesArray[$i - 1] . '"><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(' . $i . ', ' . $detaliiIntrebari[0]->type . ')" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
            $counter++;
        }
        $codform .= '</div>';
        $codform .= "<div id='addNewMatchingAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(11); return false' counter='2' name='addNewAnswer' id='addNewMatchingAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
//        $codform .= '<div style="display: flex"><div class="answerContainer" name="answerContainer' . $counter . '" id="answerContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="answer" name="answer' . $counter . '" value="' . $answer . '"></div><div class="correctContainer" name="correctContainer' . $counter . '" id="correctContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="correct" name="correct' . $counter . '" value="' . $rightOne . '"></div><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer($counter)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
//        $counter++;
//        $codform .= '<div style="display: flex"><div class="answerContainer" name="answerContainer' . $counter . '" id="answerContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="answer" name="answer' . $counter . '" value="' . $answer . '"></div><div class="correctContainer" name="correctContainer' . $counter . '" id="correctContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="correct" name="correct' . $counter . '" value="' . $rightOne . '"></div><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer($counter)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
    }
    $codform .= "<input id='answerCounter' name='answerCounter' style='display: none' value='" . $counter . "'>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='positiveArea'>" . __("Positive feedback", "knq") . ":</label></td><td><textarea rows='5' cols='100' name='positiveArea' id='positiveArea'>" . $detaliiIntrebari[0]->feedbackp . "</textarea></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='negativeArea'>" . __("Negative feedback", "knq") . ":</label></td><td><textarea rows='5' cols='100' name='negativeArea' id='negativeArea'>" . $detaliiIntrebari[0]->feedbackn . "</textarea></td></tr>";
    if (isset($_POST['submit_image_selector']) && isset($_POST['image_attachment_id'])) :
        update_option('media_selector_attachment_id', absint($_POST['image_attachment_id']));
    endif;
    wp_enqueue_media();
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%>" . __("Associated image", "knq") . ":</td><td><div class='image-preview-wrapper'><input type='hidden' name='imageUrl' id='imageUrl' value='" . ($detaliiIntrebari[0]->image != NULL ? $detaliiIntrebari[0]->image : "") . "'><img id='image-preview' src='" . ($detaliiIntrebari[0]->image != NULL ? $detaliiIntrebari[0]->image : "' style='display:none") . "' width='100' height='100' style='max-height: 100px; width: auto;'>
                </div>
                <input id='upload_image_button' type='button' class='button button-primary' value='" . __("Load image", "knq") . "' /> <button type='button' id='remove_image' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' style='margin-left: 1vw'  onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'>" . __("Delete image", "knq") . "</button><input type='hidden' name='image_attachment_id' id='image_attachment_id' value=''><br><br>";
    $codform .= "<label for='image_position'>" . __("Image position related to question text", "knq") . ":</label> <select name='image_position' id='image_position'><option value='above'" . ($detaliiIntrebari[0]->image_position == "above" ? "selected" : "") . ">" . __("Above", "knq") . "</option><option value='below'" . ($detaliiIntrebari[0]->image_position == "below" ? "selected" : "") . ">" . __("Below", "knq") . "</option><option value='left'" . ($detaliiIntrebari[0]->image_position == "left" ? "selected" : "") . ">" . __("Left", "knq") . "</option><option value='right'" . ($detaliiIntrebari[0]->image_position == "right" ? "selected" : "") . ">" . __("Right", "knq") . "</option></select></td></tr>";
    $codform .= '<tr style="background-color:#A6C4DD">' . "<td widht=30%></td><td><input type='submit'  class='button button-primary' id='updateQuestion' value='" . __("Update question", "knq") . "'></td></tr>";
    $codform .= '</table>';
    $codform .= "</form><br>";
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - just the quiz", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title and the description", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1 description=1]'></td></tr>";
    $codform .= "</table><br>";
    wp_enqueue_media();
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= "<tr class=inactive><td width=20% style='vertical-align:middle;'>" . __("Be careful! When you delete a question, there is no undo!", "knq") . "</td><td style='vertical-align:middle;'><form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuiz' value='" . __("Delete question", "knq") . "' onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'><input type='hidden' name='valid4' value='1'><input type='hidden' name='quizId4' value='" . $quizId . "' /><input type='hidden' name='questionId4' value='" . $qid . "'></form></td></tr></table>";
    $codform .= '<script type="text/javascript">empty_question="' . __('Empty question', 'knq') .'"; min_2_answers="' . __('At least 2 answers needed', 'knq') . '"; empty_anwer="' . __('Empty answer', 'knq') . '"; no_right_answer="' . __('No right answer selected', 'knq') . '"; too_many_right_answers="' . __('Too many right answers selected', 'knq') .  '"; incorrect_formating = "' . __('Incorrect formatting', 'knq') .'"; width_limit="' . __('Must be between 1 and 100', 'knq') .'"; empty_word_search="' . __('Empty word search', 'knq') . '"; no_search_words="' . __('No search words provided', 'knq') . '"; min_3_search_words="' . __('Provide at least 3 search words', 'knq') . '"</script>';
    //"<form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuestion' value='" . __("Delete question", "knq") . "'><input type='hidden' name='valid4' value='1'><input type='hidden' name='quizId4' value='" . $quizId . "' /><input type='hidden' name='questionId4' value='" . $qid . "'></form>";
    echo $codform;
    echo '</div>';
}

function knq_statistici()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-users" aria-hidden="true"></i> ' . __('Statistics', 'knq') . '</h2><br>';
    $codform = "";
    $scores = $wpdb->get_results($wpdb->prepare("SELECT score,timestamp,attempts,wp_knq_user_scores.quiz_id,display_name,option_value FROM " . $wpdb->prefix . "knq_user_scores, " . $wpdb->prefix . "users, " . $wpdb->prefix . "knq_details WHERE (" . $wpdb->prefix . "knq_user_scores.user_id=" . $wpdb->prefix . "users.ID AND " . $wpdb->prefix . "knq_user_scores.quiz_id=" . $wpdb->prefix . "knq_details.quiz_id AND option_name='title') ORDER BY timestamp DESC limit 25"));
    $codform .= '<h3>' . __("Last played quizzes", "knq") . '</h3>';
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= '<tr style="background-color:#A6C4DD;"><td><strong>' . __('User', 'knq') . '</strong></td><td><strong>' . __('Score', 'knq') . '</strong></td><td><strong>' . __('Attempts', 'knq') . '</strong></td><td><strong>' . __('Quiz', 'knq') . '</strong></td><td><strong>' . __('When', 'knq') . '</td></tr>';
    $i = 1;
    foreach ($scores as $score) {
        $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td>' . $score->display_name . '</td><td>' . $score->score . '</td><td>' . ($score->attempts - 0) . '</td><td>' . $score->option_value . '</td><td>' . $score->timestamp . '</td></tr>';
    }
    $codform .= '</table>';
    echo $codform;
    echo '</div>';
}