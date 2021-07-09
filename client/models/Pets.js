const Database = require('../db/Database');

// const db = Database.get()
// console.log('Database', db);

class Pets {
    constructor() {
        return (async () => {
            this.db = await Database.get();
            this.getAll = this.getAll.bind(this);
            this.getOne = this.getOne.bind(this);
            this.create = this.create.bind(this);
            this.update = this.update.bind(this);
            this.delete = this.delete.bind(this);
            this.getByName = this.getByName.bind(this);
            return this;
        })();
    }

    get collection() {
        return this.db.pets;
    }

    async getAll() {    
        const db = await Database.get()  
        const items = (await db.pets.find().exec()).map((item) => {
            return item.toJSON()
        });
        console.log('model.getAll()', items);
        return items;
    }

    async getOne(name) {
        return await this.collection
            .findOne({
                selector: { name }
            })
            .exec()
    }

    async create(pet) {
        // hooks
        this.collection.preInsert(pet => {
            const { name } = pet;
            return this.collection
                .findOne({
                    selector: { name }
                }).exec()
                .then(has => {
                    if (has !== null) {
                        const message = `A pet named ${name} already exists`;
                        throw new Error(message);
                    }
                    return db;
                })
                .catch((err) => {
                    console.error(err);
                });
        });
        return await this.collection.upsert(pet);
    }

    async update(id, pet) {
        return await this.collection.upsert(pet);
    }

    async delete(id) {
        return await this.collection.remove(pet);
    }

    async getByName(name) {
        return await this.collection
            .findOne({
                selector: { name }
            })
            .exec()
    }
}

module.exports = new Pets();