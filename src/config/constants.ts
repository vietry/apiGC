class DateUtil {
    readonly now: Date;
    readonly utcDate: Date;

    constructor() {
        this.now = new Date();
        this.utcDate = new Date(this.now.toISOString());
    }

    currentDate(): Date {
        return this.utcDate;
    }
}

export default DateUtil;