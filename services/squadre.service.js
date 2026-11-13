// import commonjs
const { join } = require("node:path");
const { z, property } = require("zod");
const HttpError = require("../lib/http.error");

const SquadraSchema = z.object({
    id: z.int().gt(0),                  //-> numero maggiore di 0
    name: z.string().min(1).max(20),    //-> minimo 1 massimo 20 caratteri
    district: z.string().optional()     //-> opzionale
});

// servizio del db
const dbService = new TypeOrmDbService("Squadra");

async function find(nameTeam, order) {
    if (order) {
        const property = order.replace(/^-/, "");
        const direction = order[0] === "-" ? -1 : 1;                //-> direzione dell'ordine, 1 "ASC": -1 "DESC"
        const validProperty = property in SquadraSchema.shape;      //-> verifica se la proprieta è all'interno dello shape validato con zod

        // se la proprietà non è all'interno della shape non accettiamo i valori
        if (!validProperty) {
            throw new HttpError(400, "order deve essere una proprietà di Squadre")
        }
        order = { property, direction };
    } else {
        order = { property: "id", direction: 1 }
    }
    if (nameTeam) {
        const property = order.replace(/^-/, "");
        const direction = nameTeam[0] === "-" ? -1 : 1;                 //-> direzione del team, 1 "ASC": -1 "DESC"
        const validProperty = property in SquadraSchema.shape;          //-> verifica se la proprieta è all'interno dello shape validato con zod

        // se la proprietà non è all'interno della shape non accettiamo i valori
        if (!validProperty) {
            throw new HttpError(400, "nameTeam deve essere una proprietà di Squadre")
        }
        order = { property, direction };                                    //-> altrimenti l'ordine definito dai query params
    } else {
        order = { property: "name", direction: 1 }                          //-> oppure ordine predefinito per id
    }
}


// esporto commonjs
module.exports = [
    SquadraSchema,
]