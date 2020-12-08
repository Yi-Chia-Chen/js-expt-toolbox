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
const PLEDGE_CHECK_SCRIPT = 'php/pledge_check.php';
const PLEDGE_RECORD_SCRIPT = 'php/pledge_record.php';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const PLEDGE_FILE = 'pledge_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const RATING_FILE = 'rating_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR = FORMAL ? '../data/formal':'../data/testing';
const ID_GET_VARIABLE_NAME = 'PROLIFIC_PID';
const FREE_PASS_ID = '1234'; // this is used for testing so this id will always have future access regardless of pledge responses

// stimuli
const STIM_PATH = 'media/';
const RATING_PRACTICE_LIST = ['prac.jpg'];
const RATING_PRACTICE_TRIAL_N = RATING_PRACTICE_LIST.length;
const RATING_LIST = [
    'eating_alone.jpg', 'eating_group.jpg',
    'working_alone.jpg', 'working_group.jpg',
    'interviewing_alone.jpg', 'interviewing_group.jpg'
];
const RATING_IMG_LIST = SHUFFLE_ARRAY(RATING_LIST);
const RATING_TRIAL_N = RATING_IMG_LIST.length;
const RATING_INSTR_TRIAL_N = RATING_PRACTICE_TRIAL_N + RATING_TRIAL_N;
const INTERTRIAL_INTERVAL = 0.5;
const INSTR_IMG_LIST = ['maximize_window.png'];
const ALL_IMG_LIST = RATING_PRACTICE_LIST.concat(RATING_LIST).concat(INSTR_IMG_LIST);


// object variables
var instr, subj, rating;

// criteria
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.75;


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new subjObject(subj_options);
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        HALT_EXPERIMENT('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    } else if (subj.valid_id){
        LOAD_IMG(0, STIM_PATH, ALL_IMG_LIST, function() {});
        SEARCH_PLEDGE();
    }
});

function HALT_EXPERIMENT(explanation) {
    $('.page-box').hide();
    $('#instr-text').html(explanation);
    $('#next-button').hide();
    $('#instr-box').show();
}

function AJAX_FAILED() {
    HALT_EXPERIMENT('Oops! An error has occurred. Please submit with the code "AJAX_ERR". Sorry!');
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
    'userAgent',
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

function SEARCH_PLEDGE() {
    if (subj.id == FREE_PASS_ID) {
        $('#pledge-box').show();
    } else {
        POST_DATA(PLEDGE_CHECK_SCRIPT, { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id}, CHECK_PLEDGE, AJAX_FAILED);
    }
}

function CHECK_PLEDGE(found) {
    if (found == '0') {
        $('#pledge-box').show();
    } else {
        HALT_EXPERIMENT('It seems that you have reported that you will not read the instructions carefully before. In that case, you will not be fully informed and thus we are not allowed to let you participate because of the ethical concerns.<br /><br />If you believe you have received this message in error, please contact the experimenter at XXX@ucla.edu. Otherwise, please return the task.');
    }
}

function SUBMIT_PLEDGE_Q() {
    const RESP = $('input[name="pledge"]:checked').val();
    if (CHECK_IF_RESPONDED([], [RESP])) {
        $('#pledge-box').hide();
        if (RESP == 1){
            ACCEPT_PLEDGE()
        } else {
            REFUSE_PLEDGE();
        }
    } else {
        $('#pledge-warning').text('Please answer the question to start the experiment. Thank you!');
    }
}

function ACCEPT_PLEDGE() {
    instr = new instrObject(instr_options);
    rating_options['subj'] = subj;
    rating = new trialObject(rating_options);
    instr.start();
}

function REFUSE_PLEDGE() {
    POST_DATA(PLEDGE_RECORD_SCRIPT, { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id});
    HALT_EXPERIMENT('It seems that you have reported that you will not read the instructions carefully. In that case, you will not be fully informed and thus we are not allowed to let you participate because of the ethical concerns.<br /><br /> We are sorry that we have to ask you to return the task.');
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function SUBMIT_DEBRIEFING_Q() {
    subj.serious = $('input[name=serious]:checked').val();
    subj.problems = $('#problems').val();
    subj.gender = $('input[name=gender]:checked').val();
    subj.age = $('#age').val();
    const OPEN_ENDED_LIST = [subj.problems, subj.age];
    const OPEN_ENDED_ATTRIBUTE_NAMES = ['problems', 'age'];
    const CHOICE_LIST = [subj.serious, subj.gender];
    const ALL_RESPONDED = CHECK_IF_RESPONDED(OPEN_ENDED_LIST, CHOICE_LIST);
    if (ALL_RESPONDED) {
        for (var i = 0; i < OPEN_ENDED_LIST.length; i++) {
            subj[OPEN_ENDED_ATTRIBUTE_NAMES[i]] = subj[OPEN_ENDED_ATTRIBUTE_NAMES[i]].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.quizAttemptN = instr.quizAttemptN['onlyQ'];
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.submitQ();
        $('#questions-box').hide();
        ALLOW_SELECTION();
        $('#debriefing-box').show();
        $('body').scrollTop(0);
    } else {
        $('#questions-warning').text('Please answer all questions to complete the experiment. Thank you!');
    }
}

function ALLOW_SELECTION() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
    });
}

function END_TO_PROLIFIC() {
    window.location.href = 'https://app.prolific.co/submissions/complete?cc=XXX'; // link provided by Prolific
}

var subj_options = {
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    subjNumScript: SUBJ_NUM_SCRIPT,
    savingScript: SAVING_SCRIPT,
    subjNumFile: SUBJ_NUM_FILE,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};


// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

const MAIN_INSTRUCTIONS_DICT = {
    0: [false, false, 'Thank you very much!<br /><br />This study will take about 10 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.'],
    1: [SHOW_MAXIMIZE_WINDOW, false, 'Now, please maximize your browser window.'],
    2: [HIDE_INSTR_IMG, false, 'In this study, we will show you '+RATING_INSTR_TRIAL_N+' images, one at a time. We are interested in how positive you feel looking at each image.'],
    3: [false, false, 'Six options will be available below the images as six buttons. Just click one of the options based on your experience.'],
    4: [false, false, "The next page is a quick instruction quiz. (It's very simple!)"],
    5: [false, SHOW_INSTR_QUESTION, ''],
    6: [SHOW_CONSENT, false, "Great! You can press SPACE to start. Please focus after you start (e.g., don't switch to other windows or tabs!)"]
};

function SHOW_INSTR_IMG(file_name) {
    $('#instr-img').attr('src', STIM_PATH + file_name);
    $('#instr-img').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instr-img').css('display', 'none');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_INSTR_QUESTION() {
    $('#instr-box').hide();
    $('#quiz-box').show();
}

function SUBMIT_INSTR_Q() {
    const CHOICE = $('input[name="quiz"]:checked').val();
    if (typeof CHOICE === 'undefined') {
        $('#quiz-warning').text('Please answer the question. Thank you!');
    } else if (CHOICE != 'option1') {
        instr.quizAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instr-text').text('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instr-box').show();
        $('#quiz-box').hide();
        $('input[name="quiz"]:checked').prop('checked', false);
        instr.index = -1;
    } else {
        instr.saveReadingTime();
        instr.next();
        $('#quiz-box').hide();
        $('#instr-box').show();
    }
}

function SHOW_CONSENT() {
    $('#next-button').hide();
    $('#consent-box').show();
    $(document).keyup(function(e) {
        if (e.code == 'Space') {
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instr-box').hide();
            subj.saveAttrition();
            SHOW_RATING();
        }
    });
}

var instr_options = {
    textBox: $('#instr-box'),
    textElement: $('#instr-text'),
    dict: MAIN_INSTRUCTIONS_DICT,
    quizConditions: ['onlyQ']
};


// ########    ###     ######  ##    ##
//    ##      ## ##   ##    ## ##   ##
//    ##     ##   ##  ##       ##  ##
//    ##    ##     ##  ######  #####
//    ##    #########       ## ##  ##
//    ##    ##     ## ##    ## ##   ##
//    ##    ##     ##  ######  ##    ##

const RATING_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'trialNum',
    'stimName',
    'inView',
    'response',
    'rt'
];

function SHOW_RATING() {
    $('#task-box').show();
    rating.run();
}

function RATING_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    rating.stimName = this_trial;
    $('#trial-progress').text(rating.progress);
    $('#test-img').attr('src', path + this_trial);
    if (!last) {
        $('#buffer-img').attr('src', path + next_trial);
    }
}

function RATING() {
    $('#test-img').show();
    $('.rating-button').mouseup(
        function(event) {
            $('.rating-button').unbind('mouseup');
            rating.inView = CHECK_FULLY_IN_VIEW($('#test-img'));
            $('#test-img').hide();
            var target = $(event.target).closest('.rating-button');
            rating.end(target.attr('id'));
        }
    );
}

function END_RATING() {
    $('#task-box').hide();
    $('#questions-box').show();
    rating.save();
}

var rating_options = {
    titles: RATING_TITLES,
    pracTrialN: RATING_PRACTICE_TRIAL_N,
    trialN: RATING_TRIAL_N,
    savingScript: SAVING_SCRIPT,
    dataFile: RATING_FILE,
    stimPath: STIM_PATH,
    savingDir: SAVING_DIR,
    trialList: RATING_IMG_LIST,
    pracList: RATING_PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: RATING_UPDATE,
    trialFunc: RATING,
    endExptFunc: END_RATING,
    progressInfo: true
}