import request from 'supertest';
import { app } from '../src/app';
import User from '../src/models/userModel';
import Locker from '../src/models/lockerModel';
import Localisation from '../src/models/localisationModel';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

describe('Locker Services', () => {
    let adminUser: any;
    let normalUser: any;
    let adminToken: string;
    let normalToken: string;
    let locationId: mongoose.Types.ObjectId;

    beforeAll(async () => {
        await User.deleteMany({});
        await Locker.deleteMany({});
        await Localisation.deleteMany({});

        adminUser = await User.create({
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin.user@myges.fr',
            password: await bcrypt.hash('adminpassword', 10),
            role: 'admin',
            isEmailVerified: true,
        });

        normalUser = await User.create({
            firstname: 'Normal',
            lastname: 'User',
            email: 'normal.user@myges.fr',
            password: await bcrypt.hash('userpassword', 10),
            role: 'user',
            isEmailVerified: true,
        });

        const location = await Localisation.create({
            name: 'Location 1',
            accessibility: true,
        });
        locationId = location._id as mongoose.Types.ObjectId;

        const adminResponse = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'admin.user@myges.fr', password: 'adminpassword' });
        adminToken = adminResponse.body.token;

        const normalResponse = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'normal.user@myges.fr', password: 'userpassword' });
        normalToken = normalResponse.body.token;
    });

    afterEach(async () => {
        await Locker.deleteMany({});
    });

    it('should create a new locker with admin user', async () => {
        const response = await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        expect(response.status).toBe(201);
        expect(response.body.number).toBe(1);
        expect(response.body.localisation).toEqual(locationId.toString());
        expect(response.body.status).toBe('available');
    });

    it('should not create a new locker with normal user', async () => {
        const response = await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${normalToken}`)
            .send({
                number: 2,
                localisation: locationId.toString(),
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('L\'utilisateur n\'est pas administrateur');
    });

    it('should not create a new locker if it already exists', async () => {
        await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        const response = await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Le casier existe déjà');
    });

    it('should get all lockers', async () => {
        await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 2,
                localisation: locationId.toString(),
            });

        const response = await request(app)
            .get('/api/locker/')
            .set('Authorization', `Bearer ${adminToken}`);

        const lockers: any[] = response.body;

        expect(response.status).toBe(200);
        expect(lockers.length).toBe(2);
        expect(lockers.some(locker => locker.number === 1)).toBe(true);
        expect(lockers.some(locker => locker.number === 2)).toBe(true);
    });

    it('should get admin lockers', async () => {
        await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 2,
                localisation: locationId.toString(),
            });

        const response = await request(app)
            .get('/api/locker/adminLockers')
            .set('Authorization', `Bearer ${adminToken}`);

        const lockers: any[] = response.body;

        expect(response.status).toBe(200);
        expect(lockers.length).toBe(2);
        expect(lockers.some(locker => locker.number === 1)).toBe(true);
        expect(lockers.some(locker => locker.number === 2)).toBe(true);
    });

    it('should change locker status by ID with admin user', async () => {
        const lockerResponse = await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        const lockerId: mongoose.Types.ObjectId = lockerResponse.body._id as mongoose.Types.ObjectId;

        const response = await request(app)
            .patch('/api/locker/changeStatus')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                id: lockerId.toString(),
                status: 'occupied',
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('occupied');
    });

    it('should not change locker status by ID with normal user', async () => {
        const lockerResponse = await request(app)
            .post('/api/locker/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                number: 1,
                localisation: locationId.toString(),
            });

        const lockerId: mongoose.Types.ObjectId = lockerResponse.body._id as mongoose.Types.ObjectId;

        const response = await request(app)
            .patch('/api/locker/changeStatus')
            .set('Authorization', `Bearer ${normalToken}`)
            .send({
                id: lockerId.toString(),
                status: 'occupied',
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('L\'utilisateur n\'est pas administrateur');
    });

    it('should not change locker status if locker does not exist', async () => {
        const response = await request(app)
            .patch('/api/locker/changeStatus')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                id: new mongoose.Types.ObjectId().toString(),
                status: 'occupied',
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Le casier n\'existe pas');
    });
});
