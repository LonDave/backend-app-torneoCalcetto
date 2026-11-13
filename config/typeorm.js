// import commonjs
const { DataSource } = require("typeorm");
const { Giocatore } = require("../models/giocatore.model.js");
const { Squadra } = require("../models/squadra.model.js");

// datasource per db
const AppDataSource = new DataSource({
    type: "better-sqlite3",             //-> tipo di database
    database: "./db/typeorm.sqlite",    //-> crea il database nel percorso
    entities: [Giocatore, Squadra],     //-> entita di riferimento per le tabelle
    synchronize: true,                  //-> solo in sviluppo per aggiornamenti, in produzione usare le migration per conservare i dati 
    logging: ["error"]                  //-> mostra in console quello che esegue
});

module.exports = { AppDataSource };