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
            invalidIDFunc: false,
            validIDFunc: false,
            viewportMinW: 0,
            viewportMinH: 0,
            savingScript: 'save.php',
            attritionFile: 'attrition.txt',
            visitFile: 'visit.txt',
            subjFile: 'subj.txt',
            savingDir: 'data/testing',
            handleVisibilityChange: function(){},
        }, options);
        if (this.num == 'pre-post') {
            this.obtainSubjNum(this.subjNumScript, this.subjNumFile);
        }
        this.data = LIST_TO_FORMATTED_STRING(this.titles);
        this.dateObj = new Date();
        this.date = FORMAT_DATE(this.dateObj, 'UTC', '-', true);
        this.startTime = FORMAT_TIME(this.dateObj, 'UTC', ':', true);
        this.userAgent = window.navigator.userAgent;
        this.hiddenCount = 0;
        this.hiddenDurations = [];
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
        POST_DATA(subjNumScript, { 'directory_path': this.savingDir, 'file_name': this.subjNumFile }, SUBJ_NUM_UPDATE_SUCCEEDED, SUBJ_NUM_UPDATE_FAILED);
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

    saveVisit() {
        var data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.visitFile,
            'data': data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    getID(get_variable) {
        var id = GET_PARAMETERS(get_variable, null);
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            if (this.invalidIDFunc !== false) {
                this.invalidIDFunc();
            }
            return null;
        } else {
            if (this.validIDFunc !== false) {
                this.validIDFunc();
            }
            return id;
        }
    }

    checkID(id) {
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            return null;
        } else {
            return id;
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
            'directory_path': this.savingDir,
            'file_name': this.attritionFile,
            'data': data
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
            'directory_path': this.savingDir,
            'file_name': this.subjFile,
            'data': this.data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    detectVisibilityStart() {
        var that = this;
        document.addEventListener('visibilitychange', that.handleVisibilityChange);
    }

    detectVisibilityEnd() {
        var that = this;
        document.removeEventListener('visibilitychange', that.handleVisibilityChange);
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
            savingScript: 'save.php',
            savingDir: 'data/testing',
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
        const FORMAL = this.trialNum > 0;
        const LAST = FORMAL ? this.trialNum == this.trialN : this.trialNum == 0;
        this.thisTrial = FORMAL ? this.trialList.pop() : this.pracList.pop();

        var that = this;
        function findNextTrial(last, formal) {
            if (last){
                return false
            } else {
                return formal ? that.trialList[that.trialList.length - 1] : that.pracList[that.pracList.length - 1];
            }
        }
        const NEXT_TRIAL = findNextTrial(LAST, FORMAL);

        this.updateFunc(FORMAL, LAST, this.thisTrial, NEXT_TRIAL, this.stimPath);

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

    rest(box_element, text_element, callback, callback_parameters) {
        text_element.html('You are done with '+ this.progress + '% of the study!<br /><br />Take a short break now and hit space to continue whenever you are ready.')
        box_element.show();
        $(document).keyup(function(e) {
            if (e.which == 32) {
                $(document).off('keyup');
                box_element.hide();
                callback(callback_parameters);
            }
        });
    }

    save() {
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData // data to save
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
        this.readingTimes = [];
    }

    start(textBox = $('#instrBox'), textElement = $('#instrText')) {
        textElement.html(this.text[0]);
        if (this.instrKeys.includes(this.index)) {
            this.funcDict[this.index]();
        }
        textBox.show();
        this.startTime = Date.now();
    }

    next(textElement = $('#instrText')) {
        this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
            this.startTime = Date.now();
        } else {
            this.startExptFunc();
        }
    }
}