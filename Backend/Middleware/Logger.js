const CustomDate = require("../Helpers/Time.js");

function getTime() {
    return new CustomDate().get12hTime()
}

function Logger(req, res, next) {
    let time = getTime()
    console.log("Incoming Request at " + time)
    next()
}


module.exports = {
    Logger,
    getTime
}

