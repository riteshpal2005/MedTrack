import { createProfile } from "../src/database/helpers/profile";

jest.mock('../src/database', () => {
  return {
    __esModule: true,
    database: {
      write: jest.fn(async (callback) => callback()),
      collections: {
        get: jest.fn(() => ({
          create: jest.fn((callback) => {
            const profile: any = {};
            callback(profile);
            return profile;
          }),
        })),
      },
    },
  };
});

describe('Profile Business Logic', () => {
  it('should successfully format and create a new profile with the given name', async () => {
    const profile = await createProfile('Test User');
    expect(profile.name).toBe('Test User');

    expect(profile.createdAt).toBeDefined();
  });
});