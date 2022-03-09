const GEOMETRY = {

    distance_between_points: function(point_a, point_b){
        const X_DIFF = point_a[0] - point_b[0];
        const Y_DIFF = point_a[1] - point_b[1];
        return vector_length(X_DIFF, Y_DIFF);
    },

    vector_length: function(x_diff, y_diff) {
        return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
    },

    midpoint_of_two_points: function(point_1, point_2) {
        return [(point_1[0]+point_2[0])/2, (point_1[1]+point_2[1])/2];
    },

    slope_from_points: function(point_1, point_2) {
        const X_1 = point_1[0];
        const Y_1 = point_1[1];
        const X_2 = point_2[0];
        const Y_2 = point_2[1];
        return (Y_2 - Y_1)/(X_2 - X_1);
    },

    y_intercept_from_points: function(point_1, point_2) {
        const X_1 = point_1[0];
        const Y_1 = point_1[1];
        const X_2 = point_2[0];
        const Y_2 = point_2[1];
        return (X_2*Y_1 - X_1*Y_2)/(X_2 - X_1);
    },

    line_angle_to_x_axis: function(slope) {
        return GEOMETRY.to_degrees(Math.atan(slope)) % 360;
    },

    intersection_of_two_lines: function(slope_1, y_intercept_1, slope_2, y_intercept_2) {
        const INTERSECTION_X = (y_intercept_2-y_intercept_1) / (slope_1-slope_2);
        const INTERSECTION_Y = (slope_1*y_intercept_2 - slope_2*y_intercept_1) / (slope_1-slope_2);
        return [INTERSECTION_X, INTERSECTION_Y];
    },

    vertical_line_intersection_from_point_to_line: function(point_0, slope, y_intercept) {
        const X_0 = point_0[0];
        return [X_0, slope*X_0+y_intercept];
    },

    horizontal_line_intersection_from_point_to_line: function(point_0, slope, y_intercept) {
        const Y_0 = point_0[1];
        return [(Y_0-y_intercept)/slope, Y_0];
    },

    point_to_line_distance: function(point_0, slope, y_intercept) {
        const INTERSECTION_X_POINT = GEOMETRY.vertical_line_intersection_from_point_to_line(point_0, slope, y_intercept);
        const INTERSECTION_Y_POINT = GEOMETRY.horizontal_line_intersection_from_point_to_line(point_0, slope, y_intercept);
        const HYPOTENUSE = GEOMETRY.distance_between_points(INTERSECTION_X_POINT, INTERSECTION_Y_POINT);
        return INTERSECTION_X_POINT*INTERSECTION_Y_POINT/HYPOTENUSE;
    },

    perpendicular_line_of_a_line_passing_a_point: function(point_0, slope) {
        const PERPENDICULAR_SLOPE = -1/slope
        const Y_INTERCEPT = point_0[1] - PERPENDICULAR_SLOPE*point_0[0];
        return [PERPENDICULAR_SLOPE, Y_INTERCEPT];
    },

    foot_of_perpendicular: function(point_0, slope, y_intercept) {
        const PERPENDICULAR_LINE = GEOMETRY.perpendicular_line_of_a_line_passing_a_point(point_0, slope)
        return GEOMETRY.intersection_of_two_lines(slope, y_intercept, PERPENDICULAR_LINE[0], PERPENDICULAR_LINE[1]);
    },

    reflection_point_through_a_line: function(point_0, slope, y_intercept) {
        const FOOT = GEOMETRY.foot_of_perpendicular(point_0, slope, y_intercept);
        const FOOT_X = FOOT[0];
        const FOOT_Y = FOOT[1];
        const X_0 = point_0[0];
        const Y_0 = point_0[1];
        return [2*FOOT_X - X_0, 2*FOOT_Y - Y_0];
    },

    perpendicular_bisector: function(point_1, point_2) {
        const MIDPOINT = GEOMETRY.midpoint_of_two_points(point_1, point_2);
        const SLOPE = -1/GEOMETRY.slope_from_points(point_1, point_2);
        const Y_INTERCEPT = MIDPOINT[1] - SLOPE*MIDPOINT[0];
        return [SLOPE, Y_INTERCEPT];
    }
}
module.exports = GEOMETRY;