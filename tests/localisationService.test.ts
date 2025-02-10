import request from 'supertest';
import { app } from '../src/app';
import User from '../src/models/userModel';
import Localisation, { ILocalisation } from '../src/models/localisationModel';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

describe('Localisation Services', () => {
    let adminUser: any;
    let normalUser: any;
    let adminToken: string;
    let normalToken: string;

    beforeAll(async () => {
        await User.deleteMany({});

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
        await Localisation.deleteMany({});
    });

    it('should create a new localisation with admin user', async () => {
        const response = await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'New Location',
                accessibility: true,
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('New Location');
        expect(response.body.accessibility).toBe(true);
    });

    it('should not create a new localisation with normal user', async () => {
        const response = await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${normalToken}`)
            .send({
                name: 'Another Location',
                accessibility: false,
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('L\'utilisateur n\'est pas administrateur');
    });

    it('should not create a new localisation if it already exists', async () => {
        await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Duplicate Location',
                accessibility: true,
            });

        const response = await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Duplicate Location',
                accessibility: false,
            });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('La localisation existe déjà');
    });

    it('should get all localisations', async () => {
        await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Location 1',
                accessibility: true,
            });

        await request(app)
            .post('/api/localisation/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Location 2',
                accessibility: false,
            });

        const response = await request(app)
            .get('/api/localisation/')
            .set('Authorization', `Bearer ${adminToken}`);

        const localisations: ILocalisation[] = response.body;

        expect(response.status).toBe(200);
        expect(localisations.length).toBe(2);
        expect(localisations.some(loc => loc.name === 'Location 1')).toBe(true);
        expect(localisations.some(loc => loc.name === 'Location 2')).toBe(true);
    });
});
