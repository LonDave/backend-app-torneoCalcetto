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

// ordinamento per nome del team e per id => funziona?
async function find(order = "nome") {
    const property = order.replace(/^-/, "");                       //->
    const direction = order.startsWith("-") ? "DESC" : "ASC";

    // se la proprieta non fa parte di quelle autorizzate dallo schema zod
    if (!(property in SquadraSchema.shape)) {
        throw new HttpError(400, "order deve essere una proprietà di Squadra");
    }

    // ritorna la ricerca per le options passate
    return dbService.find({
        order: {
            [property]: direction
        }
    });
}

// export commonjs
module.exports = {
    SquadraSchema,
    find
};