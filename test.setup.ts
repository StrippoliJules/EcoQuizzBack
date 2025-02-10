import mongoose from 'mongoose';

beforeAll(async () => {
    const uri = process.env.MONGODB_TEST_URI;
    if (!uri) {
        throw new Error('MONGODB_TEST_URI is not defined in the environment');
    }
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
});

afterAll(async () => {
    await mongoose.disconnect();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
