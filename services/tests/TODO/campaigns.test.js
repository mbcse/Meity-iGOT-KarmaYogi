const request = require('supertest'); 

xdescribe('POST /create-campaign', () => {
  it('should create a campaign with valid parameters', async () => {

    const campaignData = {
      campaignName: 'My Awesome Campaign',
      subcampaigns: [
        {
          campaignTitle: 'Nice',
          campaignType: ['sms', 'email'],
          datetime: '2024-07-10T14:30:00Z', // ISO 8601 format
          template: 'Hello {{username}}, your discount code is {{code}}!',
        },
        {
          campaignTitle: 'Nice part 2',
          campaignType: ['whatsapp'],
          datetime: '2024-07-10T14:30:00Z', // ISO 8601 format
          template: 'Hello {{username}}, your discount code is {{code}}!',
        },
      ],
    };

    const response = await request(app)
      .post('/create-campaign')
      .send(campaignData);

    expect(response.status).toBe(201); 
    expect(response.body).toHaveProperty('campaignId');
    expect(response.body).toHaveProperty('success'); 
  });

  it('Empty campaign name', async () => {

    const campaignData = {
        campaignName: '',
        subcampaigns: [
          {
            campaignTitle: 'Nice',
            campaignType: ['sms', 'email'],
            datetime: '2024-07-10T14:30:00Z', // ISO 8601 format
            template: 'Hello {{username}}, your discount code is {{code}}!',
          },
          {
            campaignTitle: 'Nice part 2',
            campaignType: ['whatsapp'],
            datetime: '2024-07-10T14:30:00Z', // ISO 8601 format
            template: 'Hello {{username}}, your discount code is {{code}}!',
          },
        ],
      };

    const response = await request(app)
      .post('/create-campaign')
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  it('Empty sub-campaign , when the campaign will be saved as Draft', async () => {

    const campaignData = {
        campaignName: ''
      };

    const response = await request(app)
      .post('/create-campaign')
      .send(invalidData);

    expect(response.body).toHaveProperty('campaignId');
    expect(response.body).toHaveProperty('error-msg');
  });
});
