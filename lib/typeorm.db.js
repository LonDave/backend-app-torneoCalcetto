// import commondjs
const { AppDataSource } = require("../config/typeorm");

// crea un oggetto collegato al repository
function TypeOrmDbService(table) {
    this._repository = AppDataSource.getRepository(table);

    // effettua la ricerca
    this.find = function (options = {}) {
        return this._repository.find(options);
    };

}

// export 
module.exports = { TypeOrmDbService };