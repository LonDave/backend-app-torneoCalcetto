// import router
const { Router } = require("express");
const { find } = require("../services/squadre.service")

// "creazione" router
const router = Router();

// RESTful API

// prende tutte le squadre
router.get("/", async (req, res, next) => {
    try {
        const squadre = await find(req.query.order);
        res.json(squadre);
    } catch (error) {
        next(error);
    }
});

// export con commonjs
module.exports = router;