// import router
const {Router} = require("express");

// "creazione" router
const router = Router();

// RESTful API
router.get("/", async(req, res)=>{
    const {nameTeam, order} = req.query;
    const allTeams = await find(nameTeam, order);
    res.json(allTeams);
});

// export con commonjs
module.exports = router;