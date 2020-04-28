const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const stream = require('stream');
const File = require('../models/File');
const {saveFileFromMemory, getEncryptedFile} = require('./filesHelper');

// multer config to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* Serve all files records from the DB ( GET /api/files)  */
router.get('/', function(req, res, next) {
    File.find({})
    .then((files) => {
        res.json(files);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// handles file uploads
router.post('/upload', upload.array('files'), saveFileFromMemory);

// Serve non-ecnrypted file (GET /api/file/download/[fileID])
router.get('/download/:fileID', function(req, res, next){
    File.findById(req.params.fileID) 
    .then((file) => {
        res.json(file);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Delete a file from storage
// and its record from the DB (DELETE /api/file/download/[fileID])
router.delete('/download/:fileID', function(req, res, next){
    File.findByIdAndDelete(req.params.fileID)           // delete the file from mondoDB
    .then((deletedFile) => {
        pathToDelete = path.join(__dirname, '../', deletedFile.path);
        console.log('## Deleting File: ' + pathToDelete)
        fs.unlink(pathToDelete, (err) => {return err;}) // delete the file from system storage
        res.json(deletedFile);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Serve encrypted files
// the request should indlude json with id of the file
// to serve and password to decrypt with
router.post("/decrypt/:filename", async (req, res, next) => {
    try {
        const buffer = await getEncryptedFile(req.body.id, req.body.password);
        const readStream = new stream.PassThrough();
        readStream.end(buffer);
        res.writeHead(200, {
            "Content-disposition": 'attachment; filename=\"' + req.params.filename + '\"',
            "Content-Type": "application/octet-stream",
            "Content-Length": buffer.length
        });
        res.end(buffer);
    } catch (error) {
        next(error);
    }   
});

module.exports = router;
