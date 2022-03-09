const FORMAT = {

    capitalize: function(s) {
        if (typeof s !== 'string'){
            return '';
        } else {
            return s.charAt(0).toUpperCase() + s.slice(1);
        }
    },

    list_to_formatted_string: function(data_list, divider) {
        divider = (divider === undefined) ? '\t' : divider;
        let string = '';
        let last = data_list.pop();
        for (let d of data_list) {
            string += d + divider;
        }
        string += last + '\n';
        return string;
    },

    two_d_array_to_string: function(input_array) {
        let arr = Array.from(input_array);
        for (let i=0; i<arr.length; i++){
            arr[i] = '[' + arr[i].toString() + ']';
        }
        return '[' + arr.toString() + ']';
    },

    three_d_array_to_string: function(input_array) {
        let arr = Array.from(input_array);
        for (let i=0; i<arr.length; i++) {
            if (Array.isArray(arr[i])) {
                for (let j=0; j<arr[i].length; j++) {
                    arr[i][j] = '[' + arr[i][j].toString() + ']';
                }
            } else {
                arr[i] = arr[i].toString();
            }
        }
        return '[' + arr.toString() + ']';
    },

    format_date: function(date_obj, time_zone, divider, padded) {
        date_obj = (date_obj === undefined) ? new Date() : date_obj;
        time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
        divider = (divider === undefined) ? '.' : divider;
        padded = (padded === undefined) ? true : padded;
        const NOW_YEAR = (time_zone == 'UTC') ? date_obj.getUTCFullYear() : date_obj.getFullYear();
        let now_month = (time_zone == 'UTC') ? date_obj.getUTCMonth()+1 : date_obj.getMonth()+1;
        let now_date = (time_zone == 'UTC') ? date_obj.getUTCDate() : date_obj.getDate();
        if (padded) {
            now_month = ('0' + now_month).slice(-2);
            now_date = ('0' + now_date).slice(-2);
        }
        return NOW_YEAR + divider + now_month + divider + now_date;
    },

    format_time: function(date_obj, time_zone, divider, padded) {
        date_obj = (date_obj === undefined) ? new Date() : date_obj;
        time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
        divider = (divider === undefined) ? ':' : divider;
        padded = (padded === undefined) ? true : padded;
        let now_hours = (time_zone == 'UTC') ? date_obj.getUTCHours() : date_obj.getHours();
        let now_minutes = (time_zone == 'UTC') ? date_obj.getUTCMinutes() : date_obj.getMinutes();
        let now_seconds = (time_zone == 'UTC') ? date_obj.getUTCSeconds() : date_obj.getSeconds();
        if (padded) {
            now_hours = ('0' + now_hours).slice(-2);
            now_minutes = ('0' + now_minutes).slice(-2);
            now_seconds = ('0' + now_seconds).slice(-2);
        }
        return now_hours + divider + now_minutes + divider + now_seconds;
    }

}

module.exports = FORMAT;