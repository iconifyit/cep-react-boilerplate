const {
    createRxDatabase,
    addRxPlugin
} = require('rxdb');

const RxDBLeaderElectionPlugin =  require('rxdb/plugins/leader-election');
const { RxDBReplicationPlugin } = require('rxdb/plugins/replication');
const { RxDBNoValidatePlugin } = require('rxdb/plugins/no-validate');

addRxPlugin(require('pouchdb-adapter-idb'));
addRxPlugin(require('pouchdb-adapter-http')); // enable syncing over http
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBReplicationPlugin);
addRxPlugin(RxDBNoValidatePlugin);

const dbName = 'pets';
const theSchema = require('../schema/schema.json');
const theData   = require('../data/pets.json');

const syncURL = `http://localhost:5984/${dbName}/`;

let dbPromise = null;

// EXAMPLES : https://github.com/pubkey/rxdb/tree/master/examples/react/src

const _create = async () => {
    const theSchema = require('../schema/schema.json');
    const theData   = require('../data/pets.json');

    const db = await createRxDatabase({
        name: dbName,
        adapter: 'idb'
    });

    window['db'] = db; 

    // show leadership in title
    db.waitForLeadership().then(() => {
        document.title = '♛ ' + document.title;
    });

    const pets = await db.addCollections({
        pets: {
            schema: theSchema
        }
    });

    // hooks
    db.collections[dbName].preInsert(docObj => {
        const { name } = docObj;
        return db.collections[dbName]
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

    db.pets.sync({ remote: syncURL });

    theData.forEach((item) => {
        db.collections[dbName].upsert(item);
    })

    // db.collections[dbName].dump()
    //     .then(json => console.dir(json));

    return db;
}

module.exports = {
    get : () => {
        if (! dbPromise)
            dbPromise = _create();
        return dbPromise;
    }   
};