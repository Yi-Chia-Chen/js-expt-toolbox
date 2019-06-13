// by Yi-Chia Chen
// required myFunc.js by Yi-Chia Chen
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
            no: 'pre-post',
            subjNoScript: 'mySubjNo.php',
            subjNoFile: '',
            condition: '',
            titles: [''],
            mturk: true,
            idFunc: false,
            invalidIDFunc: false,
            viewportMinW: 0,
            viewportMinH: 0,
            savingScript: 'mySave.php',
            attritionFile: 'attrition',
            subjFile: 'subj',
            savingDir: 'testing'
        }, options);

        if (this.no == 'pre-post') {
            this.obtainSubjNo(this.subjNoScript, this.subjNoFile);
        }
        this.data = my_list_to_formatted_string(this.titles);
        if (this.mturk) {
            this.id = this.obtainWorkerID();
        } else if (this.idFunc != false) {
            this.id = this.idFunc();
        }
        this.dateObj = new Date();
        this.date = my_format_date(this.dateObj, 'UTC', '-', true);
        this.startTime = my_format_time(this.dateObj, 'UTC', ':', true);
        this.userAgent = window.navigator.userAgent;
    }

    obtainWorkerID() {
        var workerID = my_get_param('workerId', 'getFailed');
        if (workerID == 'getFailed') {
            workerID = prompt("Please enter your worker ID:", "");
        }
        var invalidID = (workerID == null);
        if (!invalidID) {
            workerID = workerID.replace(/\s+/g, '');
            invalidID = (workerID == "");
        }
        if (invalidID) {
            this.invalidIDFunc();
            return null;
        } else {
            return workerID;
        }
    }

    obtainSubjNo(subjNoScript, subjNoFile) {
        var that = this;

        function subj_no_update_succeeded(number) {
            that.No = number;
        }

        function subj_no_update_failed() {
            that.No = -999;
        }

        my_post_data(subjNoScript, { 'fileName': subjNoFile }, subj_no_update_succeeded, subj_no_update_failed)

        // $.ajax({
        //         type: "POST",
        //         url: subjNoScript,
        //         data: { 'fileName': subjNoFile }
        //     })
        //     .done(function(data) {
        //         that.no = eval(data);
        //     })
        //     .fail(function() {
        //         that.no = -999;
        //     });
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
        var data = 'SubjNo.\tUTCStartDate\tUTCStartTime\tID\tUserAgent\n';
        var dataList = [this.no, this.date, this.startTime, this.id, this.userAgent];
        data += my_list_to_formatted_string(dataList);
        var postData = {
            'id': this.attritionFile, //filename to save the data with
            'experimenter': 'ycc', // experimenter folder to save it in
            'experimentName': this.savingDir, //directory to save it in
            'curData': data // data to save
        };
        $.ajax({
            type: "POST",
            url: this.savingScript,
            data: postData,
        });
    }

    submitQ() {
        var endTimeObj = new Date();
        this.endTime = my_format_time(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000; // in minutes
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        var dataList = my_list_from_attribute_names(this, this.titles);
        this.data += my_list_to_formatted_string(dataList);
        var postData = {
            'id': this.subjFile, //filename to save the data with
            'experimenter': 'ycc', // experimenter folder to save it in
            'experimentName': this.savingDir, //directory to save it in
            'curData': this.data // data to save
        };
        $.ajax({
            type: "POST",
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
            trialList: [],
            pracList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false
        }, options);
        this.no = this.subj.no;
        this.date = this.subj.date;
        this.startTime = this.subj.startTime;
        this.trialNo = -this.pracTrialN;
        this.allData = my_list_to_formatted_string(this.titles);
    }

    run() {
        this.trialNo++;
        var formal = this.trialNo > 0;
        if (formal) {
            var last = this.trialNo == this.trialN;
            this.thisTrial = this.trialList.pop();
        } else {
            var last = this.trialNo == 0;
            this.thisTrial = this.pracList.pop();
        }
        if (!last) {
            if (formal) {
                var nextTrial = this.trialList[this.trialList.length - 1];
            } else {
                var nextTrial = this.pracList[this.trialList.length - 1];
            }
        } else {
            var nextTrial = false;
        }
        this.updateFunc(formal, last, this.thisTrial, nextTrial, this.stimPath);

        var that = this;
        var startStim = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };

        setTimeout(startStim, this.intertrialInterval * 1000);
    }

    end(resp) {
        var currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000; // in second
        this.resp = resp;
        if (this.trialNo > 0) {
            var dataList = my_list_from_attribute_names(this, this.titles);
            this.allData += my_list_to_formatted_string(dataList);
        }
        if (this.trialNo < this.trialN) {
            this.run();
        } else {
            var postData = {
                'id': this.dataFile, //filename to save the data with
                'experimenter': 'ycc', // experimenter folder to save it in
                'experimentName': this.savingDir, //directory to save it in
                'curData': this.allData // data to save
            };
            $.ajax({
                type: "POST",
                url: 'http://scorsese.wjh.harvard.edu/turk/tools/save.php',
                data: postData,
            });
            this.endExptFunc();
        }
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
            startExptFunc: false
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
    }

    next() {
        this.index += 1;
        if (this.index < this.text.length) {
            $('#instrText').html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
        } else {
            this.startExptFunc();
        }
    }
}