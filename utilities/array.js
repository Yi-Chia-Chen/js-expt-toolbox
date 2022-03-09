const ARRAY = {

    range: function(start_num, end_num, interval) {
        start_num = (start_num === undefined) ? 0 : start_num;
        interval = (interval === undefined) ? 1 : interval;
        let list = [];
        for (let i = start_num; i < end_num; i += interval) {
            list.push(i);
        }
        return list;
    },

    shuffle_array: function(input_array) {
        let j, temp;
        let arr = Array.from(input_array);
        for (let i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    },

    rand_choice: function(list) {
        return list[Math.floor(Math.random() * list.length)];
    },

    sample_wo_replacement: function(list, sample_n) {
        sample_n = (sample_n === undefined) ? 1 : sample_n;
        let sample = [];
        let local_list = list.slice(0);
        for (let i = 0; i < sample_n; i++) {
            let random_index = Math.floor(Math.random() * local_list.length);
            sample.push(local_list.splice(random_index, 1)[0]);
        }
        return {
            sample: sample,
            remainder: local_list
        };
    },

    sample_w_replacement: function(list, sample_n) {
        sample_n = (sample_n === undefined) ? 1 : sample_n;
        let sample = [];
        let local_list = list.slice(0);
        for (let i = 0; i < sample_n; i++) {
            let random_index = Math.floor(Math.random() * local_list.length);
            sample.push(local_list[random_index]);
        }
        return sample;
    },

    repeat_elements_in_array: function(arr, repeat_n) {
        let new_arr = [];

        for (let a of arr) {
            for (let j = 0; j < repeat_n; j++) {
                if (Array.isArray(a)) {
                    new_arr.push(a.slice());
                } else {
                    new_arr.push(a);
                }
            }
        }
        return new_arr;
    },

    concat_duplicated_array: function(arr, repeat_n) {
        let new_arr = [];
        for (let i = 0; i < repeat_n; i++) {
            new_arr = new_arr.concat(arr.slice());
        }
        return new_arr;
    },

    create_random_repeat_beginning_list: function(stim_list, repeat_trial_n) {
        const REPEAT_LIST = ARRAY.shuffle_array(stim_list.slice()).splice(0, repeat_trial_n);
        return REPEAT_LIST.concat(stim_list);
    },

    recursive_combine: function(current_factor, remain_factor_list, conditions) {
        conditions = ARRAY.repeat_elements_in_array(conditions.slice(), current_factor.length);
        for (let j = 0; j < conditions.length; j += current_factor.length) {
            for (let k = 0; k < current_factor.length; k++) {
                let index = j + k;
                conditions[index].push(current_factor[k]);
            }
        }
        if (remain_factor_list.length !== 0) {
            current_factor = remain_factor_list.shift();
            return ARRAY.recursive_combine(current_factor, remain_factor_list, conditions);
        } else {
            return conditions.slice();
        }
    },

    factorial_cond: function(factor_list) {
        let now_factor = factor_list.shift();
        let all_conditions = [];
        for (let f of now_factor) {
            all_conditions.push([f])
        }
        now_factor = factor_list.shift();
        all_conditions = ARRAY.recursive_combine(now_factor, factor_list, all_conditions);
        return all_conditions;
    }
}
module.exports = ARRAY;
