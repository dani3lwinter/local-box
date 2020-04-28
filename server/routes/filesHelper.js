const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const File = require('../models/File');

// The algorithm method to encrypt all the files
const CryptoAlgorithm = "aes-256-gcm";

/**
 * Gets buffer of a file and
 * returns a new buffer of the encrypted file
 * https://medium.com/@anned20/encrypting-files-with-nodejs-a54a0736a50a
 * @param {String} algorithm    the algorithm method to encrypt the file with
 * @param {Buffer} buffer       A Buffer of the file to be encrypted
 * @param {String} password     password for the encryption
 */
function encrypt(algorithm, buffer, password) {
    var key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    var iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return [encrypted, cipher.getAuthTag()] ;
};

/**
 * Gets buffer of an encrypted file and
 * returns a new buffer of the original file.
 * @param {String} algorithm    the algorithm method used to encrypt the file
 * @param {Buffer} buffer       A Buffer of the encrypted file
 * @param {String} password     password used to encrypt the file
 */
function decrypt(algorithm, buffer, password, authTag) {
    var key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const iv = buffer.slice(0, 16);         // Get the iv: the first 16 bytes
    const encrypted = buffer.slice(16) ;    // The rest of the buffer is the actual file    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted;
}

/**
 * After multer save the uploaded file to a buffer,
 * this middleware will save the file to disk.
 * if the field 'encrypt' in the recieved form is true,
 * it wiil encrypt the filed with the field 'password'
 */
function saveFileFromMemory(req, res, next){

    // For save each file in req.files to disk
    req.files.forEach( (file) => {

        var fileData, fileAuthTag;
        if( !req.body.encrypt || req.body.encrypt==='false'){
            // save the buffer without encrypting
            fileData = file.buffer;
            fileAuthTag = '';
        } else{ 
            // encrypt the file buffer before saving
            [fileData, fileAuthTag] = encrypt(CryptoAlgorithm, file.buffer, req.body.password);   
            file.authTag = fileAuthTag; // add authTag to req (later it will be saved to mongoDB)
        }
            
        var filePath = path.join("./uploads", file.originalname);
        if (!fs.existsSync(path.dirname(filePath))) {   // check if uploads folder is exists
            fs.mkdirSync(path.dirname(filePath));       // if not, create the folder
        }

        // while a file with tha same name already exists, find path name that is available
        var i = 1;
        while (fs.existsSync(filePath)) {     
            // new path is "./uploads/[originalname] (1).txt"
            filePath = path.join(
                path.dirname(filePath),
                path.basename(file.originalname, path.extname(file.originalname)) +
                ' (' + i + ')' +
                path.extname(file.originalname)
            );
            
            i++;
            if (i == 100) {
                throw new Error('Too many files with the same name already exists');
            }
        }

        file.originalname = path.basename(filePath);
        file.path = filePath;                   // add path field to the req
        fs.writeFileSync(filePath, fileData);   // save the file
        console.log('New file saved: ' + path.basename(filePath));
    });
    // save a record of the file in mongoDB and respond with the new record
    saveFilesRecord(req, res, next)
}

/**
 * Save record of the uploaded files to mongoDB after the
 * files are saved and send the new records back to the client
 */
const saveFilesRecord = function(req, res, next){
    const fileRecords = new Array(req.files.length)

    // Calculate destroyAt date
    const hoursUntillDestruct = req.body.selfDestruct;
    var destroyAt = new Date(Date.now() + (hoursUntillDestruct*60*60*1000));

    // Create all the records
    for (var i=0; i<fileRecords.length; i++) {
        fileRecords[i] = {
            originalname:   req.files[i].originalname,
            path:           req.files[i].path,
            size:           req.files[i].size,
            mimetype:       req.files[i].mimetype,
            encrypted:      req.body.encrypt,
        }
        if(req.files[i].authTag){
            fileRecords[i].authTag = req.files[i].authTag;
        }
        if(hoursUntillDestruct && parseInt(hoursUntillDestruct) !== -1){
            fileRecords[i].destroyAt = destroyAt;
        }
    }

    // save the records to mongoDB and send it back to client
    File.create(fileRecords)
    .then((savedRecords) => {
        res.json(savedRecords);
    }, (err) => next(err))
    .catch((err) => next(err));
}

/**
 * Gets id of an encrypted file and its password
 * and returns a buffer of the original file (after decryption) 
 */
async function getEncryptedFile(fileId, password){
    // find the file in the DB
    file = await File.findById(fileId);

    // get the ecrypted file from system storage
    const filePath = path.join("./uploads", file.originalname);
    const encrypted = fs.readFileSync(filePath);

    //return decrypted buffer of the file
    const buffer = decrypt(CryptoAlgorithm, encrypted, password, file.authTag);
    return buffer;    
}


module.exports = {
    saveFileFromMemory: saveFileFromMemory,
    getEncryptedFile: getEncryptedFile,
};