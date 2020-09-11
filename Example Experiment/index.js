// Yi-Chia Chen


// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

const FORMAL = false;
const EXPERIMENT_NAME = 'distInterv';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const RATING_FILE = 'rating_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const PLEDGE_FILE = 'pledge_' + EXPERIMENT_NAME + '.txt';
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = FORMAL ? 'data/formal':'data/testing';
const ID_GET_VARIABLE_NAME = 'PROLIFIC_PID';
const FREE_PASS_ID = '1234'; // this is used for testing so this id will always have future access regardless of pledge responses

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;

const INSTR_READING_TIME_MIN = 0.5;

const STIM_PATH = 'Stimuli/';

// Rating
const RATING_PRACTICE_LIST = ['prac.jpg'];
const RATING_PRACTICE_TRIAL_N = RATING_PRACTICE_LIST.length;
const RATING_IMG_LIST = SHUFFLE_ARRAY([
    'eating_alone.jpg', 'eating_group.jpg',
    'working_alone.jpg', 'working_group.jpg',
    'interviewing_alone.jpg', 'interviewing_group.jpg'
]);
const RATING_TRIAL_N = RATING_IMG_LIST.length;
const RATING_INSTR_TRIAL_N = RATING_PRACTICE_TRIAL_N + RATING_TRIAL_N;
const INTERTRIAL_INTERVAL = 0.5;

// Object variables
var instr, subj, rating;


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        $('#instrText').html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        $('#nextButton').hide();
        $('#instrBox').show();
    } else if (subj.id !== null){
        $('#captchaBox').show();
    }
});


//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = ['num',
                     'date',
                     'startTime',
                     'id',
                     'userAgent',
                     'endTime',
                     'duration',
                     'instrQAttemptN',
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

function INVALID_ID_FUNC() {
    $('#instrText').html("We can't identify a valid Prolific ID. Please reopen the study from the Prolific website again. Thank you!");
    $('#nextButton').hide();
    $('#instrBox').show();
}

function HCAPTCHA_SUBMIT() {
    const HCAPTCHA_RESPONSE = hcaptcha.getResponse();
    function CAPTCHA_RESULTS(results) {
        if (results == 'passed') {
            $('#captchaBox').hide();
            SEARCH_PLEDGE();
        } else {
            $('#captchaBox').hide();
            $('#instrText').html('Oops! An error has occurred. Please contact the experiment yichiachen@ucle.edu with the code "CAPTCHA_ERR". Sorry!');
            $('#nextButton').hide();
            $('#instrBox').show();
        }
    }
    POST_DATA('hCaptcha_verification.php', { 'hCaptcha_token': HCAPTCHA_RESPONSE }, CAPTCHA_RESULTS, AJAX_FAILED);
}

function AJAX_FAILED() {
    $('.pageBox').hide();
    $('#instrText').html('Oops! An error has occurred. Please contact the experiment yichiachen@ucle.edu with the code "CAPTCHA_AJAX_ERR". Sorry!');
    $('#nextButton').hide();
    $('#instrBox').show();
}

function SUBMIT_PLEDGE_Q() {
    var pledge_response = $('input[name=pledge]:checked').val();
    var responded = CHECK_IF_RESPONDED([], [pledge_response]);
    if (responded) {
        $('#pledgeBox').hide();
        if (pledge_response == 1){
            ACCEPT_PLEDGE()
        } else {
            REFUSE_PLEDGE();
        }
    } else {
        $('#pledgeQWarning').text('Please answer the question to start the experiment. Thank you!');
    }
}

function SEARCH_PLEDGE() {
    if (subj.id == FREE_PASS_ID) {
        $('#pledgeBox').show();
    } else {
        POST_DATA('pledge_check.php', { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id}, CHECK_PLEDGE, AJAX_FAILED);
    }
}

function CHECK_PLEDGE(found) {
    if (found == '0') {
        $('#pledgeBox').show();
    } else {
        $('#instrText').html('It seems that you have reported that you will not read the instructions carefully before. In that case, you will not be fully informed and thus we are not allowed to let you participate because of the ethical concerns.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu. Otherwise, please return the HIT.');
        $('#nextButton').hide();
        $('#instrBox').show();
    }
}

function ACCEPT_PLEDGE() {
    instr = new instrObject(instr_options);
    instr.start();
    rating_options['subj'] = subj;
    rating = new trialObject(rating_options);
}

function REFUSE_PLEDGE() {
    POST_DATA('pledge_record.php', { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id});
    $('#instrText').html('It seems that you have reported that you will not read the instructions carefully. In that case, you will not be fully informed and thus we are not allowed to let you participate because of the ethical concerns.<br /><br /> We are sorry that we have to ask you to return the HIT.');
    $('#nextButton').hide();
    $('#instrBox').show();
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
    var open_ended_list = [subj.age];
    var choice_list = [subj.serious, subj.gender];
    var all_responded = CHECK_IF_RESPONDED(open_ended_list, choice_list);
    if (all_responded) {
        for (var i = 0; i < open_ended_list.length; i++) {
            open_ended_list[i] = open_ended_list[i].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.instrQAttemptN = instr.qAttemptN['onlyQ'];
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.submitQ();
        $('#questionsBox').hide();
        ALLOW_SELECTION();
        $('#debriefingBox').show();
        $('html')[0].scrollIntoView();
    } else {
        $('#QWarning').text('Please rate your agreement for all statements to complete the experiment. Thank you!');
    }
}

function END_TO_PROLIFIC() {
    window.location.href = 'https://app.prolific.co/submissions/complete?cc=XXX'; // link provided by Prolific
}

function ALLOW_SELECTION() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
    });
}

var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
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

var instr_text = new Array;
instr_text[0] = 'Thank you very much!<br /><br />This study will take about 10 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.';
instr_text[1] = 'Now, please maximize your browser window.';
instr_text[2] = 'In this study, we will show you '+RATING_INSTR_TRIAL_N+' images, one at a time. We are interested in how positive you feel looking at each image.';
instr_text[3] = 'Six options will be available below the images as six buttons. Just click one of the options based on your experience.';
instr_text[4] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[5] = ''; // instruction question 1
instr_text[6] = "Great! You can press SPACE to start. Please focus after you start (Don't switch to other windows or tabs!)";

const INSTR_FUNC_DICT = {
    1: SHOW_MAXIMIZE_WINDOW,
    2: HIDE_INSTR_IMG,
    5: SHOW_INSTR_QUESTION,
    6: SHOW_CONSENT
};

function SHOW_INSTR_IMG(file_name) {
    $('#instrImg').attr('src', STIM_PATH + file_name);
    $('#instrImg').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instrImg').css('display', 'none');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_INSTR_QUESTION() {
    $('#instrBox').hide();
    $('#instrQBox').show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $('input[name="instrQ"]:checked').val();
    if (typeof instrChoice === 'undefined') {
        $('#instrQWarning').text('Please answer the question. Thank you!');
    } else if (instrChoice != 'option1') {
        instr.qAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        $('#instrQBox').hide();
        $('input[name="instrQ"]:checked').prop('checked', false);
        instr.index = -1;
    } else {
        instr.saveReadingTime();
        instr.next();
        $('#instrQBox').hide();
        $('#instrBox').show();
    }
}

function SHOW_CONSENT() {
    $('#nextButton').hide();
    $('#consentBox').show();
    $('#instrBox').show();
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instrBox').hide();
            $('#consentBox').hide();
            subj.saveAttrition();
            SHOW_RATING();
        }
    });
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ']
};


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

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
    $('#trialBox').show();
    rating.run();
}

function RATING_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    rating.stimName = this_trial;
    $('#trialProgress').text(rating.progress);
    $('#testImg').attr('src', path + this_trial);
    if (!last) {
        $('#bufferImg').attr('src', path + next_trial);
    }
}

function RATING() {
    $('#testImg').show();
    $('.ratingButton').mouseup(function(event) {
        $('.ratingButton').unbind('mouseup');
        rating.inView = CHECK_FULLY_IN_VIEW($('#testImg'));
        $('#testImg').hide();
        var target = $(event.target).closest('.ratingButton');
        rating.end(target.attr('id'));
    });
}

function END_RATING() {
    $('#trialBox').hide();
    $('#questionsBox').show();
    rating.save();
}

var rating_options = {
    titles: RATING_TITLES,
    pracTrialN: RATING_PRACTICE_TRIAL_N,
    trialN: RATING_TRIAL_N,
    stimPath: STIM_PATH,
    dataFile: RATING_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: RATING_IMG_LIST,
    pracList: RATING_PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: RATING_UPDATE,
    trialFunc: RATING,
    endExptFunc: END_RATING,
    progressInfo: true
}