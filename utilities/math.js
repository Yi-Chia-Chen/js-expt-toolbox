const MATH = {

    to_radians: function(degrees) {
        return degrees * Math.PI / 180;
    },

    to_degrees: function(radians) {
        return radians * 180 / Math.PI % 360;
    },

    positive_mod: function(value, divider) {
        return ((value % divider) + divider) % divider;
    },

    polar_to_cartesian: function(r, theta) {
        return [r * Math.cos(MATH.to_radians(theta)), r * Math.sin(MATH.to_radians(theta))];
    }
}

module.exports = MATH;
