import { addMedicine } from "../src/database/helpers/medicine";

jest.mock('../src/database', () => {
  return {
    __esModule: true,
    database: {
      write: jest.fn(async (callback) => callback()),
      collections: {
        get: jest.fn(() => ({
          find: jest.fn(() => ({
            id: 'mock-profile-id'
          })),
          create: jest.fn((callback) => {
            const medicine: any = {
              profile: {
                set: jest.fn()
              }
            };
            callback(medicine);
            return medicine;
          }),
        })),
      },
    },
  };
});

describe('Medicine Business Logic', () => {
  it('should format and link a new medicine to a profile', async () => {
    const medicine = await addMedicine({
      profileId: 'mock-profile-id',
      name: 'Aspirin',
      dosage: '10mg',
      inventoryCount: 30,
      warningLevel: 5,
      schedule: { type: 'daily' }
    });

    expect(medicine.name).toBe('Aspirin');
    expect(medicine.inventoryCount).toBe(30);
    expect(medicine.isArchived).toBe(false);
  });
});