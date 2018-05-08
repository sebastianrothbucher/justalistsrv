jest.mock('../dao/rows'); // first thing

import unexpected from 'unexpected';
import rowsDaoMock, {insert as rowInsertDaoMock, update as rowUpdateDaoMock} from '../dao/rows';
import endpoint, {insert as insertEndpoint, update as updateEndpoint} from './rows';

const expect = unexpected.clone();

describe("rows endpoint", () => {

    beforeEach(() => {
        rowsDaoMock.mockClear();
        rowInsertDaoMock.mockClear();
        rowUpdateDaoMock.mockClear();
    });

    it("pulls rows from dao", () => {
        const clientStub = {client: true};
        const mockRes = [{_id: 1}];
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
        const mockRes = [{_id: 1}];
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
        const resp = {status: jest.fn(), send: jest.fn()};
        rowsDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error retrieving rows"]]);
        }); // (catch is handled by the framework)
    });

    it("inserts new records", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowInsertDaoMock.mockReturnValueOnce(Promise.resolve({ok: true}));
        return insertEndpoint(null, clientStub, {params: {wsId: 88}, body: {testrec: true}}, resp). then(() => {
            expect(rowInsertDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88, {testrec: true}, false]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[{ok: true}]]);
        }); // (catch is handled by the framework)
    });

    it("inserts new records handling error", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowInsertDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return insertEndpoint(null, clientStub, {params: {wsId: 88}, body: {testrec: true}}, resp). then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error writing row"]]);
        }); // (catch is handled by the framework)
    });

    it("inserts new records handling null", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowInsertDaoMock.mockReturnValueOnce(Promise.resolve({ok: true}));
        return insertEndpoint(null, clientStub, {params: {wsId: 88}, body: null}, resp). then(() => {
            expect(rowInsertDaoMock.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error writing row"]]);
        }); // (catch is handled by the framework)
    });

    it("updates new records", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowUpdateDaoMock.mockReturnValueOnce(Promise.resolve({ok: true}));
        return updateEndpoint(null, clientStub, {params: {wsId: 88, cid: 99}, body: {testrec: true}}, resp). then(() => {
            expect(rowUpdateDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88, {testrec: true, cid: 99}, false]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[{ok: true}]]);
        }); // (catch is handled by the framework)
    });

    it("updates new records ignoring version", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowUpdateDaoMock.mockReturnValueOnce(Promise.resolve({ok: true}));
        return updateEndpoint(null, clientStub, {params: {wsId: 88, cid: 99}, query: {ignoreVersion: "true"}, body: {testrec: true}}, resp). then(() => {
            expect(rowUpdateDaoMock.mock.calls, 'to exhaustively satisfy', [[clientStub, 88, {testrec: true, cid: 99}, true]]); // use the best of jest and unexpected - w/ a little help
            expect(resp.status.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [[{ok: true}]]);
        }); // (catch is handled by the framework)
    });

    it("updates new records handling error", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowUpdateDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return updateEndpoint(null, clientStub, {params: {wsId: 88, cid: 99}, body: {testrec: true}}, resp). then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error writing row"]]);
        }); // (catch is handled by the framework)
    });

    it("updates new records handling error with external message", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowUpdateDaoMock.mockReturnValueOnce(Promise.reject({extmsg: "test"}));
        return updateEndpoint(null, clientStub, {params: {wsId: 88, cid: 99}, body: {testrec: true}}, resp). then(() => {
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error writing row - test"]]);
        }); // (catch is handled by the framework)
    });

    it("updates new records handling null", () => {
        const clientStub = {client: true};
        const resp = {status: jest.fn(), send: jest.fn()};
        rowUpdateDaoMock.mockReturnValueOnce(Promise.resolve({ok: true}));
        return updateEndpoint(null, clientStub, {params: {wsId: 88, cid: 99}, body: null}, resp). then(() => {
            expect(rowUpdateDaoMock.mock.calls, 'to exhaustively satisfy', []);
            expect(resp.status.mock.calls, 'to exhaustively satisfy', [[500]]);
            expect(resp.send.mock.calls, 'to exhaustively satisfy', [["error writing row"]]);
        }); // (catch is handled by the framework)
    });

})