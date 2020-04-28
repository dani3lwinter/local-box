var express = require('express');
var router = express.Router();
const Note = require('../models/Note');

/**
 * 
 */
const queryRespond = (req, res, next) => {
    req.dbPromise.then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err));
}

/* Serve all the notes in the database (GET /api/notes)  */
router.get('/',  function(req, res, next){
    req.dbPromise = Note.find({});
    next();
}, queryRespond);

/* Add a note to the database (POST /api/notes)  */
router.post('/', function(req, res, next) {
    var newNote = {
        title: req.body.title,
        content: req.body.content,
        isMainNote: req.body.isMainNote,
        selfDestruct: req.body.selfDestruct
    }
    req.dbPromise = Note.create(newNote)
    next();
}, queryRespond);

/* DELETE all notes (/api/notes)  */
router.delete('/', function(req, res, next) {
    res.statusCode = 403;
    res.end( req.method + ' operation not supported on ' + req.originalUrl);
    /*  //dont delete all notes yet
    Note.deleteMany({})
    .then((resp) => {
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    */
});


router.route('/:noteID')
.get( (req, res, next) => {
    req.dbPromise = Note.findById(req.params.noteID)
    next();
}, queryRespond)

.put((req, res, next) => {
    req.dbPromise = Note.findByIdAndUpdate(req.params.noteID, {
        $set: req.body
    }, { new: true })
    next();
}, queryRespond)

.delete((req, res, next) => {
    req.dbPromise = Note.findByIdAndRemove(req.params.noteID)
    next();
}, queryRespond)



module.exports = router;
