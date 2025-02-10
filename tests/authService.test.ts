import request from 'supertest';
import User from '../src/models/userModel';
import { app } from '../src/app';

describe('Auth Services', () => {
    let user: any;

    beforeEach(async () => {
        user = await User.create({
            firstname: 'John',
            lastname: 'Doe',
            role: 'user',
            email: 'john.doe@myges.fr',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
            isEmailVerified: true
        });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@myges.fr',
                password: 'Password123',
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe('jane.doe@myges.fr');
    });

    it('should not register a user with non-GES email', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@gmail.com',
                password: 'Password123',
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("L'email doit être un email GES");
    });

    it('should not register an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@myges.fr',
                password: 'Password123',
            });
        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Utilisateur déjà existant');
    });

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'john.doe@myges.fr',
                password: 'Password123',
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should not login a non-registered user', async () => {
        const response = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'nonexistent@myges.fr',
                password: 'Password123',
            });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Utilisateur non trouvé');
    });

    it('should not login with invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'john.doe@myges.fr',
                password: 'wrongpassword',
            });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Identifiants invalides');
    });

    it('should send verification code', async () => {
        const response = await request(app)
            .post('/api/auth/sendCode')
            .send({
                email: 'john.doe@myges.fr',
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Code envoyé');
    });

    it('should verify code and validate email', async () => {
        await request(app)
            .post('/api/auth/sendCode')
            .send({
                email: 'john.doe@myges.fr',
            });

        const user = await User.findOne({ email: 'john.doe@myges.fr' });

        const response = await request(app)
            .post('/api/auth/checkCode')
            .send({
                email: 'john.doe@myges.fr',
                code: user!.verificationCode,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.isEmailVerified).toBe(true);
    });
});
