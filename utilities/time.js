const TIME = {
    request_timeout: function(to_do, delay) {
        const START_TIME = Date.now();
        function loop() {
            const TIME_ELAPSED = Date.now() - START_TIME;
            if (TIME_ELAPSED >= delay) {
                to_do();
            } else {
                request_id = requestAnimationFrame(loop);
                TIME.register_cancel_function(function() {cancelAnimationFrame(request_id)});
            }
        }
        let request_id = requestAnimationFrame(loop);
        TIME.register_cancel_function(function() {cancelAnimationFrame(request_id)});
    },

    request_cancel: function() {
        // register automatically
    },

    register_cancel_function: function(func) {
        TIME.request_cancel = func;
    }
}
module.exports = TIME;