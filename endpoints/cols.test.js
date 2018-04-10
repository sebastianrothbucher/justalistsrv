jest.mock('../dao/cols'); // first off

import unexpected from 'unexpected';
import normalizeArray from '../util/normalize-array'
//import colsDaoMock from '../dao/cols'; // (also valid)
import endpoint from './cols';

const expect = unexpected.clone();

describe("cols endpoint", () => {

    it("pulls cols from dao", () => {
        const clientStub = {client: true};
        const colsDaoMock = require('../dao/cols').default;
        const mockRes = [{id: 1}];
        const respSendMock = jest.fn();
        //const endpoint = require('./cols').default; // (also valid)
        colsDaoMock.mockReturnValueOnce(Promise.resolve(mockRes));
        return endpoint(null, clientStub, {params: {wsId: 88}}, {send: respSendMock}).then(() => {
            expect(normalizeArray(colsDaoMock.mock.calls), 'to equal', [[clientStub, 88]]); // use the best of jest and unexpected - w/ a little help
            expect(normalizeArray(respSendMock.mock.calls), 'to equal', [[mockRes]]); // (ditto)
        });
    });

    it("pulls cols from dao", () => {
        // TODO: next up
    });

})