import unexpected from 'unexpected';
import dao, { insert } from './rows';

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

    // TODO: update test

});