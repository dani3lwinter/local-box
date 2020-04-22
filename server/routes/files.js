var express = require('express');
var router = express.Router();
const fs = require('fs')
var path = require('path');
var multer = require('multer');
const stream = require('stream');
var {saveFileFromMemory, getEncryptedFile} = require('./filesHelper');
const File = require('../models/File');

notSupported = function(req, res, next) {
    res.statusCode = 403;
    res.end( req.method + ' operation not supported on ' + req.originalUrl);
}


/* GET all files (/api/files)  */
router.route('/')
.get(function(req, res, next) {
    File.find({})
    .then((files) => {
        // remove authTag from the respond before sending
        //const newArray = files.map(({authTag, ...rest}) => rest)
        //files.toObject();
        //files = files.forEach(file => {delete file.authTag}); 
 
        // send the files
        res.json(files);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(notSupported)     /* POST not supported on /api/files */
.put(notSupported)      /* PUT not supported on /api/files */
.delete(notSupported);  /* DELETE not supported on /api/files */


router.route('/download/:fileID')
.get(function(req, res, next){
    File.findById(req.params.fileID) 
    .then((file) => {
        res.json(file);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(function(req, res, next){
    File.findByIdAndDelete(req.params.fileID)           // delete the file from mondoDB
    .then((deletedFile) => {
        pathToDelete = path.join(__dirname, '../', deletedFile.path);
        console.log('## Deleting File: ' + pathToDelete)
        fs.unlink(pathToDelete, (err) => {return err;}) // delete the file from system storage
        res.json(deletedFile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(notSupported) // GET not supported 
.put(notSupported)  // PUT not supported 



var storage = multer.memoryStorage();
const upload = multer({ storage });

// handles file uploads
router.route('/upload')
.post(upload.array('files'), saveFileFromMemory);



router.post("/decrypt/:filename", async (req, res, next) => {
    try {
        const buffer = await getEncryptedFile( req.body.id, req.body.password);
        const readStream = new stream.PassThrough();
        readStream.end(buffer);
        res.writeHead(200, {
            "Content-disposition": "attachment; file=" + req.params.filename,
            "Content-Type": "application/octet-stream",
            "Content-Length": buffer.length
        });
        res.end(buffer);
    } catch (error) {
        next(error);
    }
    
});

module.exports = router;
