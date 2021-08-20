const db = require('./mongodber');
const ObjectID = require('mongodb').ObjectID;
class BaseModel {
    constructor(dbName = 'cmp_db') {
        this.db = db.use(dbName);
        this.ObjectID = ObjectID;
    }

    async _addInstance(table, data) {
        let rs = await this.db.collection(table).insertOne(data);
        return {
            ok: rs.result.ok === 1 ? true : false,
            insertedCount: rs.insertedCount,
            insertedId: rs.insertedId
        };
    }

    async _addList(table, list) {
        let rs = await this.db.collection(table).insertMany(list);
        return {
            ok: rs.result.ok === 1 ? true : false,
            insertedCount: rs.insertedCount,
            insertedIds: rs.insertedIds
        };
    }

    async _removeInstanceByCond(table, cond) {        
        let rs = await this.db.collection(table).deleteOne(cond);
        return {
            ok: rs.result.ok === 1 ? true : false,
            deletedCount: rs.deletedCount
        };
    }

    async _removeListByCond(table, cond) {
        let rs = await this.db.collection(table).deleteMany(cond);
        return {
            ok: rs.result.ok === 1 ? true : false,
            deletedCount: rs.deletedCount
        };
    }

    async _updateInstanceByCond(table, cond, data, options = {}) {
        let rs = await this.db.collection(table).updateOne(cond, data, options);
        return {
            ok: rs.result.ok === 1 ? true : false,
            matchedCount: rs.matchedCount,
            modifiedCount: rs.modifiedCount,
            upsertedCount: rs.upsertedCount,
            upsertedId: rs.upsertedId
        };
    }

    async _updateListByCond(table, cond, data, options = {}) {
        let rs = await this.db.collection(table).updateMany(cond, data, options);
        return {
            ok: rs.result.ok === 1 ? true : false,
            matchedCount: rs.matchedCount,
            modifiedCount: rs.modifiedCount,
            upsertedCount: rs.upsertedCount,
            upsertedId: rs.upsertedId
        };
    }

    async _getInstanceByCond(table, cond, show = {}) {
        // let data = await this.db.collection(table).find(cond).project(show).limit(1).batchSize(1).toArray();
        // return data[0];
        return await this.db.collection(table).findOne(cond, {projection: show});
    }

    async _getListByCond(table, cond, options = {}) {
        let params = {projection: options.show ? options.show : {}};
        if (options.sorts && Array.isArray(options.sorts)) {
            let sort = {};
            options.sorts.forEach((x) => {
                sort[x.name] = x.num;
            });
            params.sort = sort;
        }
        let cursor = await this.db.collection(table).find(cond, params);
        if (typeof options.offset === 'number' && typeof options.limit === 'number') {
            await cursor.skip(+options.offset).limit(+options.limit);
        }
        let data = await cursor.toArray();
        if (options.total) {
            data = {list: data};
            data.total = await cursor.count();
        }
        return data;
    }

    async _bulkWriteByList(table, list = []) {
        // bulkWrite return object:
        // matchedCount	    number	 Number of documents matched for update.
        // modifiedCount	number	 Number of documents modified.
        // deletedCount	    number	 Number of documents deleted.
        // insertedCount	number	 Number of documents inserted.
        // insertedIds	    object	 Inserted document generated Id's, hash key is the index of the originating operation
        // upsertedCount	number	 Number of documents upserted.
        // upsertedIds	    object	 Upserted document generated Id's, hash key is the index of the originating operation
        // result	        object	 The command result object.
        return await this.db.collection(table).bulkWrite(list);
    }
    
    async _countFilesByCond(table, cond) {
        return await this.db.collection(table).countDocuments(cond);
    }

    async _distinctFindByCond(table, field, cond = {}, options = {}) {
        return await this.db.collection(table).distinct(field, cond, options);
    }

    async _addInstanceIfNotExists(table, cond, data) {
        return await this._updateInstanceByCond(table, cond, data, {upsert: true});
        //return await this.db.collection(table).updateOne(cond, data, {upsert: true});
    }

    async _getObjectIDs(num) {
        let ids = [];
        for (let i=0; i<num; i++) {
            ids.push(new this.ObjectID());
        }
        return ids;
    }
}

module.exports = BaseModel;