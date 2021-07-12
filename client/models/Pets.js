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
            return this;
        })();
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
        const db = await Database.get()  
        return await db.pets.findOne({
                selector: { name : name }
            }).exec()
    }

    async create(pet) {
        // hooks
        const db = await Database.get();
        db.pets.preInsert(pet => {
            const { name } = pet;
            return db.pets
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
        return await db.pets.upsert(pet);
    }

    async update(pet) {
        const db = await Database.get();
        return await db.pets.atomicUpdate(pet);
    }

    async delete(name) {
        console.log('[PetsModel][name]', name);
        const doc = await this.getOne(name);
        console.log('[PetsModel][doc]', doc);
        return await doc.remove();
    }
}

module.exports = new Pets();