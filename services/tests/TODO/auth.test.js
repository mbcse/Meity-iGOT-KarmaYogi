const request = require('supertest');


xdescribe('POST /auth/signup', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });

  it('should reject already existing user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('error-msg');

  });
});


var token;

xdescribe('POST /auth/signin', () => {
    it('should authenticate a user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testpassword',
      };
  
      const response = await request(app)
        .post('/auth/signin')
        .send(credentials);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      token = response.body.token;
    });
});


xdescribe('POST /auth/signout', () => {
    it('should invalidate user session', async () => {
  
      const response = await request(app)
        .post('/auth/signout')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
    });
});


xdescribe('POST /auth/forgotpassword', () => {
    it('should send a password reset email', async () => {
      const emailData = {
        email: 'test@example.com',
      };
  
      const response = await request(app)
        .post('/auth/forgotpassword')
        .send(emailData);
  
      expect(response.status).toBe(200);
    });

    it('The account Does Not Exists', async () => {
        const emailData = {
          email: 'test_dne@example.com',
        };
    
        const response = await request(app)
          .post('/auth/forgotpassword')
          .send(emailData);
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error-msg');
      });
});
  