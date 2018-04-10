import normalizeArray from './normalize-array';
import unexpected from 'unexpected';

const expect = unexpected.clone();

describe("normalize array", () => {

    it("copies arrays and leaves objects alone", () => {
        const input = [[{obj: 1}], {obj: 2}];
        const output = normalizeArray(input);
        expect(input, 'to equal', output);
        expect(input, 'not to be', output);
        expect(input[0], 'not to be', output[0]);
        expect(input[0][0], 'to be', output[0][0]);
        expect(input[1], 'to be', output[1]);
    });

});