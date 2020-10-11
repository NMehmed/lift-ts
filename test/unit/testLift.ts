import { expect } from 'chai'
import { Lift } from '../../lift'

describe('Lift', () => {
  const makeARunWithElevator = (queues: Array<Array<number>>, capacity: number): Array<number> => {
    const lift = new Lift(queues, capacity)

    lift.start()

    return lift.history
  }

  it('should simple go up', () => {
    expect(makeARunWithElevator([
      [], // G
      [], // 1
      [5, 5, 5], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ], 5)).to.be.deep.equal([0, 2, 5, 0])
  })

  it('should go up and then down', () => {
    expect(makeARunWithElevator([
      [], // G
      [], // 1
      [1, 1], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ], 5)).to.be.deep.equal([0, 2, 1, 0])
  })

  it('should go up and then up again', () => {
    expect(makeARunWithElevator([
      [], // G
      [3], // 1
      [4], // 2
      [], // 3
      [5], // 4
      [], // 5
      [], // 6
    ], 5)).to.be.deep.equal([0, 1, 2, 3, 4, 5, 0])
  })

  it('should go up fully loaded', () => {
    expect(makeARunWithElevator([
      [4, 4, 4, 4, 4, 4], // G
      [], // 1
      [], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ], 5)).to.be.deep.equal([0, 4, 0, 4, 0])
  })
})