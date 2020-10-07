class Lift {
  queues: Array<Array<number>>
  capacity: number
  history: Array<number> = []
  isMainCourseUp: boolean = true
  isPassengersGoingUp: boolean = true
  peopleIn: Array<number> = []
  currentFloor: number = 0

  constructor(queues: Array<Array<number>>, capacity: number) {
    this.queues = queues
    this.capacity = capacity
  }

  public start() {
    while (this.queues.some(queue => queue.length > 0) || this.peopleIn.length > 0) {
      this.history.push(this.currentFloor)

      this.getOffPeople()
      this.getPeopleIn()

      if (this.shouldChangeMainCourse()) this.changeMainCourse()

      this.setNextStop()
    }
  }

  private getPeopleIn() {
    const passengers = this.queues[this.currentFloor].filter(x => this.isMainCourseUp ? x > this.currentFloor : x < this.currentFloor)
    const peopleWhoCanGetInCount = this.getFreeSpace() > passengers.length ? passengers.length : this.getFreeSpace()

    for (let i = 0; i < peopleWhoCanGetInCount; i++) {
      this.peopleIn.push(passengers[i])
    }
  }

  private getOffPeople() {
    this.peopleIn = this.peopleIn.filter(x => x !== this.currentFloor)
  }

  private shouldChangeMainCourse(): boolean {
    return false
  }

  private changeMainCourse() {
  }

  private setNextStop() {
  }

  private getFreeSpace(): number {
    return this.capacity - this.peopleIn.length
  }
}