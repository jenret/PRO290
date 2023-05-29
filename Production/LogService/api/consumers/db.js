const {
    MongoClient
} = require("mongodb");

const client = new MongoClient("mongodb://MongoService:27017/");

let dbName = "logs";

function logEvent(collection, eventType, eventMessage) {
    const db = client.db(dbName);
    // const collection = db.collection(collection);

    const logEntry = {
        status: eventType,
        event: eventMessage.type,
        message: eventMessage.response,
        timestamp: new Date()
    };
    db.collection(collection).insertOne(logEntry, function (err, res) {
        if (err) throw err;
        console.log("Log entry stored.");
    });
}

module.exports = {
    logEvent
};