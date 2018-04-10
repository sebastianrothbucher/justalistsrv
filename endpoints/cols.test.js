jest.mock('../dao/cols'); // first thing

import unexpected from 'unexpected';
import normalizeArray from '../util/normalize-array';
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
            expect(normalizeArray(colsDaoMock.mock.calls), 'to equal', [[clientStub, 88]]); // use the best of jest and unexpected - w/ a little help
            expect(normalizeArray(resp.status.mock.calls), 'to equal', []);
            expect(normalizeArray(resp.send.mock.calls), 'to equal', [[mockRes]]);
        }); // (catch is handled by the framework)
    });

    it("pulls cols from dao", () => {
        const clientStub = {client: true};
        const colsDaoMock = require('../dao/cols').default;
        const resp = {status: jest.fn(), send: jest.fn()};
        colsDaoMock.mockReturnValueOnce(Promise.reject("test"));
        return endpoint(null, clientStub, {params: {wsId: 88}}, resp).then(() => {
            expect(normalizeArray(resp.status.mock.calls), 'to equal', [[500]]);
            expect(normalizeArray(resp.send.mock.calls), 'to equal', [["error retrieving cols"]]);
        }); // (catch is handled by the framework)
    });

})