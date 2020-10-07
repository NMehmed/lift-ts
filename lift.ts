class Lift {
  queues: Array<number>
  capacity: number
  baseFloor: number
  history: Array<number>

  constructor(queues: Array<number>, capacity: number) {
    this.queues = queues
    this.capacity = capacity
    this.baseFloor = 0
    this.history = []
  }
}