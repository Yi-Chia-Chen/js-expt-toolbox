const REQUEST = {

    get_parameters: function(var_name, default_value) {
        const REGEX_STRING = "[\?&]" + var_name + "=([^&#]*)";
        const REGEX = new RegExp(REGEX_STRING);
        const URL = location.href;
        const RESULTS = REGEX.exec(URL);
        if (RESULTS == null) {
            return default_value;
        } else {
            return RESULTS[1];
        }
    },

    post_data: function(page, data, success_func, error_callback) {
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
}
module.exports = REQUEST;
