const axios = require('axios');
require('dotenv').config()


describe('POST /auth/signup',  () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await axios.post(`http://localhost:${process.env.PORT}/auth/signup`, userData);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('type', 'success');
    expect(response.data).toHaveProperty('message');
  });

  it('should reject already existing user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await axios.post(`http://localhost:${process.env.PORT}/auth/signup`, userData);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('type', 'error');
    expect(response.data).toHaveProperty('message');
  });
});

let token;

describe('POST /auth/login', () => {
  it('should authenticate a user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword',
    }; 

    const response = await axios.post(`http://localhost:${process.env.PORT}/auth/login`, credentials);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('type', 'success');
    expect(response.data).toHaveProperty('message');
    token = response.data.message;
  });
});

describe('POST /auth/signout', () => {
  it('should invalidate user session', async () => {
    const response = await axios.post(
      `http://localhost:${process.env.PORT}/auth/signout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    expect(response.status).toBe(200);
  });
});

describe('POST /auth/forgotpassword', () => {
  it('should send a password reset email', async () => {
    const emailData = {
      email: 'test@example.com',
    };

    const response = await axios.post(`http://localhost:${process.env.PORT}/auth/forgotpassword`, emailData);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('type', 'success');
    expect(response.data).toHaveProperty('message', 'Password reset email sent.');
  });

  it('should return error if the account does not exist', async () => {
    const emailData = {
      email: 'test_dne@example.com',
    };

    const response = await axios.post(`http://localhost:${process.env.PORT}/auth/forgotpassword`, emailData);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('type', 'user-error');
    expect(response.data).toHaveProperty('message', 'The user does not exist.');
  });
});
