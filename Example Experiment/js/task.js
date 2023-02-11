class Task {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            pracTrialN: 0,
            trialN: 0,
            titles: '',
            savingScript: '',
            dataFile: '',
            stimPath: 'media/',
            savingDir: 'data/testing',
            pracList: [],
            trialList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false,
            restN: 0,
            progressInfo: false,
            restBoxElement: $('#rest-box'),
            restTextElement: $('#rest-text'),
            restCallback: () => void 0,
            restCallbackParameters: undefined
        }, options);
        this.blockNum = 0;
        this.trialNum = -this.pracTrialN;
        this.totalTrialN = this.pracTrialN + this.trialN;
        this.pracList = this.pracList.slice();
        this.trialList = this.trialList.slice();
        this.allData = array_to_formatted_string(this.titles.slice());
        this.complete = false;
        this.findRestTrialNum();
        this.getSubjectData();
    }

    findRestTrialNum() {
        if (this.restN == 0) {
            this.restTrialNum = [];
        } else {
            let trial_count_before_rest = Math.floor(this.totalTrialN / (this.restN+1));
            this.restTrialNum = range(1, this.restN+1).map(function(x) { return x*trial_count_before_rest; })
        }
    }

    getSubjectData() {
        this.subjNum = this.subj.num;
        this.subjStartDate = this.subj.date;
        this.subjStartTime = this.subj.startTime;
    }

    run() {
        let that = this;
        if (this.progressInfo) {
            this.updateProgress();
        }
        this.updateTrial();
        const start_stim = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };
        setTimeout(start_stim, this.intertrialInterval * 1000);
    }

    updateProgress() {
        this.progress = Math.round( 100 * (this.trialNum+this.pracTrialN) / (this.trialN+this.pracTrialN) );
    }

    updateTrial() {
        this.trialNum++;
        let formal = this.trialNum > 0;
        let last = formal ? this.trialNum == this.trialN : this.trialNum == 0;
        this.thisTrial = formal ? this.trialList.shift() : this.pracList.shift();
        let next_trial = this.findNextTrial(last, formal);
        this.updateFunc(formal, last, this.thisTrial, next_trial, this.stimPath);
    }

    findNextTrial(last, formal) {
        if (last){
            return false;
        } else {
            return formal ? this.trialList[0] : this.pracList[0];
        }
    }

    end(resp) {
        let currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000;
        this.response = resp;
        if (this.trialNum > 0) {
            let dataList = array_from_attribute_names(this, this.titles);
            this.allData += array_to_formatted_string(dataList);
        }

        if (this.restTrialNum.includes(this.trialNum)) {
            this.rest();
        } else if (this.trialNum < this.trialN) {
            this.run();
        } else {
            this.complete = true;
            this.endExptFunc();
        }
    }

    rest() {
        this.restTextElement.html('You are done with '+ this.progress + '% of the study!<br /><br />Take a short break now and hit space to continue whenever you are ready.')
        this.restBoxElement.show();
        $(document).keyup(function(e) {
            if (e.key == ' ') {
                $(document).off('keyup');
                this.restBoxElement.hide();
                if (typeof this.restCallbackParameters == 'undefined') {
                    this.restCallback();
                }
                else {
                    this.restCallback(this.restCallbackParameters);
                }
            }
        });
    }

    save() {
        let postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}