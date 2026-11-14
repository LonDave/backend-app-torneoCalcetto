// import commonjs
const { z } = require("zod");
const HttpError = require("../lib/http.error.js");
const { TypeOrmDbService } = require("../lib/typeorm.db.js");

// schema zod
const GiocatoriSchema = z.object({
    nome: z.string().trim().min(1, "name is required").max(60),                                     //-> nome obbligatorio, rimuove gli spazi extra
    ruolo: z.enum(["portiere", "difensore", "centrocampista", "attaccante"]),                       //-> scelta disponibile solo tra i campi dell'arr
    numero: z.int().min(1).max(99),
    squadra_id: z.int().positive()
}).strict();

// crea un nuovo oggetto che è dato dall'entita del repository trovato
const squadreDb = new TypeOrmDbService("Squadra");
const giocatoriDb = new TypeOrmDbService("Giocatore");

// creazione giocatore
async function createGiocatore(body) {
    const validazione = GiocatoriSchema.safeParse(body);                                            //-> valida i dati rispetto uno schema restituendo flag bool

    // se la validazione non è riuscita solleva un errore
    if (!validazione.success) {
        throw new HttpError(400, "dati non validi");
    }

    // si prendono i dati presenti nella validazione
    const dati = validazione.data;

    // si prende la squadra la quale ha l'id pari a quello passato nello schema zod
    const squadre = await squadreDb.find({
        where: {
            id: dati.squadra_id
        }
    });

    // prende il primo elemento della tabella squadre 
    const squadra = squadre[0];

    // se la squadra non esiste solleva un errore
    if (!squadra) {
        throw new HttpError(400, "squadra inesistente")
    }

    // si cercano i gliocatori che hanno lo stesso numero 
    const giocatoriConStessoNumero = await giocatoriDb.find({
        where: {
            numero: dati.numero,
            squadra: {
                id: dati.squadra_id
            }
        }
    });

    // se esistono più giocatori con lo stesso numero (arr) si solleva un errore
    if (giocatoriConStessoNumero.length > 0) {
        throw new HttpError(409, "numero già in uso nella squadra");
    };

    // creazione di un giocatore con i valori "dati" presenti nel body
    const giocatore = giocatoriDb.create({
        nome: dati.nome,
        ruolo: dati.ruolo,
        numero: dati.numero,
        squadra
    });

    // salvataggio del giocatore nel db
    const salvato = await giocatoriDb.save(giocatore);

    // ritorno 
    return {
        id: salvato.id,
        nome: salvato.nome,
        ruolo: salvato.ruolo,
        numero: salvato.numero,
        squadra_id: squadra.id
    }
};

// eliminazione giocatore
async function delGiocatore(id) {
    const validazione = z.coerce.number().int().positive().safeParse(id);                   //-> valida l'id 

    // se la validazione è negata solleva un errore
    if (!validazione.success) {
        throw new HttpError(400, "id non valido");
    };

    // elimina il giocatore dal db
    const risulto = await giocatoriDb.delete(validazione.data);

    // se risultato ha effetto produce una riga affected, altrimenti si solleva un errore
    if (!risulto.affected === 0) {
        throw new HttpError(404, "giocatore inesistente")
    }
};

// export commonjs
module.exports = {
    createGiocatore,
    delGiocatore
}