var express = require('express');
var router = express.Router();

const Note = require('../models/Note');

const notSupported = function(req, res, next) {
    res.statusCode = 403;
    res.end( req.method + ' operation not supported on ' + req.originalUrl);
}

/* GET all notes (/api/notes)  */
router.get('/', function(req, res, next) {
    Note.find({})
    .then((notes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(notes);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/* POST a note  */
router.post('/', function(req, res, next) {

    var newNote = {
        title: req.body.title,
        content: req.body.content,
        isMainNote: req.body.isMainNote,
        selfDestruct: req.body.selfDestruct
    }
    // newNote.destroyAt = req.body.selfDestruct ? new Date(Date.now() + (req.body.selfDestruct*60*60*1000)) : null ;

    Note.create(newNote)
    .then((dish) => {
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/* PUT not supported on /api/notes */
router.put('/',notSupported);

/* DELETE all notes (/api/notes)  */
router.delete('/', function(req, res, next) {
    res.statusCode = 403;
    res.end( req.method + ' operation not supported on ' + req.originalUrl);
    /*  //dont delete all notes yet
    Note.remove({})
    .then((resp) => {
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    */
});


router.route('/:noteID')
.get( (req, res, next) => {
    Note.findById(req.params.noteID)
    .then((note) => {
        res.json(note);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(notSupported)
.put((req, res, next) => {
    Note.findByIdAndUpdate(req.params.noteID, {
        $set: req.body
    }, { new: true })
    .then((dish) => {
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Note.findByIdAndRemove(req.params.noteID)
    .then((resp) => {
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})



module.exports = router;
