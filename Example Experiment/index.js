// Yi-Chia Chen


// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

const FORMAL = false; // XXX
const EXPERIMENT_NAME = 'aesAtt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME;
const TRIAL_FILE = 'trial_' + EXPERIMENT_NAME;
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME;
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME;
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = '';

const BLOCK_TYPES = ['photo','face'];
const CONDITIONS = ['photo_face','face_photo'];
const BLOCK_N = BLOCK_TYPES.length;

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;

// trial variables
const PHOTO_PRACTICE_LIST = SHUFFLE_ARRAY(['photo_prac1.jpg', 'photo_prac2.jpg']);
const FACE_PRACTICE_LIST = SHUFFLE_ARRAY(['face_prac1_CFD-WF-233-112-N.jpg', 'face_prac2_CFD-AM-218-085-N.jpg']);
const PRAC_TRIAL_LIST_DICT = {
    'photo':PHOTO_PRACTICE_LIST,
    'face':FACE_PRACTICE_LIST
};
const PRACTICE_TRIAL_N = PHOTO_PRACTICE_LIST.length; // 2
const REPEAT_TRIAL_N = 35;
const STIM_N = 2;
const STIM_PATH = 'Stimuli/';
const PHOTO_NAME_LIST = SHUFFLE_ARRAY(RANGE(101, 101 + STIM_N));
const PHOTO_LIST = PHOTO_NAME_LIST.map(x => x+'.jpg');
const FACE_LIST = [
    'face1.jpg',
    'face2.jpg'];
var repeat_photo_list = PHOTO_LIST.slice();
var repeat_face_list = FACE_LIST.slice();
repeat_photo_list = SHUFFLE_ARRAY(repeat_photo_list).splice(0, REPEAT_TRIAL_N);
repeat_face_list = SHUFFLE_ARRAY(repeat_face_list).splice(0, REPEAT_TRIAL_N);
const PHOTO_TRIAL_LIST = repeat_photo_list.concat(PHOTO_LIST); // trial list -- the trials are popped from the end of array so the repeats are in the beginning
const FACE_TRIAL_LIST = repeat_face_list.concat(FACE_LIST);
const TRIAL_LIST_DICT = {
    'photo':PHOTO_TRIAL_LIST,
    'face':FACE_TRIAL_LIST
};

const TRIAL_N = PHOTO_TRIAL_LIST.length;
const INSTR_TRIAL_N = PRACTICE_TRIAL_N + TRIAL_N;

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
    subj = new subjObject(subj_options); // obtain subject number
    subj.obtainID();
    subj.assignCondition();
    if (subj.id != null) {
        if (subj.phone) { // asking for subj.phone will detect phone
            $('#instrText').html('It seems that you are using a touchscreen device. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at clara.colombatto@yale.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
            $('#nextButton').hide();
            $('#instrBox').show();
        } else {
            instr = new instrObject(instr_options);
            var CHECK_EXPT_READY = function(){
                if(subj.conditionAssigned){
                    clearInterval(interval_id);
                    instr.condition = subj.condition.split('_');
                    instr.text = INSTR_TEXT_DICT[instr.condition[0]];
                    $('#instrText').html(instr.text[0]);
                    $('#instrBox').show();
                    subj.saveAttrition();
                    trial_options['subj'] = subj;
                    trial = new trialObject(trial_options);
                }
            };
            var interval_id = setInterval(CHECK_EXPT_READY, 10);
        }
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
                     'condition',
                     'instrQPhotoAttemptN',
                     'instrQFaceAttemptN',
                     'dailyPhoto',
                     'dailyFace',
                     'typicalityPhoto',
                     'typicalityFace',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function INVALID_ID_FUNC() {
    $('#instrText').html("We can't identify a valid Prolific ID. Please click <a href='.'><u>here</u></a> to try again. Thank you!");
    $('#nextButton').hide();
    $('#instrBox').show();
}

function SUBMIT_Q() {
    subj.dailyPhoto = $('input[name=dailyPhoto]:checked').val();
    subj.dailyFace = $('input[name=dailyFace]:checked').val();
    subj.typicalityPhoto = $('input[name=typicalityPhoto]:checked').val();
    subj.typicalityFace = $('input[name=typicalityFace]:checked').val();
    subj.serious = $('input[name=serious]:checked').val();
    subj.problems = $('#problems').val();
    subj.gender = $('input[name=gender]:checked').val();
    subj.age = $('#age').val();
    var open_ended_list = [subj.problems, subj.age];
    var all_responded = CHECK_IF_RESPONDED(open_ended_list, [subj.dailyPhoto, subj.dailyFace, subj.typicalityPhoto, subj.typicalityFace, subj.serious, subj.gender]);
    if (all_responded) {
        for (var i = 0; i < open_ended_list.length; i++) {
            open_ended_list[i] = open_ended_list[i].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.instrQPhotoAttemptN = instr.qAttemptN['photo'];
        subj.instrQFaceAttemptN = instr.qAttemptN['face'];
        subj.submitQ();
        $('#questionsBox').hide();
        $('#debriefingBox').show();
    } else {
        alert('Please answer all questions to complete the experiment. Thank you!');
    }
}

var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    condition: 'auto',
    conditionList: CONDITIONS,
    titles: SUBJ_TITLES,
    mturk: false,
    prolific: true,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR
};


// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

var instr_photo_first = new Array;
instr_photo_first[0] = 'Thank you for participating! Please read all the instructions carefully in the next few pages.<br /><br />Do not use the refresh or back buttons, as you may be locked out from completing the experiment.<br /><br />This experiment will take about 20 minutes to complete.';
instr_photo_first[1] = 'IMPORTANT: Please maximize the size of your browser window <b>NOW</b> to make sure the experiment works as expected.';
instr_photo_first[2] = 'We are interested in your aesthetic preferences. There are 2 parts in this experiment. Each part will take about 10 minutes.';
instr_photo_first[3] = 'In the first half of the experiment, you will be shown ' + INSTR_TRIAL_N + ' images, one at a time. We are interested in how <b>visually appealing</b> you find each image to be. <br /><br />In other words, how good/beautiful do you think the image looks?<br /><br />For each image, use the mouse to click on one of the options from 1 to 6 to rate how visually appealing you find that image to be -- where "6" indicates that you find it very visually appealing, and "1" indicates that you find it very not visually appealing.';
instr_photo_first[4] = 'You might sometimes find that you like an image because of its meaning or the subject it depicts (e.g. that it contains a cat, if you like cats) -- but what we are really asking about is just how <i><b>visually</b></i> appealing you think it is.<br /><br />(As a result, a image of a cat could nevertheless look dull to you even if you like cats.)<br /><br /><b>Please try your best NOT to consider the meaning of the images, and just to evaluate how visually appealing each one is.</b>';
instr_photo_first[5] = "Of course, this task might seem a bit odd since we're rarely asked to explicitly rate how visually appealing an image is, and it might be a bit awkward. Nonetheless you might find that you have a strong initial intuition about how appealing each image looks: and that's what we're after. So when making your responses, don't think about it too much: we're really just interested in your gut reaction.";
instr_photo_first[6] = 'On the next page, we will ask you a question about the instructions.';
instr_photo_first[7] = ''; // instruction question 1
instr_photo_first[8] = 'Great! You can press SPACE to start the first part. Please do not interrupt the task after you start (e.g. by switching to other windows or tabs on your computer)';

instr_photo_first[9] = 'Thank you! You have completed the first half of the experiment!'
instr_photo_first[10] = 'In the second half, you will view ' + INSTR_TRIAL_N + ' faces. ' + "We are interested in how <b>visually attractive</b> you find each person to be, based on just looking at their face. " + 'You will rate the face from 1 to 6 in the same way as the first half (i.e., "6" indicates that you find the face very visually attractive).<br /><br />'
instr_photo_first[11] = "You might sometimes find that you like a face because of its facial expression or the personality it seems to show (e.g. from looking at their face, you might think that the person is happy or has a warm personality) -- but what we are really asking about is just how <i><b>visually attractive</b></i> you think the face is.<br /><br />(As a result, a person that appears warm and happy could nevertheless look unattractive to you even if you like their current emotional state or personality.)<br /><br /><b>Please try your best NOT to consider other attributes of the faces, and just to evaluate how visually attractive you think the face is.</b>";
instr_photo_first[12] = "Of course, this task might seem a bit odd since we're rarely asked to explicitly rate how visually attractive people are, and it might be a bit awkward. Nonetheless you might find that you have a strong initial intuition about how attractive each face looks: and that's what we're after. So when making your responses, don't think about it too much: we're really just interested in your gut reaction.";
instr_photo_first[13] = 'On the next page, we will ask you a question about the instructions of the second half.';
instr_photo_first[14] = ''; // instruction question 2
instr_photo_first[15] = 'Great! Please press SPACE to start when ' + "you're ready.";

var instr_face_first = new Array;
instr_face_first[0] = instr_photo_first[0];
instr_face_first[1] = instr_photo_first[1];
instr_face_first[2] = instr_photo_first[2];
instr_face_first[3] = 'In the first half of the experiment, you will be shown ' + INSTR_TRIAL_N + " faces, one at a time. We are interested in how <b>visually attractive</b> you find each person to be, based on just looking at their face. <br /><br />In other words, how good-looking do you think the person's face is?<br /><br />" + 'For each face, use the mouse to click on one of the options from 1 to 6 to rate how visually attractive you find that face to be -- where "6" indicates that you find it very visually attractive, and "1" indicates that you find it very not visually attractive.';
instr_face_first[4] = "You might sometimes find that you like a face because of its facial expression or the personality it seems to show (e.g. from looking at their face, you might think that the person is happy or has a warm personality) -- but what we are really asking about is just how <i><b>visually attractive</b></i> you think the face is.<br /><br />(As a result, a person that appears warm and happy could nevertheless look unattractive to you even if you like their current emotional state or personality.)<br /><br /><b>Please try your best NOT to consider other attributes of the faces, and just to evaluate how visually attractive you think the face is.</b>";
instr_face_first[5] = "Of course, this task might seem a bit odd since we're rarely asked to explicitly rate how visually attractive people are, and it might be a bit awkward. Nonetheless you might find that you have a strong initial intuition about how attractive each face looks: and that's what we're after. So when making your responses, don't think about it too much: we're really just interested in your gut reaction.";
instr_face_first[6] = instr_photo_first[6]
instr_face_first[7] = instr_photo_first[7] // instruction question 1
instr_face_first[8] = instr_photo_first[8]

instr_face_first[9] = instr_photo_first[9]
instr_face_first[10] = 'In the second half, you will view ' + INSTR_TRIAL_N + ' non-face images. ' + "We are interested in how <b>visually appealing</b> you find each image to be." + 'You will rate the image from 1 to 6 in the same way as the first half (i.e., "6" indicates that you find the image very visually appealing).<br /><br />'
instr_face_first[11] = 'You might sometimes find that you like an image because of its meaning or the subject it depicts (e.g. that it contains a cat, if you like cats) -- but what we are really asking about is just how <i><b>visually</b></i> appealing you think it is.<br /><br />(As a result, a image of a cat could nevertheless look dull to you even if you like cats.)<br /><br /><b>Please try your best NOT to consider the meaning of the images, and just to evaluate how visually appealing each one is.</b>';
instr_face_first[12] = "Of course, this task might seem a bit odd since we're rarely asked to explicitly rate how visually appealing an image is, and it might be a bit awkward. Nonetheless you might find that you have a strong initial intuition about how appealing each image looks: and that's what we're after. So when making your responses, don't think about it too much: we're really just interested in your gut reaction.";
instr_face_first[13] = instr_photo_first[13];
instr_face_first[14] = instr_photo_first[14]; // instruction question 2
instr_face_first[15] = instr_photo_first[15];

const INSTR_Q_INDICES = [7,14];

const INSTR_TEXT_DICT = {
    'photo':instr_photo_first,
    'face':instr_face_first
};

function RETRIEVE_CURRENT_CONDITION(index) {
    if (index == INSTR_Q_INDICES[0]) { // first instruction question
        var now_condition_num = 1;
    }
    else { // second instruction question
        var now_condition_num = 2;
    }
    return instr.condition[now_condition_num-1].charAt(0).toUpperCase() + instr.condition[now_condition_num-1].slice(1)
}

function SHOW_INSTR_QUESTION() {
    $('#instrBox').hide();
    var now_question = RETRIEVE_CURRENT_CONDITION(instr.index);
    $('#instrQ'+now_question).show();
}

function SUBMIT_INSTR_Q() {
    var now_question = RETRIEVE_CURRENT_CONDITION(instr.index);
    var instrChoice = $('input[name=instrQ'+now_question+']:checked').val();

    if (typeof instrChoice === 'undefined') {
        alert('Please answer the question to start the experiment. Thank you!');
    } else if (instrChoice != 'you') {
        instr.qAttemptN[now_question.toLowerCase()] += 1;
        $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        $('#instrQ'+now_question).hide();
        $('input[name=instrQ'+now_question+']:checked').prop('checked', false);
        if (instr.index == INSTR_Q_INDICES[0]) { // first instruction question
            instr.index = 0; // skipping the first page of instructions if they are reading them the second time
        } else { // second instruction question
            instr.index = INSTR_Q_INDICES[0]+2;
        }
    } else {
        instr.next();
        $('#instrBox').show();
        $('#instrQ'+now_question).hide();
        $('input[name=instrQ'+now_question+']:checked').prop('checked', false);
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
            trial.firstCondition = instr.condition[0];
            SHOW_BLOCK(trial.firstCondition);
        }
    });
}

function READY_SECOND_BLOCK() {
    $('#nextButton').hide();
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off('keyup');
            $('#instrBox').hide();
            $('#consentBox').hide();
            SHOW_BLOCK(instr.condition[1]);
        }
    });
}



var instr_func_dict = {};
instr_func_dict[INSTR_Q_INDICES[0]] = SHOW_INSTR_QUESTION;
instr_func_dict[INSTR_Q_INDICES[0]+1] = SHOW_CONSENT;
instr_func_dict[INSTR_Q_INDICES[1]] = SHOW_INSTR_QUESTION;
instr_func_dict[instr_photo_first.length-1] = READY_SECOND_BLOCK;

var instr_options = {
    funcDict: instr_func_dict,
    qConditions: BLOCK_TYPES
};


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

function SHOW_BLOCK(condition) {
    if (condition == 'photo') {
        var now_label = 'appealing';
    }
    else {
        var now_label = 'attractive';
    }
    $('#r6label').html('Very visually <br />' + now_label);
    $('#r1label').html('Very not <br />visually ' + now_label);
    $('#instrBox').hide();
    $('#trialBox').show();
    trial.blockNum = trial.blockNum + 1;
    trial.condition = condition;
    trial.trialNum = -trial.pracTrialN;
    trial.trialList = TRIAL_LIST_DICT[condition];
    trial.pracList = PRAC_TRIAL_LIST_DICT[condition];
    trial.run();
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    trial.stimName = this_trial;
    $('#progress').text(trial.progress + '% completed');
    $('#testImg').attr('src', path + this_trial);
    if (!last) {
        $('#bufferImg').attr('src', path + next_trial);
    }
}

function TRIAL() {
    $('#testImg').show();
    $('.ratingButton').mouseup(function(event) {
        $('.ratingButton').unbind('mouseup');
        trial.inView = CHECK_FULLY_IN_VIEW($('#testImg'));
        $('#testImg').hide();
        trial.end(event.target.id);
    });
}

function END_BLOCK() {
    $('#trialBox').hide();
    $('#nextButton').show();
    if (trial.blockNum == BLOCK_N) {
        trial.save();
        $('#questionsBox').show();
    }
    else {
        instr.next();
        $('#instrBox').show();
    }
}

function END_TO_PROLIFIC() {
    window.location.href = 'https://app.prolific.co/submissions/complete?cc=4EECC2A1';
}

const TRIAL_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'firstCondition',
    'blockNum',
    'condition',
    'trialNum',
    'stimName',
    'inView',
    'response',
    'rt'];

var trial_options = {
    subj: 'pre-define', // assign after subj is created
    pracTrialN: PRACTICE_TRIAL_N,
    trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: false, // assign in each block
    pracList: false, // assign in each block
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_BLOCK,
    progressInfo: true
}
