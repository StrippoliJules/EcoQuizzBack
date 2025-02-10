import request from 'supertest';
import User from '../src/models/userModel';
import bcrypt from 'bcryptjs';
import { app } from '../src/app';

describe('User Services', () => {
    let user: any;
    let token: string;

    beforeEach(async () => {
        await User.deleteMany({});

        user = await User.create({
            firstname: 'John',
            lastname: 'Doe',
            role: 'user',
            email: 'john.doe@myges.fr',
            password: await bcrypt.hash('password123', 10),
            isEmailVerified: true,
        });

        const response = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'john.doe@myges.fr', password: 'password123' });

        token = response.body.token;
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should edit user', async () => {
        const response = await request(app)
            .patch('/api/user/edit')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstname: 'Jane', lastname: 'Smith' });

        expect(response.status).toBe(201);
        expect(response.body.firstname).toBe('Jane');
        expect(response.body.lastname).toBe('Smith');
    });

    it('should edit user password', async () => {
        const response = await request(app)
            .patch('/api/user/editPassword')
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: 'password123', newPassword: 'newpassword123' });

        expect(response.status).toBe(201);
        const user = await User.findOne({ email: 'john.doe@myges.fr' });
        const isMatch = await bcrypt.compare('newpassword123', user!.password);
        expect(isMatch).toBe(true);
    });

    it('should delete user', async () => {
        const response = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
        const user = await User.findOne({ email: 'john.doe@myges.fr' });
        expect(user).toBeNull();
    });

    it('should get user by id', async () => {
        const response = await request(app)
            .get(`/api/user/${user._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('john.doe@myges.fr');
    });

    it('should get users', async () => {
        const response = await request(app)
            .get('/api/user/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
});
