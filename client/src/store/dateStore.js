import { makeAutoObservable } from "mobx";

class DateStore {
    currentDate = new Date().toISOString();

    constructor() {
        makeAutoObservable(this);
    }

    nextDay() {
        this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() + 1)).toISOString();
    }

    prevDay() {
        this.currentDate = new Date(new Date(this.currentDate).setDate(new Date(this.currentDate).getDate() - 1)).toISOString();
    }
    updateDate() {
        this.currentDate = new Date().toISOString();
    }
}

export const dateStore = new DateStore();
