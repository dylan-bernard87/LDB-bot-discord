const { MongoClient, ServerApiVersion } = require('mongodb');
const urlBd = process.env.DATABASE_URL;

const mongoCustomClient = new MongoClient(urlBd, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

module.exports = { mongoCustomClient }
