const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//NOTE: EVENT_TYPE CHANGED REQUIRED:TRUE
const readingLogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    event_type: {
        type: String,
        required:true
    },
    book : {
        type: Schema.Types.ObjectId,
        ref: 'digiBook',
        required:true
    },
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const ReadLogs = mongoose.model('ReadingLog', readingLogSchema);

module.exports = ReadLogs;