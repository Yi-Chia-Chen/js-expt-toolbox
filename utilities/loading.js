const LOADING = {

    add_prefix_to_list_of_string: function(strings, prefix) {
        let output_list = [];
        for (let s of strings) {
            output_list.push(prefix+s);
        }
        return output_list;
    },

    load_img: function(index, stim_path, img_list, after_func) {
        after_func = (after_func === undefined) ? function() { return; } : after_func;
        if (index >= img_list.length) {
            return;
        }
        const IMAGE = new Image();
        if (index < img_list.length - 1) {
            IMAGE.onload = function() {
                LOADING.load_img(index + 1, stim_path, img_list, after_func);
            };
        } else {
            IMAGE.onload = after_func;
        }
        IMAGE.src = stim_path + img_list[index];
    },

    load_sounds: function(index, stim_path, sound_list, after_func) {
        if (index >= sound_list.length) {
            return;
        }
        const SOUND = new Audio();
        SOUND.src = stim_path + sound_list[index];

        function check_state() {
            if (SOUND.readyState == 4) {
                clearInterval(check_loading);
                if (index < sound_list.length - 1) {
                    LOADING.load_sounds(index + 1, stim_path, sound_list, after_func);
                } else {
                    after_func();
                }
            } else {
                let current_time = Date.now();
                let current_duration = (current_time - START_TIME) / 1000; // in second
                if (current_duration > 2) {
                    clearInterval(check_loading);
                    if (reload_num > 3) { // giving up
                        if (index < sound_list.length - 1) {
                            LOADING.load_sounds(index + 1, stim_path, sound_list, after_func);
                        } else {
                            after_func();
                        }
                    } else { // try reloading again
                        reload_num++;
                        SOUND.load();
                        check_loading = window.setInterval(check_state, 20); // update progress every intervalD ms
                    }
                }
            }
        }

        const START_TIME = Date.now();
        let reload_num = 0;
        let check_loading = window.setInterval(check_state, 20); // update progress every intervalD ms
    },

    buffer_video: function(buffer_element, filename, error_func, after_func) {
        error_func = (error_func === undefined) ? function() { return; } : error_func;
        after_func = (after_func === undefined) ? function() { return; } : after_func;
        let req = new XMLHttpRequest();
        req.open('GET', filename, true);
        req.responseType = 'blob';
        req.onload = function() {
            if (this.status === 200) {
                const VIDEO_BLOB = this.response;
                const VIDEO = URL.createObjectURL(VIDEO_BLOB);
                buffer_element.src = VIDEO;
                after_func();
            }
        };
        req.onerror = error_func;
        req.send();
    }
}
module.exports = REQUEST;