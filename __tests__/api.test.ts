import { pushProfileToServer } from "../src/api/sync";

describe('API Sync Logic', () => {
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
});