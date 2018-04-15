import unexpected from 'unexpected';
import dao from './rows';

const expect = unexpected.clone();

describe("rows dao", () => {

    it("loads rows from db", () => {
        const clientMock = {query: jest.fn()};
        clientMock.query.mockImplementation((q, p, cb) => cb(/*err*/null, {rows: [
            {id: 88, title: "row1"},
            {id: 88, title: "row1", colid: 1, name: "col1", value: "v1"},
            {id: 88, title: "row1", colid: 2, name: "col2", value: "v2"},
            {id: 89, title: "row2", colid: 1, name: "col1", value: "vv1"}
        ]}));
        return dao(clientMock, 111, null, null, 0, 10).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 1);
            expect(clientMock.query.mock.calls[0].slice(0, 2), 'to satisfy', [/select.*from rec.*limit.*c.*/, [111, 10]]);
            expect(res, 'to equal', [
                {id: 88, title: "row1", cols: [
                    {id: 1, name: "col1", value: "v1"},
                    {id: 2, name: "col2", value: "v2"}
                ]},
                {id: 89, title: "row2", cols: [
                    {id: 1, name: "col1", value: "vv1"}
                ]}
            ]);
        }); // (catch is handled by the framework)
    });

    it("loads rows from db handling error", () => {
        const clientMock = {query: jest.fn()};
        clientMock.query.mockImplementation((q, p, cb) => cb("test"));
        return expect(dao(clientMock, 111, null, null, 0, 10), 'to be rejected with', 'test');
    });

});