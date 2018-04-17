import unexpected from 'unexpected';
import dao from './cols';

const expect = unexpected.clone();

describe("cols dao", () => {

    it("loads cols from db", () => {
        const clientMock = {query: jest.fn()};
        clientMock.query.mockImplementation((q, p) => Promise.resolve({rows: [
            {id: 88, name: "col1"},
            {id: 88, name: "col1", value: "v1"},
            {id: 88, name: "col1", value: "v2", color: "c2"},
            {id: 89, name: "col2", value: "vv1", color: "cc1"}
        ]}));
        return dao(clientMock, 111).then(res => {
            expect(clientMock.query.mock.calls.length, 'to be', 1);
            expect(clientMock.query.mock.calls[0], 'to satisfy', [/select.*from col c.*/, [111]]);
            expect(res, 'to equal', [
                {id: 88, name: "col1", values: [
                    {value: "v1"},
                    {value: "v2", color: "c2"}
                ]},
                {id: 89, name: "col2", values: [
                    {value: "vv1", color: "cc1"}
                ]}
            ]);
        }); // (catch is handled by the framework)
    });

    it("loads cols from db handling error", () => {
        const clientMock = {query: jest.fn()};
        clientMock.query.mockImplementation((q, p) => Promise.reject("test"));
        return expect(dao(clientMock, 111), 'to be rejected with', 'test');
    });

});