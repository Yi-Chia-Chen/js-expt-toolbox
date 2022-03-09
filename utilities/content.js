const CONTENT = {

    append_list_of_img: function(img_path_list, img_box) {
        let img;
        for (let p of img_path_list) {
            img = $(document.createElement('img'));
            img.attr('src', p);
            img.appendTo(img_box);
        }
    },

    list_from_attribute_names: function(obj, string_list) {
        let list = []
        for (let s of string_list) {
            list.push(obj[s]);
        }
        return list;
    },

    check_if_responded: function(open_ended_list, choice_list) {
        let all_responded = true;
        for (let i of open_ended_list) {
            all_responded = all_responded && (i.replace(/(?:\r\n|\r|\n|\s)/g, '') != '');
        }
        for (let j of choice_list) {
            all_responded = all_responded && (typeof j !== 'undefined');
        }
        return all_responded;
    },

    check_fully_in_view: function(el) {
        el = el.get(0);
        const RECT = el.getBoundingClientRect();
        const TOP = RECT.top;
        const BOTTOM = RECT.bottom;
        const LEFT = RECT.left;
        const RIGHT = RECT.right;

        const W = $(window).width();
        const H = $(window).height();
        return (TOP >= 0) && (BOTTOM <= H) && (LEFT >= 0) && (RIGHT <= W);
    },

    maximize_window: function() {
        let el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else {
            el.msRequestFullscreen();
        }
    },

    exit_maximize_window: function() {
        let el = document;
        if (el.exitFullscreen) {
            el.exitFullscreen();
        } else if (el.mozCancelFullScreen) {
            el.mozCancelFullScreen();
        } else if (el.webkitExitFullscreen) {
            el.webkitExitFullscreen();
        } else {
            el.msExitFullscreen();
        }
    }
}
module.exports = CONTENT;