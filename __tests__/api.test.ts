import { pushProfileToServer } from "../src/api/sync";
import { api } from "../src/api/axios";

describe('API Sync Logic', () => {

  beforeAll( async () => {
    const res = await api.post('/auth/login', { apiKey: 'MEDTRACK_SECURE_SYNC_123' });
    const token = res.data.token;

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  });

  it('should succesfully push a new profile to the local Postgres backend', async () => {
    const randomId = `test_profile_${Math.floor(Math.random() * 10000)}`;

    const result = await pushProfileToServer({
      id: randomId,
      name: 'Jest PC Test User',
      createdAt: Date.now()
    });

    expect(result.name).toBe('Jest PC Test User');
    expect(result.id).toBe(randomId);
  });

  it('should instantly block a malicious payload (Zod Security Firewall)', async () => {
    expect.assertions(1);

    try {
      await pushProfileToServer({
        id: 'hacker_123',
        name: '',
        createdAt: Date.now()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });
});