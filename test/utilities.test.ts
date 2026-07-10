import { unifyName } from '../src/utilities';

describe('unifyName()', () => {
    test('golang should return go', () => {
        expect(unifyName('golang')).toBe('go');
    });

    test('java-temurin should return eclipse-temurin', () => {
        expect(unifyName('java-temurin')).toBe('eclipse-temurin');
    });

    test('python should return python', () => {
        expect(unifyName('python')).toBe('python');
    });

    test('xyz should throw error', () => {
        expect(() => unifyName('xyz')).toThrow('Unexpected language name: xyz');
    });
});