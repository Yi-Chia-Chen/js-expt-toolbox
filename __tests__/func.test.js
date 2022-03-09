const FORMAT = require("../utilities/format");

describe("Formatting functions", () => {

    test("Capitalize a string and leave other characters untouched", () => {
        expect(FORMAT.capitalize('aBC')).toBe('ABC');
        expect(FORMAT.capitalize('1bc')).toBe('1bc');
        expect(FORMAT.capitalize('/bc')).toBe('/bc');
        expect(FORMAT.capitalize('Abc')).toBe('Abc');
        expect(FORMAT.capitalize('a')).toBe('A');
        expect(FORMAT.capitalize('')).toBe('');
        expect(FORMAT.capitalize(1)).toBe('');
    });

    test("Joining list element as a string divided by a specified divider", () => {
        expect(FORMAT.list_to_formatted_string([1,2,3],'')).toBe('123\n');
        expect(FORMAT.list_to_formatted_string([1,2,3],'a')).toBe('1a2a3\n');
        expect(FORMAT.list_to_formatted_string([[1,2],3,4],'a')).toBe('1,2a3a4\n');
        expect(FORMAT.list_to_formatted_string([{1:2,3:4},5,6],'a')).toBe('[object Object]a5a6\n');
        expect(FORMAT.list_to_formatted_string([1,2,3])).toBe('1\t2\t3\n');
        expect(() => {FORMAT.list_to_formatted_string('123','a')}).toThrow();
    });

// XXX the rest not done yet
});
