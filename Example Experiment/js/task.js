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
            progressInfo: false
        }, options);
        this.blockNum = 0;
        this.trialNum = -this.pracTrialN;
        this.pracList = this.pracList.slice();
        this.trialList = this.trialList.slice();
        this.allData = list_to_formatted_string(this.titles.slice());
        this.complete = false;
        this.getSubjectData();
    }

    getSubjectData() {
        this.num = this.subj.num;
        this.date = this.subj.date;
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
            return formal ? this.trialList[this.trialList.length - 1] : this.pracList[this.pracList.length - 1];
        }
    }

    end(resp) {
        let currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000;
        this.response = resp;
        if (this.trialNum > 0) {
            let dataList = list_from_attribute_names(this, this.titles);
            this.allData += list_to_formatted_string(dataList);
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
            if (e.key == ' ') {
                $(document).off('keyup');
                box_element.hide();
                if (typeof callback_parameters == 'undefined') {
                    callback();
                }
                else {
                    callback(callback_parameters);
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