import * as utils from "../src/utils";

describe('testing utils file', () => {
    test('calculate floor', () => {
        let floors:any = [1,2,3];
        expect(utils.calculateFloor(floors, 4, new Date().getTime().toString())).toBe(1);
    });
    test('calculate floor with one null', () => {
        let floors:any = [1,null,3];
        expect(utils.calculateFloor(floors, 4, new Date().getTime().toString())).toBe(4);
    });
    test('calculate floor with multiple null', () => {
        let floors:any = [null,null,3];
        expect(utils.calculateFloor(floors, 5, new Date().getTime().toString())).toBe(5);
    });
    test('calculate floor with only null', () => {
        let floors:any = [null,null,null];
        expect(utils.calculateFloor(floors, 6, new Date().getTime().toString())).toBe(6);
    });
    test('calculate floor with only null and an old timestamp', () => {
        let floors:any = [null,null,null];
        expect(utils.calculateFloor(floors, 6, "2000-01-01 00:00:00")).toBe(6);
    });
    test('percentage difference from 100 to 130', () => {
        expect(utils.percentageDifference(100,130)).toBe(30);
    });
    test('percentage difference from 130 to 100', () => {
        expect(utils.percentageDifference(130,100)).toBe(23.076923076923077);
    });
    test('percentage difference from 100 to 100', () => {
        expect(utils.percentageDifference(100,100)).toBe(0);
    });
    test('no wash trade', () => {
        expect(utils.washTradePrevention(100,101)).toBe(100);
    });
    test('no change in price', () => {
        expect(utils.washTradePrevention(100,100)).toBe(100);
    });
    test('+2% price movement', () => {
        expect(utils.washTradePrevention(110,100)).toBe(102);
    });
    test('-2% price movement', () => {
        expect(utils.washTradePrevention(90,100)).toBe(98);
    });
    test('calculate price data OK', () => {
        expect(utils.calculatePriceData({eth: 20, sol: 10},100, 20, new Date().getTime().toString())).toStrictEqual({eth: 20, sol: 10});
    });
    test('calculate price data with null', () => {
        expect(utils.calculatePriceData({eth: 20, sol: null},100, 20, new Date().getTime().toString())).toStrictEqual({eth: 100, sol: 20});
    });
    test('calculate price data with only null', () => {
        expect(utils.calculatePriceData({eth: null, sol: null},100, 20, new Date().getTime().toString())).toStrictEqual({eth: 100, sol: 20});
    });
    test('calculate price data with old timestamp', () => {
        expect(utils.calculatePriceData({eth: 20, sol: 10},100, 20, "2000-01-01 00:00:00")).toStrictEqual({eth: 20, sol: 10});
    });
    test('calculate price data with old timestamp and null', () => {
        expect(utils.calculatePriceData({eth: 20, sol: null},100, 20, "2000-01-01 00:00:00")).toStrictEqual({eth: 100, sol: 20});
    });
});