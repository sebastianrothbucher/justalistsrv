jest.mock('../dao/cols'); // first off

import unexpected from 'unexpected';
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
            expect(colsDaoMock.mock.calls, 'to have length', 1);
            expect([...colsDaoMock.mock.calls[0]], 'to equal', [clientStub, 88]); // use the best of jest and unexpected - although incompatible arrays SUCK; TODO: util or alternative
            expect(respSendMock.mock.calls, 'to have length', 1);
            expect([...respSendMock.mock.calls[0]], 'to equal', [mockRes]); // (ditto before)
        });
    });

    it("pulls cols from dao", () => {
        // TODO: next up
    });

})