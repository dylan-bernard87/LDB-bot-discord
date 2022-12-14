import { MongoClient, ServerApiVersion } from 'mongodb';

const urlBd = process.env.DATABASE_URL;

export const dataBaseName = process.env.DATABASE_NAME;
export const mongoCustomClient = new MongoClient(urlBd, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});
