// import commonjs
const { z } = require("zod");
const HttpError = require("../lib/http.error.js");
const { TypeOrmDbService } = require("../lib/typeorm.db");

// schema zod
const SquadraSchema = z.object({
    id: z.int().gt(0),                                              //-> numero maggiore di 0
    nome: z.string().trim().min(1, "name is required").max(20),     //-> minimo 1 massimo 20 caratteri
    quartiere: z.string().optional()                                //-> opzionale
});

// crea un nuovo oggetto che è dato dall'entita del repository trovato
const squadreDb = new TypeOrmDbService("Squadra");

// ordinamento per nome del team
async function find(order = "nome") {
    const property = order.replace(/^-/, "");                       //-> la query parms scritta dall'utente
    const direction = order.startsWith("-") ? "DESC" : "ASC";       //-> se presente "-" davanti la variabile per order va in DESC

    // se la proprieta non fa parte di quelle autorizzate dallo schema zod
    if (!(property in SquadraSchema.shape)) {
        throw new HttpError(400, "order deve essere una proprietà di Squadra");
    }

    // ricerca per le options passate con realzione sui giocatori
    const squadre = await squadreDb.find({
        relations: {
            giocatori: true                                         //-> relazione sulla tabella giocatori
        },
        order: {
            [property]: direction                                   //-> ordine definito dalla direzione
        }
    });

    // ritorna anche il numero di giocatori presenti in squadra
    return squadre.map((squadra) => ({
        id: squadra.id,
        nome: squadra.nome,
        quartiere: squadra.quartiere,
        num_giocatori: squadra.giocatori.length                     //-> calcolato in base alla lunghezza dell'arr
    }));
}

// ricerca per ID
async function findById(id) {
    const IdSchema = z.coerce.number().int().positive();            //-> trasforma il numero in int e vieta i negativi
    const risultato = IdSchema.safeParse(id);                       //-> valida i dati rispetto uno schema restituendo flag bool

    // se la validazione non è riuscita solleva un errore
    if (!risultato.success) {
        throw new HttpError(400, "id non valido");
    }

    const squadre = await squadreDb.find({
        where: {                                                    //-> in modo da prendere solo l'id corrispondente
            id: risultato.data
        },
        relations: {
            giocatori: true                                         //-> relazione sulla tabella giocatori
        }
    });

    // prende il primo elemento della tabella squadre 
    const squadra = squadre[0];

    // se non esiste solleva un errore
    if (!squadra) {
        throw new HttpError(404, "Squadra non trovata");
    }

    // copia dell'arr orginale, poi prendono i giocatori di una squadra e si ordina per numero di maglia e poi si mappano 
    const rosa = [...squadra.giocatori]
        .sort((a, b) => a.numero - b.numero)
        .map((giocatore) => ({
            id: giocatore.id,
            nome: giocatore.nome,
            ruolo: giocatore.ruolo,
            numero: giocatore.numero
        }));

    // torno tutte le squadre con anche le rose
    return squadre.map((squadra) => ({
        id: squadra.id,
        nome: squadra.nome,
        quartiere: squadra.quartiere,
        num_giocatori: rosa.length,                                 //-> calcolato in base alla lunghezza dell'arr
        rosa
    }));
}

// export commonjs
module.exports = {
    SquadraSchema,
    find,
    findById
};