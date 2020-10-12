"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lift_1 = require("../../src/lift");
describe('Lift', () => {
    const makeARunWithElevator = (queues, capacity) => {
        const lift = new lift_1.Lift(queues, capacity);
        lift.start();
        return lift.history;
    };
    it('should simple go up', () => {
        chai_1.expect(makeARunWithElevator([
            [],
            [],
            [5, 5, 5],
            [],
            [],
            [],
            [],
        ], 5)).to.be.deep.equal([0, 2, 5, 0]);
    });
    it('should go up and then down', () => {
        chai_1.expect(makeARunWithElevator([
            [],
            [],
            [1, 1],
            [],
            [],
            [],
            [],
        ], 5)).to.be.deep.equal([0, 2, 1, 0]);
    });
    it('should go up and then up again', () => {
        chai_1.expect(makeARunWithElevator([
            [],
            [3],
            [4],
            [],
            [5],
            [],
            [],
        ], 5)).to.be.deep.equal([0, 1, 2, 3, 4, 5, 0]);
    });
    it('should go up fully loaded and respect capacity', () => {
        chai_1.expect(makeARunWithElevator([
            [4, 4, 4, 4, 4, 4],
            [],
            [],
            [],
            [],
            [],
            [],
        ], 5)).to.be.deep.equal([0, 4, 0, 4, 0]);
    });
    it('should go up and down, up and down', () => {
        chai_1.expect(makeARunWithElevator([
            [],
            [],
            [4, 4, 4, 4],
            [],
            [2, 2, 2, 2],
            [],
        ], 2)).to.be.deep.equal([0, 2, 4, 2, 4, 2, 0]);
    });
    it('should go up and down smartly', () => {
        chai_1.expect(makeARunWithElevator([
            [3, 3, 3, 3, 3, 3],
            [],
            [],
            [],
            [],
            [4, 4, 4, 4, 4, 4],
            [] //6
        ], 5)).to.be.deep.equal([0, 3, 5, 4, 0, 3, 5, 4, 0]);
    });
});
