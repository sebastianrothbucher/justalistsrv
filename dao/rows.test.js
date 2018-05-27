import unexpected from 'unexpected';
import dao, { insert, update } from './rows';

const expect = unexpected.clone();

describe("rows dao", () => {

    it("loads rows from db", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.resolve({
            rows: [
                { id: 88, title: "row1" },
                { id: 88, title: "row1", colid: 1, name: "col1", value: "v1" },
                { id: 88, title: "row1", colid: 2, name: "col2", value: "v2" },
                { id: 89, title: "row2", colid: 1, name: "col1", value: "vv1" }
            ]
        }));
        return dao(clientMock, 111, null, null, 0, 10).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 1);
            expect(clientMock.query.mock.calls[0], 'to satisfy', [/select.*from rec.*limit.*c.*/, [111, 10]]);
            expect(res, 'to satisfy', [
                { _id: 88, title: "row1", colvalues: { 1: "v1", 2: "v2" } },
                { _id: 89, title: "row2", colvalues: { 1: "vv1" } }
            ]);
        }); // (catch is handled by the framework)
    });

    it("loads rows from db handling error", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.reject("test"));
        return expect(dao(clientMock, 111, null, null, 0, 10), 'to be rejected with', /test/);
    });

    it("inserts new rows", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.resolve({
            rows: (q.indexOf("n.newcid::int") >= 0 ? [
                { newcid: 88 }
            ] : q.indexOf("n.newid::int") >= 0 ? [
                { newid: 99 }
            ] : null)
        }));
        return insert(clientMock, 111, { _id: 77, cid: 777, title: "testtitle", colvalues: { 1: "v1" } }).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 6);
            expect(clientMock.query.mock.calls[0][0], 'to be', 'begin');
            expect(clientMock.query.mock.calls[1][0], 'to satisfy', /select.*newcid.*seq_rec_cid.*/);
            expect(clientMock.query.mock.calls[2][0], 'to satisfy', /select.*newid.*seq_rec_id.*/);
            expect(clientMock.query.mock.calls[3], 'to satisfy', [/insert into rec .*/, [99, 111, 88, 1, "testtitle"]]);
            expect(clientMock.query.mock.calls[4], 'to satisfy', [/insert into reccol .*/, [99, 1, "v1"]]);
            expect(clientMock.query.mock.calls[5][0], 'to be', 'commit');
            expect(res, 'to satisfy', { ok: true, _id: 99, version: 1 });
        }); // (catch is handled by the framework)
    });

    it("inserts new rows handling error", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => (('begin' === q || 'rollback' === q) ? Promise.resolve() : Promise.reject("test")));
        return expect(insert(clientMock, 111, { _id: 77, cid: 777, title: "testtitle", colvalues: { 1: "v1" } }), 'to be rejected with', /test/);
    });

    it("updates existing rows", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.resolve({
            rows: (q.indexOf("n.newid::int") >= 0 ? [
                { newid: 99 }
            ] : q.indexOf("m.maxv::int") >= 0 ? [
                { maxv: 2 }
            ] : null), 
            rowCount: (q.indexOf("update rec set archived=TRUE") >= 0 ? 1 : null)
        }));
        return update(clientMock, 111, { _id: 77, cid: 777, version: 2, title: "testtitlee", colvalues: { 1: "v11" } }).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 6);
            expect(clientMock.query.mock.calls[0][0], 'to be', 'begin');
            expect(clientMock.query.mock.calls[1], 'to satisfy', [/update rec set archived=TRUE.*/, [777, 2]]);
            expect(clientMock.query.mock.calls[2][0], 'to satisfy', /select.*newid.*seq_rec_id.*/);
            expect(clientMock.query.mock.calls[3], 'to satisfy', [/insert into rec .*/, [99, 111, 777, 3, "testtitlee"]]);
            expect(clientMock.query.mock.calls[4], 'to satisfy', [/insert into reccol .*/, [99, 1, "v11"]]);
            expect(clientMock.query.mock.calls[5][0], 'to be', 'commit');
            expect(res, 'to satisfy', { ok: true, _id: 99, version: 3 });
        }); // (catch is handled by the framework)
    });

    it("updates existing rows ignoring version", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.resolve({
            rows: (q.indexOf("n.newid::int") >= 0 ? [
                { newid: 99 }
            ] : q.indexOf("m.maxv::int") >= 0 ? [
                { maxv: 33 }
            ] : null), 
            rowCount: (q.indexOf("update rec set archived=TRUE") >= 0 ? 1 : null)
        }));
        return update(clientMock, 111, { _id: 77, cid: 777, version: 2, title: "testtitlee", colvalues: { 1: "v11" } }, true).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 7);
            expect(clientMock.query.mock.calls[0][0], 'to be', 'begin');
            expect(clientMock.query.mock.calls[1], 'to satisfy', [/select m.maxv::int.*/, [777]]);
            expect(clientMock.query.mock.calls[2], 'to satisfy', [/update rec set archived=TRUE.*/, [777, 33]]);
            expect(clientMock.query.mock.calls[3][0], 'to satisfy', /select.*newid.*seq_rec_id.*/);
            expect(clientMock.query.mock.calls[4], 'to satisfy', [/insert into rec .*/, [99, 111, 777, 34, "testtitlee"]]);
            expect(clientMock.query.mock.calls[5], 'to satisfy', [/insert into reccol .*/, [99, 1, "v11"]]);
            expect(clientMock.query.mock.calls[6][0], 'to be', 'commit');
            expect(res, 'to satisfy', { ok: true, _id: 99, version: 34 });
        }); // (catch is handled by the framework)
    });

    it("updates existing rows detecting mismatching version", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => Promise.resolve({
            rows: (q.indexOf("n.newid::int") >= 0 ? [
                { newid: 99 }
            ] : null), 
            rowCount: (q.indexOf("update rec set archived=TRUE") >= 0 ? 0 : null)
        }));
        return expect(update(clientMock, 111, { _id: 77, cid: 777, version: 2, title: "testtitlee", colvalues: { 1: "v11" } }), 'to be rejected with', { extmsg: /.*no longer active.*/ });
    });

    it("updates existing rows handling error", () => {
        const clientMock = { query: jest.fn() };
        clientMock.query.mockImplementation((q, p) => (('begin' === q || 'rollback' === q) ? Promise.resolve() : Promise.reject("test")));
        return expect(update(clientMock, 111, { _id: 77, cid: 777, version: 2, title: "testtitle", colvalues: { 1: "v1" } }), 'to be rejected with', /test/);
    });

});