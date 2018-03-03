// kotrak
// kotrak2017
var _connectionString = 'mongodb://pulpitturysty:Kotrak2016@ds013545.mlab.com:13545/pulpitturysty'
var _connectionString = 'mongodb://kotrak:Kotrak2017@ds055842.mlab.com:55842/kotrakwebacademy'
var mongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID

function connect (callback) {
  mongoClient.connect(_connectionString, function (err, db) {
    callback(err, db)
  })
}

function insertDocument (db, collectionName, data, callback) {
  db.collection(collectionName).insertOne(data, function (err, result) {
    callback(err, result)
  })
}

function deleteDocument (db, collectionName, data, callback) {
  db.collection(collectionName).deleteOne(data, function (err, result) {
    callback(err, result)
  })
}

function findDocument (db, collectionName, value, column, callback) {
  console.log(column, value)
  db.collection(collectionName).findOne({username: value}, function (err, data) {
    callback(err, data)
  })
}

function getAll (db, collectionName, callback) {
  db.collection(collectionName).find().toArray(function (err, data) {
    callback(err, data)
  })
}

module.exports = {
  add: function (data, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }

      findDocument(db, 'users', data.username, 'username', function (err, result) {
        if (err !== null) {
          db.close()
          callback(err, result)
          return
        }
        if (result !== null) {
          db.close()
          var error = {message: 'uzytkownik o podanym loginie juz istnieje',code: 409}
          callback(error)
          return
        }

        insertDocument(db, 'users', data, function (err, result) {
          db.close()
          callback(err, result)
        })
      })
    })
  },

  get: function (id, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      findDocument(db, 'users', new ObjectId(id), '_id', function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  },
  delete: function (id, callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      deleteDocument(db, 'users', id, function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  },

  getAll: function (callback) {
    connect(function (err, db) {
      if (err !== null) {
        db.close()
        callback(err)
        return
      }
      getAll(db, 'users', function (err, result) {
        db.close()
        callback(err, result)
      })
    })
  }

}
