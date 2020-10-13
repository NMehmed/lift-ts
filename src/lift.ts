export class Lift {
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

  public makeARun() {
    while (this.queues.some(queue => queue.length > 0) || this.peopleIn.length > 0) {
      this.history.push(this.currentFloor)

      this.getPeopleOff()

      if (this.shouldChangeMainCourse()) this.changeMainCourse()

      this.getPeopleIn()

      this.setNextStop()
    }

    if (this.history[this.history.length - 1] !== 0) this.history.push(0)

    return this.history
  }

  private getPeopleOff() {
    this.peopleIn = this.peopleIn.filter(passenger => passenger !== this.currentFloor)
  }

  private getPeopleIn() {
    const queue = this.queues[this.currentFloor]
    const passengers = queue.filter(passengerAimedFloor => this.passengersGoingOnThatDirection(passengerAimedFloor, this.isMainCourseUp, this.currentFloor))
    const peopleWhoCanGetInCount = this.getFreeSpace() > passengers.length ? passengers.length : this.getFreeSpace()

    for (let i = 0; i < peopleWhoCanGetInCount; i++) {
      this.peopleIn.push(queue.shift() as number)
    }

    this.peopleIn.sort((a, b) => a - b)
  }

  private shouldChangeMainCourse(): boolean {
    return (this.peopleIn.length === 0 && !this.checkWaitingPeopleToGetOn())
  }

  private changeMainCourse() {
    if (this.isMainCourseUp) {
      if (this.checkWaitingPeopleToGetOn(true, false)) {
        this.isMainCourseUp = true
        this.isPassengersGoingUp = false

        return
      }
    }

    if (!this.isMainCourseUp) {
      if (this.checkWaitingPeopleToGetOn(false, true)) {
        this.isMainCourseUp = false
        this.isPassengersGoingUp = true

        return
      }
    }

    if (this.checkWaitingPeopleToGetOn(true, true)) {
      this.isMainCourseUp = true
      this.isPassengersGoingUp = true
    } else if (this.checkWaitingPeopleToGetOn(false, false)) {
      this.isMainCourseUp = false
      this.isPassengersGoingUp = false
    }
  }

  private setNextStop() {
    const nextGetInFloors = this.getFloorsWhoWaitsToGetIn().sort((a, b) => a - b)
    let nextGetInFloor
    let nextGetOffFloor

    // up and up check for people who wants to get off and get in to travel up
    if (this.isMainCourseUp && this.isPassengersGoingUp) {
      nextGetInFloor = nextGetInFloors[0]
      nextGetOffFloor = this.peopleIn[0]

      if (nextGetInFloor && nextGetOffFloor) {
        this.currentFloor = nextGetInFloor > nextGetOffFloor ? nextGetOffFloor : nextGetInFloor
        return
      }
      // up and down check for passenger on highest floor take him
    } else if (this.isMainCourseUp && !this.isPassengersGoingUp) {
      nextGetInFloor = nextGetInFloors[nextGetInFloors.length - 1]

      if (nextGetInFloor) {
        this.currentFloor = nextGetInFloor
        return
      } else if (this.peopleIn.length > 0) {
        this.currentFloor = this.peopleIn[this.peopleIn.length - 1]
        return
      }
      // down and down check for people who wants to get off and get in to travel down
    } else if (!this.isMainCourseUp && !this.isPassengersGoingUp) {
      nextGetInFloor = nextGetInFloors[nextGetInFloors.length - 1]
      nextGetOffFloor = this.peopleIn[this.peopleIn.length - 1]

      if (nextGetInFloor && nextGetOffFloor) {
        this.currentFloor = nextGetInFloor > nextGetOffFloor ? nextGetInFloor : nextGetOffFloor
        return
      }
      // down and up check for passenger on lowest floor and take him
    } else {
      nextGetInFloor = nextGetInFloors[0]

      if (nextGetInFloor) {
        this.currentFloor = nextGetInFloor
        return
      } else if (this.peopleIn.length > 0) {
        this.currentFloor = this.peopleIn[0]
        return
      }
    }

    if (!nextGetInFloor && !nextGetOffFloor) this.currentFloor = 0
    if (!nextGetInFloor && nextGetOffFloor) this.currentFloor = nextGetOffFloor
    if (nextGetInFloor && !nextGetOffFloor) this.currentFloor = nextGetInFloor
  }

  private getFloorsWhoWaitsToGetIn(): Array<number> {
    const floorsWithwaitingPeople = []

    if (this.isMainCourseUp) {
      for (let floor = this.currentFloor + 1; floor < this.queues.length; floor++) {
        if (this.anyPassengersOnThatDirection(this.queues[floor], this.isPassengersGoingUp, floor))
          floorsWithwaitingPeople.push(floor)
      }
    } else {
      for (let floor = this.currentFloor - 1; floor > 0; floor--) {
        if (this.anyPassengersOnThatDirection(this.queues[floor], this.isPassengersGoingUp, floor))
          floorsWithwaitingPeople.push(floor)
      }
    }

    return floorsWithwaitingPeople
  }

  private getFreeSpace(): number {
    return this.capacity - this.peopleIn.length
  }

  private checkWaitingPeopleToGetOn(isCourseUp: boolean = this.isMainCourseUp, isPassengersGoingUp: boolean = this.isPassengersGoingUp): boolean {
    let isThereSomeOneWaiting = false

    if (isCourseUp) {
      const floorToStart = isPassengersGoingUp ? this.currentFloor : this.currentFloor + 1

      for (let floor = floorToStart; floor < this.queues.length; floor++) {
        const queue = this.queues[floor]

        if (this.anyPassengersOnThatDirection(queue, isPassengersGoingUp, floor)) {
          isThereSomeOneWaiting = true
          break
        }
      }
    } else {
      const floorToStart = !isPassengersGoingUp ? this.currentFloor : this.currentFloor - 1

      for (let floor = floorToStart; floor > -1; floor--) {
        const queue = this.queues[floor]

        if (this.anyPassengersOnThatDirection(queue, isPassengersGoingUp, floor)) {
          isThereSomeOneWaiting = true
          break
        }
      }
    }

    return isThereSomeOneWaiting
  }

  private anyPassengersOnThatDirection(queue: Array<number>, isDirectionUp: boolean, currentFloor: number): boolean {
    return queue.some(passengerAimedfloor => this.passengersGoingOnThatDirection(passengerAimedfloor, isDirectionUp, currentFloor))
  }

  private passengersGoingOnThatDirection(passengerAimedfloor: number, isDirectionUp: boolean, currentFloor: number) {
    return isDirectionUp ? passengerAimedfloor > currentFloor : passengerAimedfloor < currentFloor
  }
}