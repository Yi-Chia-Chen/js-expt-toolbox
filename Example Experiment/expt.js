// by Yi-Chia Chen
// required func.js by Yi-Chia Chen
// required mobile-detect.js by Heinrich Goebl


//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

class subjObject {
    constructor(options = {}) {
        Object.assign(this, {
            num: 'pre-post',
            subjNumScript: 'subjNum.php',
            subjNumFile: '',
            condition: false,
            conditionList: [''],
            titles: [''],
            mturk: true,
            prolific: false,
            idFunc: false,
            invalidIDFunc: false,
            viewportMinW: 0,
            viewportMinH: 0,
            savingScript: 'save.php',
            attritionFile: 'attrition',
            subjFile: 'subj',
            savingDir: 'testing'
        }, options);
        if (this.num == 'pre-post') {
            this.obtainSubjNum(this.subjNumScript, this.subjNumFile);
        }
        this.data = LIST_TO_FORMATTED_STRING(this.titles);
        this.dateObj = new Date();
        this.date = FORMAT_DATE(this.dateObj, 'UTC', '-', true);
        this.startTime = FORMAT_TIME(this.dateObj, 'UTC', ':', true);
        this.userAgent = window.navigator.userAgent;
    }

    obtainSubjNum(subjNumScript, subjNumFile) {
        var that = this;
        function SUBJ_NUM_UPDATE_SUCCEEDED(number) {
            that.num = number;
            if (that.condition == 'auto') {
                that.assignCondition();
            }
        }
        function SUBJ_NUM_UPDATE_FAILED() {
            that.num = -999;
        }
        POST_DATA(subjNumScript, { 'fileName': subjNumFile }, SUBJ_NUM_UPDATE_SUCCEEDED, SUBJ_NUM_UPDATE_FAILED);
    }

    assignCondition() {
        var that = this;
        const CHECK_SUBJ_NUM = function(){
            if(that.num != 'pre-post'){
                clearInterval(interval_id);
                that.condition = that.conditionList[(that.num-1) % that.conditionList.length];
                that.conditionAssigned = true;
            }
        };
        var interval_id = setInterval(CHECK_SUBJ_NUM, 10);
    }

    obtainID(){
        if (this.mturk) {
            this.id = this.obtainWorkerID();
        } else if(this.prolific){
            this.id = this.obtainProlificID();
        } else if (this.idFunc != false) {
            this.id = this.idFunc();
        }
    }

    obtainWorkerID() {
        var workerID = GET_PARAMETERS('workerId', 'getFailed');
        if (workerID == 'getFailed') {
            workerID = prompt('Please enter your worker ID:', '');
        }
        var invalidID = (workerID == null);
        if (!invalidID) {
            workerID = workerID.replace(/\s+/g, '');
            invalidID = (workerID == '');
        }
        if (invalidID) {
            this.invalidIDFunc();
            return null;
        } else {
            return workerID;
        }
    }

    obtainProlificID() {
        var prolificID = GET_PARAMETERS('PROLIFIC_PID', 'getFailed');
        if (prolificID == 'getFailed') {
            prolificID = prompt('Please enter your Prolific ID:', '');
        }
        var invalidID = (prolificID == null);
        if (!invalidID) {
            prolificID = prolificID.replace(/\s+/g, '');
            invalidID = (prolificID == '');
        }
        if (invalidID) {
            this.invalidIDFunc();
            return null;
        } else {
            return prolificID;
        }
    }

    get phone() { // getter runs when you ask for the property
        var md = new MobileDetect(this.userAgent);
        return md.mobile() ? true : false;
    }

    get viewportSize() {
        var w = $(window).width();
        var h = $(window).height();
        var inView = (w >= this.viewportMinW) && (h >= this.viewportMinH);
        return { 'h': h, 'w': w, 'inView': inView };
    }

    saveAttrition() {
        var data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'id': this.attritionFile, //filename to save the data with
            'experimenter': 'ycc', // experimenter folder to save it in
            'experimentName': this.savingDir, //directory to save it in
            'curData': data // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    submitQ() {
        var endTimeObj = new Date();
        this.endTime = FORMAT_TIME(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000; // in minutes
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'id': this.subjFile, //filename to save the data with
            'experimenter': 'ycc', // experimenter folder to save it in
            'experimentName': this.savingDir, //directory to save it in
            'curData': this.data // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

class trialObject {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            pracTrialN: 0,
            trialN: 0,
            titles: '',
            stimPath: 'Stimuli/',
            dataFile: '',
            savingScript: 'mySave.php',
            savingDir: 'testing',
            trialList: [],
            pracList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false,
            progressInfo: false
        }, options);
        this.num = this.subj.num;
        this.date = this.subj.date;
        this.subjStartTime = this.subj.startTime;
        this.blockNum = 0;
        this.trialNum = -this.pracTrialN;
        this.allData = LIST_TO_FORMATTED_STRING(this.titles);
        this.complete = false;
    }

    run() {
        if (this.progressInfo) {
            this.progress = Math.round( 100 * (this.trialNum+this.pracTrialN) / (this.trialN+this.pracTrialN) );
        }
        this.trialNum++;
        var formal = this.trialNum > 0;
        if (formal) {
            var last = this.trialNum == this.trialN;
            this.thisTrial = this.trialList.pop();
        } else {
            var last = this.trialNum == 0;
            this.thisTrial = this.pracList.pop();
        }
        if (!last) {
            if (formal) {
                var nextTrial = this.trialList[this.trialList.length - 1];
            } else {
                var nextTrial = this.pracList[this.pracList.length - 1];
            }
        } else {
            var nextTrial = false;
        }
        this.updateFunc(formal, last, this.thisTrial, nextTrial, this.stimPath);

        var that = this;
        const START_STIM = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };

        setTimeout(START_STIM, this.intertrialInterval * 1000);
    }

    end(resp) {
        var currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000; // in second
        this.response = resp;
        if (this.trialNum > 0) {
            var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
            this.allData += LIST_TO_FORMATTED_STRING(dataList);
        }
        if (this.trialNum < this.trialN) {
            this.run();
        } else {
            this.complete = true;
            this.endExptFunc();
        }
    }

    save() {
        var postData = {
            'id': this.dataFile, //filename to save the data with
            'experimenter': 'ycc', // experimenter folder to save it in
            'experimentName': this.savingDir, //directory to save it in
            'curData': this.allData // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}


// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            funcDict: {},
            qConditions: [],
            startExptFunc: false
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
        this.qAttemptN = {};
        for (var i=0;i<this.qConditions.length;i++){
            this.qAttemptN[this.qConditions[i]] = 1;
        }
    }

    next(textElement = $('#instrText')) {
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
        } else {
            this.startExptFunc();
        }
    }
}