// import commonjs
const express = require("express");
const dotEnv = require("dotenv");
const { join } = require("node:path");
const { AppDataSource } = require('./config/typeorm.js');
const { popolaDatabase } = require("./lib/sqlite-db.js");
const squadreRoute = require("./routes/squadre.route.js");
const giocatoriRoute = require("./routes/giocatori.route.js");
const { findById } = require("./services/squadre.service.js");

// conf file env (npm i dotenv)
dotEnv.config({
    path: join(__dirname, ".env")
});

// app & port
const app = express();
const PORT = process.env.PORT ?? 3000;                                                      //-> PORT assegnata dinamicamente dal server o 3000

app.disable("x-powered-by");                                                                //-> evita di rivelare che l'applicazione usa server express

// engine per ejs
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// dichiarazione file statici
app.use(express.static(join(__dirname, "public")));

// per attivare la connection al db
AppDataSource.initialize()
    .then(async () => {

        // aspetta di popolare il db con gli elementi dalla variabile AppDataSource
        await popolaDatabase(AppDataSource);

        // middleware
        app.use(express.json());
        const apiKeyAuth = (req, res, next) => {                                            //-> controlla se presente la chiave
            const apiKey = req.headers["x-api-key"];

            if (!apiKey || apiKey !== process.env.API_KEY) {
                return res.status(401).json({ errore: "API Key mancante o non valida" });
            }
            next();
        }

        // rotta web per ricerca by ID
        app.get("/squadre/:id", async (req, res, next) => {
            try {
                const squadra = await findById(req.params.id);                              //-> legge dal db la squadra partendo dall'ID

                // render della pagina
                res.render("page", { squadra });
            } catch (error) {
                if (error.statusCode === 404) {

                    // qualora non esista una squadra per quell'id si manda una pagina dedicata 
                    return res.status(404).render("404");
                }

                next(error);
            }
        });

        // montaggio rotte 
        app.use("/api/squadre", squadreRoute);
        app.use("/api/giocatori", apiKeyAuth, giocatoriRoute);                              //-> inserito il mw di controllo

        // in caso di rotta API non esistente
        app.use("/api", (req, res) => {
            res.status(404).json({
                errore: "rotta API non trovata"
            });
        });

        // gestore centralizzato degli errori
        app.use((err, req, res, next) => {
            if (err.type === "entity.parse.failed") {
                return res.status(400).json({
                    errore: "json non valido"
                });
            }

            const statusCode = err.statusCode ?? err.status ?? 500;

            const messaggio =
                statusCode >= 500
                    ? "errore interno del server"
                    : err.message;

            res.status(statusCode).json({
                errore: messaggio
            })
        })

        // listen del server 
        app.listen(PORT, () => {
            console.log(`Server listen on port ${PORT}`); //-> mostra in console
        });
    })
    .catch(err => {
        console.log(err)
        process.exit(1);  //-> termina il processo con code 1 (caso di errore)
    });