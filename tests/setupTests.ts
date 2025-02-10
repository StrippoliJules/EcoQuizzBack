import { app, PORT } from '../src/app';
import mongoose from 'mongoose';

let server: any;

beforeAll(async () => {
    server = app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
});

afterAll(async () => {
    await mongoose.disconnect();
    server.close();
});
