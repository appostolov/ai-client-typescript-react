import request from 'supertest';
import app from '../index'; // Your Express app instance

describe('POST /chat/select', () => {
  it('should return an error and status 400', async () => {
    const response = await request(app).post('/chat/select');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe( "Invalid user input" );
  });
});