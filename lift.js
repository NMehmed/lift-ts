"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lift = void 0;
class Lift {
    constructor(queues, capacity) {
        this.history = [];
        this.isMainCourseUp = true;
        this.isPassengersGoingUp = true;
        this.peopleIn = [];
        this.currentFloor = 0;
        this.queues = queues;
        this.capacity = capacity;
    }
    start() {
        while (this.queues.some(queue => queue.length > 0) || this.peopleIn.length > 0) {
            this.history.push(this.currentFloor);
            this.getPeopleOff();
            this.getPeopleIn();
            if (this.shouldChangeMainCourse()) {
                this.changeMainCourse();
                if (this.peopleIn.length === 0)
                    this.getPeopleIn();
            }
            this.setNextStop();
        }
        if (this.history[this.history.length - 1] !== 0)
            this.history.push(0);
    }
    getPeopleIn() {
        const queue = this.queues[this.currentFloor];
        const passengers = queue.filter(x => this.isPassengersGoingUp ? x > this.currentFloor : x < this.currentFloor);
        const peopleWhoCanGetInCount = this.getFreeSpace() > passengers.length ? passengers.length : this.getFreeSpace();
        for (let i = 0; i < peopleWhoCanGetInCount; i++) {
            this.peopleIn.push(passengers[i]);
            queue.splice(queue.indexOf(passengers[i]), 1);
        }
        this.peopleIn.sort((a, b) => a - b);
    }
    getPeopleOff() {
        this.peopleIn = this.peopleIn.filter(x => x !== this.currentFloor);
    }
    shouldChangeMainCourse() {
        return (this.peopleIn.length === 0 && !this.checkWaitingPeopleToGetOn()) ||
            (this.peopleIn.length > 0 && this.isMainCourseUp && this.peopleIn[0] < this.currentFloor) ||
            (this.peopleIn.length > 0 && !this.isMainCourseUp && this.peopleIn[0] > this.currentFloor);
        // we should change course also after picking passenger on highest floor who wants to go down
        // and when we pick passenger on lowest floor who wants to go up
    }
    changeMainCourse() {
        // go up and collect people who wants to go up
        if (this.checkWaitingPeopleToGetOn(true, true)) {
            this.isMainCourseUp = true;
            this.isPassengersGoingUp = true;
            // go up and collect people who wants to go down
        }
        else if (this.checkWaitingPeopleToGetOn(true, false)) {
            this.isMainCourseUp = true;
            this.isPassengersGoingUp = false;
            // go down and collect people who wants to go down
        }
        else if (this.checkWaitingPeopleToGetOn(false, false)) {
            this.isMainCourseUp = false;
            this.isPassengersGoingUp = false;
            // go down and collect people who wants to go up
        }
        else if (this.checkWaitingPeopleToGetOn(false, true)) {
            this.isMainCourseUp = false;
            this.isPassengersGoingUp = true;
        }
    }
    setNextStop() {
        const nextGetInFloors = this.getFloorsWhoWaitsToGetIn().sort((a, b) => a - b);
        let nextGetInFloor;
        let nextGetOffFloor;
        // up and up check for people who wants to get off and get in to travel up
        if (this.isMainCourseUp && this.isPassengersGoingUp) {
            nextGetInFloor = nextGetInFloors[0];
            nextGetOffFloor = this.peopleIn[0];
            if (nextGetInFloor && nextGetOffFloor) {
                this.currentFloor = nextGetInFloor > nextGetOffFloor ? nextGetOffFloor : nextGetInFloor;
                return;
            }
            // up and down check for passenger on highest floor take him
        }
        else if (this.isMainCourseUp && !this.isPassengersGoingUp) {
            nextGetInFloor = nextGetInFloors[nextGetInFloors.length - 1];
            if (nextGetInFloor) {
                this.currentFloor = nextGetInFloor;
                return;
            }
            else if (this.peopleIn.length > 0) {
                this.currentFloor = this.peopleIn[this.peopleIn.length - 1];
                return;
            }
            // down and down check for people who wants to get off and get in to travel down
        }
        else if (!this.isMainCourseUp && !this.isPassengersGoingUp) {
            nextGetInFloor = nextGetInFloors[nextGetInFloors.length - 1];
            nextGetOffFloor = this.peopleIn[this.peopleIn.length - 1];
            if (nextGetInFloor && nextGetOffFloor) {
                this.currentFloor = nextGetInFloor > nextGetOffFloor ? nextGetInFloor : nextGetOffFloor;
                return;
            }
            // down and up check for passenger on lowest floor and take him
        }
        else {
            nextGetInFloor = nextGetInFloors[0];
            if (nextGetInFloor) {
                this.currentFloor = nextGetInFloor;
                return;
            }
            else if (this.peopleIn.length > 0) {
                this.currentFloor = this.peopleIn[0];
                return;
            }
        }
        if (!nextGetInFloor && !nextGetOffFloor)
            this.currentFloor = 0;
        if (!nextGetInFloor && nextGetOffFloor)
            this.currentFloor = nextGetOffFloor;
        if (nextGetInFloor && !nextGetOffFloor)
            this.currentFloor = nextGetInFloor;
    }
    getFloorsWhoWaitsToGetIn() {
        const floorsWithwaitingPeople = [];
        if (this.isMainCourseUp) {
            for (var i = this.currentFloor + 1; i < this.queues.length; i++) {
                if (this.queues[i].some(x => this.isPassengersGoingUp ? x > i : x < i))
                    floorsWithwaitingPeople.push(i);
            }
        }
        else {
            for (var i = this.currentFloor - 1; i > 0; i--) {
                if (this.queues[i].some(x => this.isPassengersGoingUp ? x > i : x < i))
                    floorsWithwaitingPeople.push(i);
            }
        }
        return floorsWithwaitingPeople;
    }
    getFreeSpace() {
        return this.capacity - this.peopleIn.length;
    }
    checkWaitingPeopleToGetOn(isCourseUp = this.isMainCourseUp, isPassengersGoingUp = this.isPassengersGoingUp) {
        let isThereSomeOneWaiting = false;
        if (isCourseUp) {
            for (let floor = this.currentFloor; floor < this.queues.length; floor++) {
                const queue = this.queues[floor];
                if (queue.some(p => isPassengersGoingUp ? p > floor : p < floor)) {
                    isThereSomeOneWaiting = true;
                    break;
                }
            }
        }
        else {
            for (let floor = this.currentFloor; floor > -1; floor--) {
                const queue = this.queues[floor];
                if (queue.some(p => isPassengersGoingUp ? p > floor : p < floor)) {
                    isThereSomeOneWaiting = true;
                    break;
                }
            }
        }
        return isThereSomeOneWaiting;
    }
}
exports.Lift = Lift;
//# sourceMappingURL=lift.js.map