jest.mock('../dao/rows'); // first thing

import unexpected from 'unexpected';
import rowsDaoMock from '../dao/rows';
import endpoint from './rows';

const expect = unexpected.clone();

describe("rows endpoint", () => {

    beforeEach(() => {
        rowsDaoMock.mockClear();
    });

    it("pulls rows from dao", () => {
        const clientStub = {client: true};
        const mockRes = [{id: 1}];
        const resp = {status: jest.fn(), send: jest.fn()};
        rowsDaoMock.mockReturnValueOnce(Promise.resolve(mockRes));
        return endpoint(null, clientStub, {params: {wsId: 88}, query: {sortMode: "col", sortCol: "c1", skip: 20, limit: 30}}, resp).then(() => {
            expect(rowsDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88, "col", "c1", 20, 30]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[mockRes]]);
        }); // (catch is handled by the framework)
    });

    it("pulls rows from dao using defaults", () => {
        const clientStub = {client: true};
        const mockRes = [{id: 1}];
        const resp = {status: jest.fn(), send: jest.fn()};
        rowsDaoMock.mockReturnValueOnce(Promise.resolve(mockRes));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(rowsDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88, null, null, 0, 100]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[mockRes]]);
        }); // (catch is handled by the framework)
    });

    it("pulls rows from dao handling error", () => {
        const clientStub = {client: true};
        const rowsDaoMock = require('../dao/rows').default;
        const resp = {status: jest.fn(), send: jest.fn()};
        rowsDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error retrieving rows"]]);
        }); // (catch is handled by the framework)
    });

    // TODO: insert & update test

})