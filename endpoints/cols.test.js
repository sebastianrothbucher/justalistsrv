jest.mock('../dao/cols'); // first thing

import unexpected from 'unexpected';
import colsDaoMock from '../dao/cols';
import endpoint from './cols';

const expect = unexpected.clone();

describe("cols endpoint", () => {

    it("pulls cols from dao", () => {
        const clientStub = {client: true};
        const mockRes = [{id: 1}];
        const resp = {status: jest.fn(), send: jest.fn()};
        colsDaoMock.mockReturnValueOnce(Promise.resolve(mockRes));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(colsDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[mockRes]]);
        }); // (catch is handled by the framework)
    });

    it("pulls cols from dao handling error", () => {
        const clientStub = {client: true};
        const colsDaoMock = require('../dao/cols').default;
        const resp = {status: jest.fn(), send: jest.fn()};
        colsDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error retrieving cols"]]);
        }); // (catch is handled by the framework)
    });

})