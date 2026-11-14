// import commondjs
const { AppDataSource } = require("../config/typeorm");

// crea un oggetto collegato al repository
function TypeOrmDbService(table) {
    this._repository = AppDataSource.getRepository(table);

    // effettua la ricerca
    this.find = function (options = {}) {
        return this._repository.find(options);
    };

    // crea
    this.create = function (data = {}) {
        return this._repository.create(data);
    };

    // salva
    this.save = function (entity) {
        return this._repository.save(entity);
    };

    // elimina
    this.delete = function (data = {}) {
        return this._repository.delete(data);
    };
}

// export commonjs
module.exports = { TypeOrmDbService };