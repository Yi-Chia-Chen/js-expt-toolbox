// Yi-Chia Chen

function my_get_param(var_name, default_value) {
    const REGEX_STRING = "[\?&]" + var_name + "=([^&#]*)";
    const REGEX = new RegExp(REGEX_STRING);
    const URL = location.href;
    const RESULTS = REGEX.exec(URL);
    if (RESULTS == null) {
        return default_value;
    } else {
        return RESULTS[1];
    }
}

function my_list_to_formatted_string(data_list, divider) {
    divider = (divider === undefined) ? '\t' : divider;
    var string = '';
    for (var i = 0; i < data_list.length - 1; i++) {
        string += data_list[i] + divider;
    }
    string += data_list[data_list.length - 1] + '\n';
    return string;
}

function my_factorial_cond(factor_list) {

    function recursive_combine(now_factor, remain_factor_list) {
        all_conditions = my_repeat_elements_in_array(all_conditions, now_factor.length);
        for (var i = 0; i < all_conditions.length; i += now_factor.length) {
            for (var j = 0; j < now_factor.length; j++) {
                index = i + j;
                all_conditions[index].push(now_factor[j]);
            }
        }

        if (remain_factor_list.length !== 0) {
            now_factor = remain_factor_list.shift();
            recursive_combine(now_factor, remain_factor_list);
        }
    }

    var now_factor = factor_list.shift();
    var all_conditions = [];
    for (var i = 0; i < now_factor.length; i++) {
        all_conditions.push([now_factor[i]])
    }

    now_factor = factor_list.shift();
    recursive_combine(now_factor, factor_list);

    return all_conditions;
}

function my_post_data(page, data, success_func, error_callback) {
    data = (data === undefined) ? null : data;
    success_func = (success_func === undefined) ? function() { return; } : success_func;
    error_callback = (error_callback === undefined) ? function() { return; } : error_callback;
    $.ajax({
        type: "POST",
        url: page,
        data: data,
        success: success_func,
        error: error_callback
    });
}

function my_shuffle_array(array) {
    var j, temp;
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function my_sample_wo_replacement(list, sample_n) {
    sample_n = (sample_n === undefined) ? 1 : sample_n;
    var sample = [];
    var local_list = list.slice(0);
    for (var i = 0; i < sample_n; i++) {
        var random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list.splice(random_index, 1)[0]);
    }
    return {
        sample: sample,
        remainder: local_list
    };
}

function my_sample_w_replacement(list, sample_n) {
    sample_n = (sample_n === undefined) ? 1 : sample_n;
    var sample = [];
    var local_list = list.slice(0);
    for (var i = 0; i < sample_n; i++) {
        var random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list[random_index]);
    }
    return sample;
}

function my_rand_choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function my_range(start_num, end_num, interval) {
    start_num = (start_num === undefined) ? 0 : start_num;
    interval = (interval === undefined) ? 1 : interval;
    var list = [];
    for (var i = start_num; i < end_num; i += interval) {
        list.push(i);
    }
    return list;
}

// formatting date object into date string
function my_format_date(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? '.' : divider;
    padded = (padded === undefined) ? true : padded;
    if (time_zone == 'UTC') {
        var now_year = date_obj.getUTCFullYear();
        var now_month = date_obj.getUTCMonth() + 1;
        var now_date = date_obj.getUTCDate();
    } else {
        var now_year = date_obj.getFullYear();
        var now_month = date_obj.getMonth() + 1;
        var now_date = date_obj.getDate();
    }
    if (padded) {
        now_month = ('0' + now_month).slice(-2);
        now_date = ('0' + now_date).slice(-2);
    }
    var now_full_date = now_year + divider + now_month + divider + now_date;
    return now_full_date;
}

// formatting date object into 24-hour format time string
function my_format_time(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? ':' : divider;
    padded = (padded === undefined) ? true : padded;
    if (time_zone == 'UTC') {
        var now_hours = date_obj.getUTCHours();
        var now_minutes = date_obj.getUTCMinutes() + 1;
        var now_seconds = date_obj.getUTCSeconds();
    } else {
        var now_hours = date_obj.getHours();
        var now_minutes = date_obj.getMinutes() + 1;
        var now_seconds = date_obj.getSeconds();
    }
    if (padded) {
        now_hours = ('0' + now_hours).slice(-2);
        now_minutes = ('0' + now_minutes).slice(-2);
        now_seconds = ('0' + now_seconds).slice(-2);
    }
    var now_full_time = now_hours + divider + now_minutes + divider + now_seconds;
    return now_full_time;
}

// preloading images
function my_load_img(index, stim_path, img_list, after_func) {
    after_func = (after_func === undefined) ? function() { return; } : after_func;
    if (index >= img_list.length) {
        return;
    }
    var image = new Image();
    if (index < img_list.length - 1) {
        image.onload = function() {
            my_load_img(index + 1, stim_path, img_list, after_func);
        };
    } else {
        image.onload = after_func;
    }
    image.src = stim_path + img_list[index];
}

// preloading audio files
function my_load_sounds(index, stim_path, sound_list, after_func) {
    if (index >= sound_list.length) {
        return;
    }
    var sound = new Audio();

    sound.src = stim_path + sound_list[index];

    function check_state() {
        if (sound.readyState == 4) {
            clearInterval(check_loading);
            if (index < sound_list.length - 1) {
                my_load_sounds(index + 1, stim_path, sound_list, after_func);
            } else {
                after_func();
            }
        } else {
            var current_time = Date.now();
            var current_duration = (current_time - start_time) / 1000; // in second
            if (current_duration > 2) {
                clearInterval(check_loading);
                if (reload_num > 3) { // giving up
                    if (index < sound_list.length - 1) {
                        my_load_sounds(index + 1, stim_path, sound_list, after_func);
                    } else {
                        after_func();
                    }
                } else { // try reloading again
                    reload_num++;
                    sound.load();
                    check_loading = window.setInterval(check_state, 20); // update progress every intervalD ms
                }
            }
        }
    };

    var start_time = Date.now();
    var reload_num = 0;
    var check_loading = window.setInterval(check_state, 20); // update progress every intervalD ms
}

function my_to_radians(degrees) {
    return degrees * Math.PI / 180;
}

function my_polar_to_cartesian(r, theta) {
    return [r * Math.cos(my_to_radians(theta)), r * Math.sin(my_to_radians(theta))];
}

function my_repeat_elements_in_array(arr, repeat_n) {
    var new_arr = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < repeat_n; j++) {
            new_arr.push(Array.from(arr[i]));
        }
    }
    return new_arr;
}

function my_list_from_attribute_names(obj, string_list) {
    var list = []
    for (var i = 0; i < string_list.length; i++) {
        list.push(obj[string_list[i]]);
    }
    return list;
}