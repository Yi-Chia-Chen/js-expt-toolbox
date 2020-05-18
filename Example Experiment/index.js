// Yi-Chia Chen


// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

const FORMAL = false;
const EXPERIMENT_NAME = 'Example';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = 'trial_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = FORMAL ? 'data/formal':'data/testing';

const BLOCK_N = 1;

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;

const INSTR_READING_TIME_MIN = 2;

// trial variables
const PRACTICE_LIST = ['prac.jpg'];
const PRACTICE_TRIAL_N = PRACTICE_LIST.length;
const REPEAT_TRIAL_N = 1;
const STIM_N = 2;
const STIM_PATH = 'Stimuli/';
const NAME_LIST = SHUFFLE_ARRAY(['101','188']);
const STIM_LIST = NAME_LIST.map(x => x+'.jpg');

var repeat_list = STIM_LIST.slice();
const TRIAL_LIST = CREATE_RANDOM_REPEAT_BEGINNING_LIST(STIM_LIST, REPEAT_TRIAL_N);
const TRIAL_N = TRIAL_LIST.length;
const INSTR_TRIAL_N = PRACTICE_TRIAL_N + TRIAL_N;

// AQ variables
const AQ_QUESTION_DICT = {
    1: 'Statement 1',
    2: 'Statement 2'
}
const AQ_LENGTH = Object.keys(AQ_QUESTION_DICT).length;

// duration variables (in seconds)
var INTERTRIAL_INTERVAL = 0.5;

// object variables
var instr, subj, trial;


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    subj.id = subj.getID('sonacode');
    subj.saveVisit();
    if (subj.phone) { // asking for subj.phone will detect phone
        $('#instrText').html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at experimenter@domain.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
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
                     'daily',
                     'typicality',
                     'aqResponses',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function INVALID_ID_FUNC() {
    $('#instrText').html("We can't identify a valid code from subject pool website. Please reopen the study from the subject pool website again. Thank you!");
    $('#nextButton').hide();
    $('#instrBox').show();
}

function HCAPTCHA_SUBMIT() {
    const HCAPTCHA_RESPONSE = hcaptcha.getResponse();
    function CAPTCHA_RESULTS(results) {
        if (results == 'passed') {
            $('#captchaBox').hide();
            instr = new instrObject(instr_options);
            instr.start();
            trial_options['subj'] = subj;
            trial = new trialObject(trial_options);
        } else {
            $('#captchaBox').hide();
            $('#instrText').html('Oops! An error has occurred. Please contact the experiment experimenter@domain.edu with the code "CAPTCHA_ERR". Sorry!');
            $('#nextButton').hide();
            $('#instrBox').show();
        }
    }
    function CAPTCHA_AJAX_FAILED() {
        $('#instrText').html('Oops! An error has occurred. Please contact the experiment experimenter@domain.edu with the code "CAPTCHA_AJAX_ERR". Sorry!');
        $('#nextButton').hide();
        $('#instrBox').show();
    }
    POST_DATA('hCaptcha_verification.php', { 'hCaptcha_token': HCAPTCHA_RESPONSE }, CAPTCHA_RESULTS, CAPTCHA_AJAX_FAILED);
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function SUBMIT_LIKERT_Q() {
    subj.daily = $('input[name=daily]:checked').val();
    subj.typicality = $('input[name=typicality]:checked').val();
    var all_responded = CHECK_IF_RESPONDED([], [subj.daily, subj.typicality]);
    if (all_responded) {
        $('#likertBox').hide();
        $('#aqBox').show();
        $(document).keyup(function(e) {
            if (e.which == 32) { // the 'space' key
                $(document).off('keyup');
                START_AQ();
            }
        });
    } else {
        $('#LikertWarning').text('Please answer all questions to complete the first part. Thank you!');
    }
}

function START_AQ() {
    $('#aqInstrText').hide();
    subj.aqResponses  = {};
    subj.aqNowQ = 1;
    $('#aqQ').text(AQ_QUESTION_DICT[1]);
    $('#aqContainer').show();
    AQ_RESPONSE();
}

function AQ_RESPONSE() {
    $('.aqButton').mouseup(function(event) {
        $('.aqButton').unbind('mouseup');
        subj.aqResponses[subj.aqNowQ] = event.target.id;
        if (subj.aqNowQ == AQ_LENGTH){
            $('#aqBox').hide();
            $('#questionsBox').show();
            subj.detectVisibilityEnd();
        } else {
            subj.aqNowQ += 1;
            $('#aqQ').text(AQ_QUESTION_DICT[subj.aqNowQ]);
            $('#aqProgress').text( Math.round(100 * subj.aqNowQ / (AQ_LENGTH+2)) );
            AQ_RESPONSE();
        }
    });
}

function SUBMIT_DEBRIEFING_Q() {
    subj.serious = $('input[name=serious]:checked').val();
    subj.problems = $('#problems').val();
    subj.gender = $('input[name=gender]:checked').val();
    subj.age = $('#age').val();
    var open_ended_list = [subj.problems, subj.age];
    var all_responded = CHECK_IF_RESPONDED(open_ended_list, [subj.daily, subj.typicality]);
    if (all_responded) {
        for (var i = 0; i < open_ended_list.length; i++) {
            open_ended_list[i] = open_ended_list[i].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.instrQAttemptN = instr.qAttemptN['onlyQ'];
        subj.instrReadingTimes = instr.readingTimes;
        subj.quickReadingPageN = subj.instrReadingTimes.filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.aqResponses = JSON.stringify(subj.aqResponses);
        subj.submitQ();
        $('#questionsBox').hide();
        $('#debriefingBox').show();
        $('html')[0].scrollIntoView();
    } else {
        $('#Qwarning').text('Please answer all questions to complete the experiment. Thank you!');
    }
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
instr_text[0] = "Welcome, fellow human!<br /><br />Do you sometimes notice what people consider as beautiful can be very different? This study is about that!<br /><br />We are a bunch of scientists fascinated by the human aesthetic experience, and we want to learn how people's taste differ.";
instr_text[1] = "Your contributions may help in making AI, analyzing art, and designing things around us in everyday life!<br /><br />And, most importantly, we hope this is fun for you, too!";
instr_text[2] = 'Please help us by reading the instructions in the next few pages carefully, and avoid using the refresh or back buttons.';
instr_text[3] = 'Now, please maximize your browser window.';
instr_text[4] = 'This study takes about 30 minutes, and there are 2 parts, with each taking about 15 minutes.';
instr_text[5] = "Here's what your job is in the first part: you will be shown " + INSTR_TRIAL_N + ' images, one at a time. Here is an example:';
instr_text[6] = 'We are interested in how <strong>visually pleasing</strong> you find each image to be.<br /><br />In other words, how good/beautiful do you think the image looks?';
instr_text[7] = 'Six options will be available below the images as six buttons (as in below). Just click one of the options based on your preference.';
instr_text[8] = 'You might sometimes find that you like an image because of its meaning or the subject it depicts (e.g. that it contains a cat, if you like cats) — but what we are really asking about is just how <strong>visually</strong> pleasing you think it is.<br /><br />(As a result, an image of a cat could nevertheless look dull to you even if you like cats.)<br /><br />';
instr_text[9] = 'Please try your best NOT to consider the meaning of the images, and just to evaluate how visually pleasing each one is.';
instr_text[10] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[11] = ''; // instruction question 1
instr_text[12] = "Great! You can press SPACE to start. Please focus after you start (Don't switch to other windows or tabs!)";

const INSTR_FUNC_DICT = {
    0: SHOW_TASTE_IMG,
    1: HIDE_INSTR_IMG,
    3: SHOW_MAXIMIZE_WINDOW,
    4: HIDE_INSTR_IMG,
    5: SHOW_EXAMPLE_IMG,
    6: HIDE_INSTR_IMG,
    7: SHOW_RATING_BUTTONS,
    8: HIDE_RATING_BUTTONS,
    11: SHOW_INSTR_QUESTION,
    12: SHOW_CONSENT
};

function SHOW_INSTR_IMG(file_name) {
    $('#instrImg').attr('src', STIM_PATH + file_name);
    $('#instrImg').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instrImg').css('display', 'none');
}

function SHOW_TASTE_IMG() {
    SHOW_INSTR_IMG('instr_taste.jpg');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_EXAMPLE_IMG() {
    SHOW_INSTR_IMG('prac.jpg');
}

function SHOW_RATING_BUTTONS() {
    $('#ratingExample').show();
}

function HIDE_RATING_BUTTONS() {
    $('#ratingExample').hide();
}

function SHOW_INSTR_QUESTION() {
    $('#instrBox').hide();
    $('#instrQBox').show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $('input[name="instrQ"]:checked').val();
    if (typeof instrChoice === 'undefined') {
        $('#instrQWarning').text('Please answer the question. Thank you!');
    } else if (instrChoice != 'aesthetics') {
        instr.qAttemptN['onlyQ'] += 1;
        $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        $('#instrQBox').hide();
        $('input[name="instrQ"]:checked').prop('checked', false);
        instr.index = -1;
    } else {
        instr.next();
        $('#instrQBox').hide();
        $('#instrBox').show();
    }
}

function SHOW_CONSENT() {
    $('#nextButton').hide();
    $('#consentBox').show();
    $('#instrBox').attr('id', 'instrBoxScroll');
    $('#instrBoxScroll').show();
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off('keyup');
            $('#instrBoxScroll').attr('id', 'instrBox');
            $('#instrBox').hide();
            $('#consentBox').hide();
            subj.saveAttrition();
            SHOW_BLOCK();
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

const TRIAL_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'trialNum',
    'stimName',
    'inView',
    'response',
    'rt'];

function SHOW_BLOCK() {
    $('#instrBox').hide();
    $('#trialBox').show();
    subj.detectVisibilityStart();
    trial.run();
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    trial.stimName = this_trial;
    $('#progress').text(trial.progress);
    $('#testImg').attr('src', path + this_trial);
    if (!last) {
        $('#bufferImg').attr('src', path + next_trial);
    }
}

function TRIAL() {
    $('#testImg').show();
    $('.aesButton').mouseup(function(event) {
        $('.aesButton').unbind('mouseup');
        trial.inView = CHECK_FULLY_IN_VIEW($('#testImg'));
        $('#testImg').hide();
        trial.end(event.target.id);
    });
}

function END_EXPT() {
    $('#trialBox').hide();
    $('#likertBox').show();
    trial.save();
}

function END_TO_SONA() {
    const COMPLETION_URL = /*automatically generated url XXX */ + subj.id;
    window.location.href = COMPLETION_URL;
}

var trial_options = {
    subj: 'pre-define', // assign after subj is created
    pracTrialN: PRACTICE_TRIAL_N,
    trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: TRIAL_LIST,
    pracList: PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_EXPT,
    progressInfo: true
}
