// import
const { EntitySchema } = require("typeorm");

// entita giocatore
const Giocatore = new EntitySchema({
    name: "Giocatore",
    tableName: "giocatori",
    columns: {
        id: { type: Number, primary: true, generated: true },
        nome: { type: String, nullable: false },
        ruolo: { type: String, nullable: false },
        numero: { type: Number, nullable: false }
    },
    // relazione tra giocatori e squadra
    relations: {
        squadra: {
            target: "Squadra",
            type: "many-to-one",
            joinColumn: { name: "squadra_id" }
        }
    }
});

module.exports = { Giocatore }; 