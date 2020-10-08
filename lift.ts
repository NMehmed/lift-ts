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

      this.getPeopleOff()
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

  private getPeopleOff() {
    this.peopleIn = this.peopleIn.filter(x => x !== this.currentFloor)
  }

  private shouldChangeMainCourse(): boolean {
    return this.peopleIn.length === 0 && !this.checkWaitingPeopleToGetOn()
    // we should change course also after picking passenger on highest floor who wants to go down
    // and when we pick passenger on lowest floor who wants to go up
  }

  private changeMainCourse() {
    // go up and collect people who wants to go up
    // go up and collect people who wants to go down
    // go down and collect people who wants to go down
    // go down and collect people who wants to go up
  }

  private setNextStop() {
    // up and up check for people who wants to get off and get in to travel up
    // up and down check for passenger on highest floor take him
    // down and down check for people who wants to get off and get in to travel down
    // down and up check for passenger on lowest floor and take him
  }

  private getFreeSpace(): number {
    return this.capacity - this.peopleIn.length
  }

  private checkWaitingPeopleToGetOn(): boolean {
    let isThereSomeOneWaiting = false

    if (this.isMainCourseUp) {
      for (let floor = this.currentFloor; floor < this.queues.length; floor++) {
        const queue = this.queues[floor]

        if (queue.some(p => this.isPassengersGoingUp ? p > floor : p < floor)) {
          isThereSomeOneWaiting = true
          break
        }
      }
    } else {
      for (let floor = this.currentFloor; floor > -1; floor--) {
        const queue = this.queues[floor]

        if (queue.some(p => this.isPassengersGoingUp ? p > floor : p < floor)) {
          isThereSomeOneWaiting = true
          break
        }
      }
    }

    return isThereSomeOneWaiting
  }
}