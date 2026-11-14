// import commonjs
const { z } = require("zod");
const HttpError = require("../lib/http.error");
const { TypeOrmDbService } = require("../lib/typeorm.db");

const SquadraSchema = z.object({
    id: z.int().gt(0),                   //-> numero maggiore di 0
    nome: z.string().min(1).max(20),     //-> minimo 1 massimo 20 caratteri
    quartiere: z.string().optional()     //-> opzionale
});

// crea un nuovo oggetto che è dato dall'entita del repository trovato
const dbService = new TypeOrmDbService("Squadra");

// ordinamento per nome del team
async function find(order = "nome") {
    const property = order.replace(/^-/, "");                       //-> la query parms scritta dall'utente
    const direction = order.startsWith("-") ? "DESC" : "ASC";       //-> se presente "-" davanti la variabile per order va in DESC

    // se la proprieta non fa parte di quelle autorizzate dallo schema zod
    if (!(property in SquadraSchema.shape)) {
        throw new HttpError(400, "order deve essere una proprietà di Squadra");
    }

    // ricerca per le options passate con realzione sui giocatori
    const squadre = await dbService.find({
        relations: {
            giocatori: true                 //-> relazione sulla tabella giocatori
        },
        order: {
            [property]: direction           //-> ordine definito dalla direzione
        }
    });

    // ritorna anche il numero di giocatori presenti in squadra
    return squadre.map((squadra) => ({
        id: squadra.id,
        nome: squadra.nome,
        quartiere: squadra.quartiere,
        num_giocatori: squadra.giocatori.length             //-> calcolato in base alla lunghezza dell'arr
    }));
}

// export commonjs
module.exports = {
    SquadraSchema,
    find
};