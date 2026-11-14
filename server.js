// import commonjs
const express = require("express");
const dotEnv = require("dotenv");
const { join } = require("node:path");
const squadreRoute = require("./routes/squadre.route");
const { AppDataSource } = require('./config/typeorm.js');
const { popolaDatabase } = require("./lib/sqlite-db.js");

// conf file env (npm i dotenv)
dotEnv.config(join(__dirname, ".env"));

// app & port
const app = express();
const PORT = process.env.PORT ?? 3000; //->PORT assegnata dinamicamente dal server o 3000

// per attivare la connection al db
AppDataSource.initialize()
    .then(async () => {

        // aspetta di popolare il db con gli elementi dalla variabile AppDataSource
        await popolaDatabase(AppDataSource);

        // montaggio rotte
        app.use("/api/squadre", squadreRoute);

        // middleware centrale per gestione errori 
        app.use((err, req, res, next) => {
            const statusCode = err.statusCode ?? 500;

            res.status(statusCode).json({
                errore: err.message ?? "Errore interno del server"
            });
        });

        // listen del server 
        app.listen(PORT, () => {
            console.log(`Server listen on port ${PORT}`); //-> mostra in console
        });
    })
    .catch(err => {
        console.log(err)
        process.exit(1);  //-> termina il processo con code 1 (caso di errore)
    });
