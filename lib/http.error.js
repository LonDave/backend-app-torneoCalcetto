// classe per la gestione di errori
class HttpError extends Error {
    statusCode = 500;

    // costruttore con 2 parametri codice status e messaggio
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = HttpError;