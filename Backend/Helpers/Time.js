class CustomDate {
    constructor(date = new Date()) {
        this.date = date;
    }

    /**
     * @param {string} format 
     * defaults to `YYYY/MM/DD`
     * Other Possible inputs 
     * 1:"DD/MM/YYYY"
     * 2:"MM/DD/YYYY"
     * 
     * @returns {string} returns a string ex. "01/02/2004"
     */
    FormatDate(format = "YYYY/MM/DD") {
        const day = this.date.getDate(); // Fixed getDay() to getDate()
        const month = this.date.getMonth() + 1; // getMonth() is zero-based
        const year = this.date.getFullYear();

        if (format === "YYYY/MM/DD") return `${year}/${month}/${day}`;
        else if (format === "DD/MM/YYYY") return `${day}/${month}/${year}`;
        else return `${month}/${day}/${year}`;
    }

    /**
     * @returns {Date} Date object
     */
    GetDate() {
        return this.date;
    }

    /**
     * @param {Date} newDate set new Date object
     */
    SetDate(newDate) {
        this.date = newDate;
    }

    static GetCurrentDate() {
        return new Date();
    }

    /**
     * @param {Date} dateObj 
     * converts 24 hour time to 12 hour time
     * @returns {string} ex. 12 AM
     */
    get12hTime() {
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes();
        const seconds = this.date.getSeconds();
        if (minutes <= 9) {
            minutes = "0" + String(minutes)
        }

        const amPm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours from 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return hours + ":" + minutes + amPm + " " + seconds + "s";
    }

    /**
     * @param {string} dateString Ex. 01/04/2004
     * important to specify the format matching this string
     * @param {string} format 
     * Possbile format
     * 1:"DD/MM/YYYY"
     * 2:"MM/DD/YYYY"
     * 3: "YYYY/MM/DD"
     */
    convertDateToWords(withTime) {
        // Convert date to string with words
        let dateString = this.date.toLocaleDateString("en", {
            year: 'numeric',   // e.g., "2004"
            month: 'long',     // e.g., "January"
            day: 'numeric',     // e.g., "2"
            weekday: "long"
        });
        if (!withTime) return dateString
        return dateString + " " + this.get12hTime()
    }



    /**
     * @param {Date} otherDate date to compare with this object's date
     * @returns {boolean|undefined} a boolean value or undefined if equal
     */
    isAfter(otherDate) {
        if (this.date.getFullYear() > otherDate.getFullYear()) {
            return true;
        } else if (this.date.getFullYear() === otherDate.getFullYear()) {
            if (this.date.getMonth() > otherDate.getMonth()) {
                return true;
            } else if (this.date.getMonth() === otherDate.getMonth()) {
                if (this.date.getDate() > otherDate.getDate()) {
                    return true;
                }
                if (this.date.getDate() === otherDate.getDate()) {
                    return undefined;
                }
                return false;
            }
            return false;
        } else return false;
    }

    /**
     * @param {Date} otherDate date to compare with this object's date
     * @returns {boolean} a boolean value
     */
    isBefore(otherDate) {
        return !this.isAfter(otherDate);
    }

    /**
     * @param {Date} otherDate date to compare with this object's date
     * @returns {boolean} a boolean value
     */
    isEqual(otherDate) {
        if (this.isAfter(otherDate) === undefined) return true;
        return false;
    }

    getDayOfWeek() {
        return this.date.toLocaleDateString("en", { weekday: 'long' });
    }
}

module.exports = CustomDate;
