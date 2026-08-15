import { unifyName, getFullLanguageName } from '../src/utilities';
import { describe, test, expect } from '@jest/globals';

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

describe('getFullLanguageName()', () => {
    test('liberica should return Java (BellSoft Liberica)', () => {
        expect(getFullLanguageName('liberica')).toBe('Java (BellSoft Liberica)');
    });

    test('xYz should throw error', () => {
        expect(() => getFullLanguageName('xYz')).toThrow('Language xYz was not found');
    });

    test('go should return Golang', () => {
        expect(getFullLanguageName('go')).toBe('Go');
    });
});