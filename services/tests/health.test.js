const axios = require('axios'); 

describe('GET /health', () => {
  it('should return "healthy"', async () => {
    const response = await axios.get('http://localhost:3000/health'); 

    expect(response.status).toBe(200);
    expect(response.data).toBe('healthy'); 
  });
});
