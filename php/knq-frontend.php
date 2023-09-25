<?php

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
    $o = "<div id='quiz" . $crtid . "'' class='ibox quiz' data-quiz-id='" . $crtid . "'>";
    //$o .= "<span><a id='fullscreen-link'><i class='fa fa-expand'></i></a></span>";
    $o .= "<p id='quizId" . $crtid . "''' style='display: none'>" . $crtid . "</p><a id='fullscreen-link" . $crtid . "''' style='float:right;cursor: pointer;' title='Comută pe ecran plin'><i class='fa fa-expand'></i></a>";
    $score = $wpdb->get_results($wpdb->prepare("SELECT score, timestamp FROM " . $wpdb->prefix . "knq_user_scores WHERE quiz_id=" . $crtid . " AND user_id='" . (_wp_get_current_user()->ID - 0) . "'"));

    if (count($score) == 0) {
        $o .= "<p id='quizCompletion" . $crtid . "''' completed_before='0'><span id='score" . $crtid . "'''>" . __("Current score", "knq") . ": 0</span>. " . __('You have not completed this quiz before', 'knq') . ".</p><span style='display: none' id='points" . $crtid . "'''>0</span>";
    } else {
        $o .= "<p id='quizCompletion" . $crtid . "''' completed_before='1'><span id='score" . $crtid . "'''>" . __("Current score", "knq") . ": 0</span>. " . __('Previous score', 'knq') . ": " . $score[0]->score . " (" . date_i18n(get_option('time_format'), strtotime($score[0]->timestamp)) . ", " . date_i18n(get_option('date_format'), strtotime($score[0]->timestamp)) . ").</p><span style='display: none' id='points" . $crtid . "'''>0</span>";
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


    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_answers'"));
    if (count($globalShuffleAnswers) == 0) {
        $globalShuffleAnswers = '3';
    } else {
        $globalShuffleAnswers = $globalShuffleAnswers[0]->option_value;
    }
    $randomAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='random_answers'"));
    $o .= '<p id="shuffleAnswers' . $crtid . '" style="display: none">' . (count($randomAnswers) != 0 ? $randomAnswers[0]->option_value : $globalShuffleAnswers) . '</p>';

    $cate = $wpdb->get_row($wpdb->prepare("SELECT COUNT(order_id) AS cate FROM " . $wpdb->prefix . "knq WHERE quiz_id=$crtid AND order_id>0"));
    $cate = $cate->cate - 0;

    $iduri = $wpdb->get_col($wpdb->prepare("SELECT knq_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=$crtid AND order_id>0 ORDER BY order_id"));
    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_questions'"));
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
    $o .= "<div id='questionContainer" . $crtid . "''></div>";
    $o .= "<button id='redoQuiz" . $crtid . "' style='display: none' class='button button-primary'>" . __("Redo quiz", "knq") . "</button>";
    $o .= '<div style="display:none;" id="iduri' . $crtid . '">' . $iduri . '</div>';
    $o .= '<div style="display:none;" id="crti' . $crtid . '">1</div>';
    $o .= '<div style="display:none;" id="feedback_end_' . $crtid . '"></div>';
    $o .= '<div style="display:none;" id="right_answers_' . $crtid . '"></div>';
    $o .= '<div style="display:none;" id="current_fullscreen"></div>';
    $o .= '<script type="text/javascript">iduri="' . $iduri . '";';
    $o .= 'cate=' . $cate . ';crti' . $crtid . '=1;';

    $answerQuestion = get_option_value($crtid, 'answer_question', __('Done!', 'knq'));
    $nextQuestion = get_option_value($crtid, 'next_question', __('Next!', 'knq'));
    $finishQuiz = get_option_value($crtid, 'finish_quiz', __('Finish!', 'knq'));
    $correctAnswerMessage = get_option_value($crtid, 'correct_answer_message', __('Correct!', 'knq'));
    $wrongAnswerMessage = get_option_value($crtid, 'wrong_answer_message', __('Wrong!', 'knq'));
    $correctColor = get_option_value($crtid, 'correct_color', '#B1D9BC');
    $wrongColor = get_option_value($crtid, 'wrong_color', '#FAB6B6');
    $neutralColor = get_option_value($crtid, 'neutral_color', '#F4F4F4');
    $mainColor = get_option_value($crtid, 'main_color', '#FFF9B9');

    $o .= 'text_partial_out_of="' . __('questions right out of', 'knq') . '"; text_partial_correct="' . __('You got', 'knq') . '"; text_all_correct="' . __('You got all the questions right.', 'knq') . '"; text_new_highscore="' . __('New highscore!', '') . '"; text_final_score="' . __('Final score') . '"; text_all_wrong="' . __('You got all the questions wrong.', 'knq') . '"; text_previous_score="' . __('Previous score', 'knq') . '"; text_obtained_now="' . __('obtained now', 'knq') . '"; text_guess="' . __('Type here what you see in the image', 'knq') . '"; text_true="' . __('T', 'knq') . '"; text_false="' . __('F', 'knq') . '"; color_hover="' . $mainColor . '"; color_neutral="' . $neutralColor . '";color_nok="' . $wrongColor . '"; color_ok ="' . $correctColor . '" ;msg_done="' . $answerQuestion . '";msg_next="' . $nextQuestion . '";msg_finish="' . $finishQuiz . '";msg_correct="' . $correctAnswerMessage . '";msg_wrong="' . $wrongAnswerMessage . '"; find_words="' . __('Find above the following words', 'knq') . '"; choose_answer_msg="' . __('Choose the right answer', 'knq') . '"';
    $o .= '</script>';


    // enclosing tags
    if (!is_null($content)) {
        // secure output by executing the_content filter hook on $content
        $o .= apply_filters('the_content', $content);

        // run shortcode parser recursively
        $o .= do_shortcode($content);
    }

    // end box
    $o .= '</div>';

    // return output
    return $o;
}

function get_option_value($crtid, $option_name, $default_value)
{
    global $wpdb;
    $option = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $crtid . " AND option_name='" . $option_name . "'"));
    if (count($option) == 0) {
        $option = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='" . $option_name . "'"));
        if (count($option) == 0) {
            $option = $default_value;
        } else {
            $option = $option[0]->option_value;
        }
    } else {
        $option = $option[0]->option_value;
    }
    return $option;
}