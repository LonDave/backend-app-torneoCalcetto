// import typeORM
const { EntitySchema } = require("typeorm");

// entita squadra
const Squadra = new EntitySchema({
    name: "Squadra",
    tableName: "squadre",
    columns: {
        id: { type: Number, primary: true, generated: true },
        nome: { type: String, unique: true, nullable: false },
        quartiere: { type: String }
    },
    relations: {
        giocatori: {
            target: "Giocatore",        //-> entita di riferimento
            type: "one-to-many",
            inverseSide: "squadra"      //-> colonna di riferimento nella tabella "many" 
        }
    }
})

// export commonjs
module.exports = { Squadra };
