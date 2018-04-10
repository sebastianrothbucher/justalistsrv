// for some strange reason the constructor of someMock.calls is not === the Array constructor and neither is the array of args which SUCKS; compensate this (easy enough)
const normalizeArray=(obj) => (Array.isArray(obj) ? [].concat(obj).map(c => normalizeArray(c)): obj);
export default normalizeArray;