// import commonjs
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { DatabaseSync } = require("node:sqlite");

// percorso seed
const SEED = join(__dirname, "..", "seed", "seme.sql");

// funzione per popolare il db
async function popolaDatabase(dataSource) {
    await dataSource.transaction(async (manager) => {
        const squadre = await manager.count("Squadra");         //-> conta squadre
        const giocatori = await manager.count("Giocatore");     //-> conta giocatori

        if (squadre !== 0 || giocatori !== 0) {                 //-> se non vuoto = gia popolato
            console.log("Database già popolato");
            return;
        }

        // sql per il db
        const sql = readFileSync(SEED, "utf8");

        const istruzioni = sql
            .split(";")                                         //-> divide con ";"
            .map((istruzione) => istruzione.trim())             //-> stringa senza spazi
            .filter(Boolean);                                   //-> nuovo arr senza valori falsy

        // per  ogni istruzione dentro il nuovo arr di istruzioni
        for (const istruzione of istruzioni) {
            await manager.query(istruzione);                    //-> aspetta la query per ogni istruzione
        }
    });
}

module.exports = { popolaDatabase };