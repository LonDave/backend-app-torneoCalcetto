// import commonjs
const { Router } = require("express");
const { createGiocatore, delGiocatore } = require("../services/giocatori.service.js");

// "creazione" router
const router = Router();

// RESTful API:

// creazione giocatore
router.post("/", async (req, res, next) => {
    try {
        const newGiocatore = await createGiocatore(req.body)
        res.status(201).json(newGiocatore);
    } catch (error) {
        next(error);
    }
});

// eliminazione giocatore
router.delete("/:id", async (req, res, next) => {
    try {
        await delGiocatore(req.params.id)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// export con commonjs
module.exports = router;
