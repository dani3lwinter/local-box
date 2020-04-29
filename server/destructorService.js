const File = require('./models/File');
const Note = require('./models/Note');
const fs = require('fs');

// Format Date object to nice string
const dateFormater = new Intl.DateTimeFormat('default', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', 
    hour12: false,
});

// Add h hours to Date object
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

/**
 * Converts file size in bytes to pretty string
 * @param {Number} bytes     The file size (in bytes)
 * @param {Number} decimals  Decimal places to be included in the string (defaul is 2) 
 */
function fileSizeToString(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Removes every file with 'destroyAt' date field that has passed,
 * and remove the file record from DB
 */
async function destructOutdatedFiles(){

    var now = new Date();
    // array of ids of files that needs to be deleted
    filesIdToDelete =[];
    // report of the deleted files to be printed to console   
    var filesReport = '  Files:\n\tSize:\t\tPath:\n';
    
    // for every file in the DB
    var files = await File.find({}).lean();
    files.forEach(file => {
        // if the 'destroyAt field has passed,
        if( now > file.destroyAt ){
            filesReport += '\t[' + fileSizeToString(file.size) + ']\t' + file.path +'\n' //update the report
            filesIdToDelete.push(file._id);     // add the file id to the deletion list
            fs.unlinkSync(file.path)            // and delete the file from system storage
        }
    });

    // if 0 files found, change the report
    var report = filesIdToDelete.length > 0 ? filesReport : '  No files to delete\n'

    // delete the files from mongoDB, and return the report
    return File.deleteMany({_id: { $in: filesIdToDelete}})
    .then(() => report)
    .catch((err) => '  Error while deleting file from DB:\n' +err+ '\n')
}

/**
 * Removes every note from DB with 'selfDestruct' field that 
 * the hours of this field have passed since updatedAt date
 */
async function destructOutdatedNotes(){

    var now = new Date();
    // array of ids of notes that needs to be deleted
    var notesIdToDelete = [];   
    // report of the deleted notes to be printed to console    
    var notesReport = '  Notes:\n\tTitle:\n';

    var notes = await Note.find({})
    // for every note in the DB
    notes.forEach(note => {
        // if the note has 'selfDestruct' field, check
        if(note.selfDestruct && parseInt(note.selfDestruct) > 0 ){
            // check if the selfDestruct hours since updatedAt have passed 
            var destroyAt = new Date(note.updatedAt).addHours(note.selfDestruct);
            if( now > destroyAt ){
                notesIdToDelete.push(note._id);
                notesReport += '\t' + note.title + '\n';
            }
        }
    });
    
    // if 0 notes found, change the report
    var report = notesIdToDelete.length > 0 ? notesReport : '  No notes to delete\n'

    // delete the notes from mongoDB, and return the report
    return Note.deleteMany({_id: { $in: notesIdToDelete}})
    .then(() => report)
    .catch((err) => '  Error while deleting note from DB:\n' +err+ '\n')
    
}

/**
 * Delete notes and files that have been set to self destruct
 * from the database (and files also from system storage).
 * A promise that returns a report of the deleted items.
 */
async function destructOutdated(){

    // String report of the deleted items
    const startOfReport = '\n## Destruction Report - ' + dateFormater.format(new Date()) + '\n';
    const endOfReport   = '## End of Destruction Report\n';

    return Promise.all([
        destructOutdatedNotes().catch(err => '  Notes ' + err + '\n'),
        destructOutdatedFiles().catch(err => '  Files ' + err + '\n')
    ])
    .then( (reports) => (startOfReport + reports[0] + reports[1] + endOfReport) ); 
    // return final report (notes and files report concatenated)
}

module.exports = {
    destructOutdated: destructOutdated,
};