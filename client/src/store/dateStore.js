import { makeAutoObservable } from "mobx";

class DateStore {
    currentDate = new Date().toISOString();

    constructor() {
        makeAutoObservable(this);
    }

    next(type) {
        const currentDate = new Date(this.currentDate);
    
        switch (type) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'year':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7);  // Adds 7 days for the next week
                break;
            default:
                break;
        }
    
        this.currentDate = currentDate.toISOString();
    }
    
    prev(type) {
        const currentDate = new Date(this.currentDate);
    
        switch (type) {
            case 'day':
                currentDate.setDate(currentDate.getDate() - 1);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() - 1);
                break;
            case 'year':
                currentDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() - 7);  // Subtracts 7 days for the previous week
                break;
            default:
                break;
        }
    
        this.currentDate = currentDate.toISOString();
    }
    
    today() {
        this.currentDate = new Date().toISOString();
    }
    updateDate() {
        this.currentDate = new Date().toISOString();
    }
}

export const dateStore = new DateStore();
