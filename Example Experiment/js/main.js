// Yi-Chia Chen


// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

// data saving
const FORMAL = false;
const EXPERIMENT_NAME = 'rating';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const RATING_FILE = 'rating_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR = FORMAL ? '/var/www-data-experiments/cvlstudy_data/YCC/example'+EXPERIMENT_NAME+'/formal' : '/var/www-data-experiments/cvlstudy_data/YCC/example'+EXPERIMENT_NAME+'/testing';
const ID_GET_VARIABLE_NAME = 'id';
const COMPLETION_URL = 'https://ycc.vision/';

// stimuli
const STIM_PATH = 'media/';
const PRACTICE_LIST = ['prac.jpg'];
const PRACTICE_TRIAL_N = PRACTICE_LIST.length;
const IMG_LIST = [
    'eating_alone.jpg', 'eating_group.jpg',
    'working_alone.jpg', 'working_group.jpg',
    'interviewing_alone.jpg', 'interviewing_group.jpg'
];
const TRIAL_LIST = shuffle_array(IMG_LIST);
const TRIAL_N = TRIAL_LIST.length;
const INSTR_TRIAL_N = PRACTICE_TRIAL_N + TRIAL_N;
const INTERTRIAL_INTERVAL = 0.5;
const INSTR_IMG_LIST = ['maximize_window.png'];
const ALL_IMG_LIST = PRACTICE_LIST.concat(TRIAL_LIST).concat(INSTR_IMG_LIST);

// criteria
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.3;

// object variables
let subj, instr, task;

function halt_experiment(explanation) {
    $('.page-box').hide();
    $('#instr-text').html(explanation);
    $('#next-button').hide();
    $('#instr-box').show();
}

function ajax_failed() {
    halt_experiment('SERVER ERROR: Please email yichiachen@g.ucla.edu with the message "AJAX-ERR" to receive credit.');
}

//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = [
    'num',
    'date',
    'startTime',
    'id',
    'endTime',
    'duration',
    'quizAttemptN',
    'instrReadingTimes',
    'quickReadingPageN',
    'hiddenCount',
    'hiddenDurations',
    'serious',
    'problems',
    'gender',
    'age',
    'inView',
    'viewportW',
    'viewportH'
];

let subj_options = {
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    subjNumCallback: update_task_object_subj_num,
    subjNumScript: SUBJ_NUM_SCRIPT,
    savingScript: SAVING_SCRIPT,
    subjNumFile: SUBJ_NUM_FILE,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR
};

function update_task_object_subj_num() {
    if (typeof task !== 'undefined'){
        task.num = subj.num;
    }
}

function submit_debriefing_questions() {
    let open_ended_names = ['problems', 'age'];
    let choice_names = ['serious', 'maximized', 'gender'];
    fetch_debriefing_responses(subj, open_ended_names, choice_names);
    let all_responded = show_hide_warnings(subj, open_ended_names, choice_names);
    if (all_responded) {
        for (let a of open_ended_names) {
            subj[q] = $('#'+q).val().replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.quizAttemptN = instr.quizAttemptN['onlyQ'];
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.submitAnswers();
        $('#questions-box').hide();
        exit_fullscreen();
        allow_selection();
        $('#debriefing-box').show();
        $('body').scrollTop(0);
    }
}

function fetch_debriefing_responses(obj, open_ended_names, choice_names) {
    for (let q of open_ended_names) {
        obj[q] = $('#'+q).val().replace(/(?:\r\n|\r|\n|\s)/g, '');
        }
    for (let q of choice_names) {
        obj[q] = $('input[name='+q+']:checked').val();
    }
}

function show_hide_warnings(obj, open_ended_names, choice_names) {
    let all_responded = true;
    for (let q of open_ended_names) {
        if(obj[q] == ''){
            $('#'+q+'-warning').show();
            $('body').scrollTop(0);
            all_responded = false;
        } else{
            $('#'+q+'-warning').hide();
        }
    }
    for (let q of choice_names) {
        if(typeof obj[q] == 'undefined'){
            $('#'+q+'-warning').show();
            $('body').scrollTop(0);
            all_responded = false;
        }else{
            $('#'+q+'-warning').hide();
        }
    }
    return all_responded;
}

function allow_selection() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
    });
}

function go_to_completion_page() {
    window.location.href = COMPLETION_URL+'?id='+subj.id;
}

// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

const INSTRUCTIONS = [
    [false, false, 'Thank you very much!<br /><br />This study will take about 10 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.'],
    [show_maximize_window, false, 'For this study to work, the webpage will automatically switch to the full-screen view on the next page. Please stay in the full screen mode until the study automatically switches out from it.'],
    [hide_instr_img, enter_fullscreen, 'In this study, we will show you '+RATING_INSTR_TRIAL_N+' images, one at a time. We are interested in how positive you feel looking at each image.'],
    [false, false, 'Six options will be available below the images as six buttons. Just click one of the options based on your experience.'],
    [false, false, "The next page is a quick instruction quiz. (It's very simple!)"],
    [false, show_instr_question, ''],
    [show_consent, false, "Great! You can press SPACE to start. Please focus after you start (e.g., don't switch to other windows or tabs!)"]
];

function show_instr_img(file_name) {
    $('#instr-img').attr('src', STIM_PATH + file_name);
    $('#instr-img').css('display', 'block');
}

function hide_instr_img() {
    $('#instr-img').css('display', 'none');
}

function show_maximize_window() {
    show_instr_img('maximize_window.png');
}

function show_instr_question() {
    $('#instr-box').hide();
    $('#quiz-box').show();
}

function submit_instruction_quiz() {
    let choice = $('input[name="quiz"]:checked').val();
    if (typeof choice === 'undefined') {
        $('#quiz-warning').text('Please answer the question. Thank you!');
    } else if (choice != 'option1') {
        instr.quizAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instr-text').text('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instr-box').show();
        instr.startTime = Date.now();
        instr.index = -1;
        $('#quiz-box').hide();
        $('input[name="quiz"]:checked').prop('checked', false);
    } else {
        instr.next();
        $('#quiz-box').hide();
        $('#instr-box').show();
    }
}

function show_consent() {
    $('#next-button').hide();
    $('#consent-box').show();
    $(document).keyup(function(e) {
        if (e.key == ' ') {
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instr-box').hide();
            subj.saveAttrition();
            show_task();
        }
    });
}

let instr_options = {
    textBox: $('#instr-box'),
    textElement: $('#instr-text'),
    arr: INSTRUCTIONS,
    quizConditions: ['onlyQ']
};


// ########    ###     ######  ##    ##
//    ##      ## ##   ##    ## ##   ##
//    ##     ##   ##  ##       ##  ##
//    ##    ##     ##  ######  #####
//    ##    #########       ## ##  ##
//    ##    ##     ## ##    ## ##   ##
//    ##    ##     ##  ######  ##    ##

const TASK_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'trialNum',
    'stimName',
    'inView',
    'response',
    'rt'
];

function show_task() {
    task_options['subj'] = subj;
    task = new Task(task_options);
    $('#task-box').show();
    subj.detectVisibilityStart();
    task.run();
}

function task_update(formal_trial, last, this_trial, next_trial, path) {
    task.stimName = this_trial;
    $('#trial-progress').text(task.progress);
    $('#test-img').attr('src', path + this_trial);
    if (!last) {
        $('#buffer-img').attr('src', path + next_trial);
    }
}

function rating() {
    $('#test-img').show();
    $('.rating-button').mouseup(
        function(event) {
            $('.rating-button').unbind('mouseup');
            task.inView = check_fully_in_view($('#test-img'));
            $('#test-img').hide();
            let target = $(event.target).closest('.rating-button');
            task.end(target.attr('id'));
        }
    );
}

function end_task() {
    subj.detectVisibilityEnd();
    task.save();
    $('#task-box').hide();
    $('#questions-box').show();
}

let task_options = {
    titles: TASK_TITLES,
    pracTrialN: RATING_PRACTICE_TRIAL_N,
    trialN: RATING_TRIAL_N,
    savingScript: SAVING_SCRIPT,
    dataFile: RATING_FILE,
    stimPath: STIM_PATH,
    savingDir: SAVING_DIR,
    trialList: RATING_IMG_LIST,
    pracList: RATING_PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: task_update,
    trialFunc: rating,
    endExptFunc: end_task,
    progressInfo: true
};


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new Subject(subj_options);
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.validID){
        load_img(0, STIM_PATH, ALL_IMG_LIST);
        instr = new Instructions(instr_options);
        instr.start();
    } else {
        halt_experiment('ID ERROR: Please visit the experiment page again from the link provided on the website you signed up for the experiment. If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu with the message "ID-ERROR" .');
    }
});