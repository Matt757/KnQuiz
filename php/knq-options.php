<?php

function knq_options()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-cogs" aria-hidden="true"></i> ' . __('General options', 'knq') . '</h2><br>';
    echo '<form method="post"><input type="hidden" value="1" name="valid1">';
    $check = true;
    if (isset($_POST['valid1'])) {
        $check &= modify_global_option('answerQuestion', __('Default value', 'knq'), __('Done!', 'knq'), 'answer_question');
        $check &= modify_global_option('nextQuestion', __('Default value', 'knq'), __('Next!', 'knq'), 'next_question');
        $check &= modify_global_option('finishQuiz', __('Default value', 'knq'), __('Finish!', 'knq'), 'finish_quiz');
        $check &= modify_global_option('correctAnswerMessage', __('Default value', 'knq'), __('Correct!', 'knq'), 'correct_answer_message');
        $check &= modify_global_option('wrongAnswerMessage', __('Default value', 'knq'), __('Wrong!', 'knq'), 'wrong_answer_message');
        $check &= modify_global_option('globalDifficulty', '0', '3', 'difficulty');
        $check &= modify_global_option('globalShuffleQuestions', '-1', '0', 'shuffle_questions');
        $check &= modify_global_option('globalShuffleAnswers', '-1', '0', 'shuffle_answers');
        $check &= modify_global_option('correctColor', __('Default value', 'knq'), '#B1D9BC', 'correct_color');
        $check &= modify_global_option('wrongColor', __('Default value', 'knq'), '#FAB6B6', 'wrong_color');
        $check &= modify_global_option('neutralColor', __('Default value', 'knq'), '#F4F4F4', 'neutral_color');
        $check &= modify_global_option('mainColor', __('Default value', 'knq'), '#FFF9B9', 'main_color');

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

    $globalDifficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='difficulty'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalDifficulty">' . __('Difficulty level', 'knq') . ':</label></td><td><select id="globalDifficulty" name="globalDifficulty">';
    if (count($globalDifficulty) == 0) {
        $o .= '<option selected value="0">' . __('Default value', 'knq') . '</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>';
    } else {
        $o .= '<option ' . ($globalDifficulty[0]->option_value == 1 ? 'selected' : '') . ' value="1">1</option><option ' . ($globalDifficulty[0]->option_value == 2 ? 'selected' : '') . ' value="2">2</option><option ' . ($globalDifficulty[0]->option_value == 3 ? 'selected' : '') . ' value="3">3</option><option ' . ($globalDifficulty[0]->option_value == 4 ? 'selected' : '') . ' value="4">4</option><option ' . ($globalDifficulty[0]->option_value == 5 ? 'selected' : '') . ' value="5">5</option>';
    }
    $o .= '</select></td></tr>';

    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_questions'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalShuffleQuestions">' . __('Shuffle questions', 'knq') . ': </label></td><td><select id="globalShuffleQuestions" name="globalShuffleQuestions">';
    if (count($globalShuffleQuestions) == 0) {
        $o .= '<option selected value="-1">' . __('Default value', 'knq') . '</option><option value="0">' . __("No", "knq") . '</option><option value="1">' . __("Yes", "knq") . '</option></td></tr>';
    } else {
        $o .= '<option ' . ($globalShuffleQuestions[0]->option_value == 0 ? 'selected' : '') . ' value="0">' . __("No", "knq") . '</option><option ' . ($globalShuffleQuestions[0]->option_value == 1 ? 'selected' : '') . ' value="1">' . __("Yes", "knq") . '</option>';
    }
    $o .= '</select></td></tr>';

    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_answers'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="globalShuffleAnswers">' . __('Shuffle answers', 'knq') . ': </label></td><td><select id="globalShuffleAnswers" name="globalShuffleAnswers">';
    if (count($globalShuffleAnswers) == 0) {
        $o .= '<option selected value="-1">' . __('Default value', 'knq') . '</option><option value="0">' . __("No", "knq") . '</option>value="1">' . __("Yes", "knq") . '</option>';
    } else {
        $o .= '<option ' . ($globalShuffleAnswers[0]->option_value == 0 ? 'selected' : '') . ' value="0">' . __("No", "knq") . '</option><option ' . ($globalShuffleAnswers[0]->option_value == 1 ? 'selected' : '') . ' value="1">' . __("Yes", "knq") . '</option>';
    }
    $o .= '</select></td></tr>';

    $globalCorrectColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_color'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="correctColor">' . __('Correct color', 'knq') . ':</label></td><td style="display: flex; margin: auto;"><input style="height: fit-content" id="correctColor" name="correctColor" value="' . (count($globalCorrectColor) == 0 ? __('Default value', 'knq') : $globalCorrectColor[0]->option_value) . '"/><div id="correctColorPicker"></div></td></tr>';

    $globalWrongColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_color'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="wrongColor">' . __('Wrong color', 'knq') . ':</label></td><td style="display: flex; margin: auto;"><input style="height: fit-content" id="wrongColor" name="wrongColor" value="' . (count($globalWrongColor) == 0 ? __('Default value', 'knq') : $globalWrongColor[0]->option_value) . '"/><div id="wrongColorPicker"></div></td></tr>';

    $globalNeutralColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='neutral_color'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="neutralColor">' . __('Neutral color', 'knq') . ':</label></td><td style="display: flex; margin: auto;"><input style="height: fit-content" id="neutralColor" name="neutralColor" value="' . (count($globalNeutralColor) == 0 ? __('Default value', 'knq') : $globalNeutralColor[0]->option_value) . '"/><div id="neutralColorPicker"></div></td></tr>';

    $globalMainColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='main_color'"));
    $o .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . '<td style="width: 30%"><label for="mainColor">' . __('Main color', 'knq') . ':</label></td><td style="display: flex; margin: auto;"><input style="height: fit-content" id="mainColor" name="mainColor" value="' . (count($globalMainColor) == 0 ? __('Default value', 'knq') : $globalMainColor[0]->option_value) . '"/><div id="mainColorPicker"></div></td></tr>';

    $o .= '<tr><td><input type="submit" class="button button-primary" value="' . __('Update options', 'knq') . '"></td></tr></table>';
    echo $o;
}

function modify_global_option($object_name, $missing_value, $default_value, $option_name)
{
    $check = true;
    global $wpdb;
    if ($_POST[$object_name] != $missing_value) {
        $result = $wpdb->query(
            $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST[$object_name] . "' WHERE quiz_id=0 AND option_name='" . $option_name ."'")
        );
        if (!$result && !(gettype($result) == 'integer')) {
            $check = false;
        }
    } else {
        $result = $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (0, '" . $option_name . "', '" . $default_value . "')")
        );
        if (!$result && !(gettype($result) == 'integer')) {
            $check = false;
        }
    }
    return $check;
}
