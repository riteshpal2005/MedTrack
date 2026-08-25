import { addMedicine, updateInventory, deleteMedicine } from '../../src/database/helpers/medicine';
import { database } from '../../src/database';
import { NotificationService } from '../../src/services/NotificationService';

jest.mock('../../src/services/NotificationService', () => ({
  NotificationService: {
    scheduleMedicineReminder: jest.fn(),
    createChannel: jest.fn(),
    cancelMedicineReminder: jest.fn(),
  },
}));

describe('Medicine Helper Business Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('addMedicine should create a medicine and schedule a reminder', async () => {
    const params = {
      profileId: '1',
      name: 'Aspirin',
      dosage: '1 pill',
      inventoryCount: 10,
      warningLevel: 2,
      schedule: { time: '10:00' },
    };

    const mockProfile = { set: jest.fn() };
    const mockMedicine = {
      profile: mockProfile,
      name: '',
      dosage: '',
      inventoryCount: 0,
      warningLevel: 0,
      schedule: null,
      isArchived: false,
      createdAt: new Date(),
      id: 'med-id-1',
    };

    const mockCreate = jest.fn(async (cb) => {
      await cb(mockMedicine);
      return mockMedicine;
    });

    const mockFind = jest.fn().mockResolvedValue({ id: '1' });
    
    (database.collections.get as jest.Mock).mockImplementation((table) => {
      if (table === 'medicines') {
        return { create: mockCreate };
      }
      if (table === 'profiles') {
        return { find: mockFind };
      }
    });

    const result = await addMedicine(params);

    expect(result).toBe(mockMedicine);
    expect(mockMedicine.name).toBe('Aspirin');
    expect(mockMedicine.inventoryCount).toBe(10);
    expect(NotificationService.scheduleMedicineReminder).toHaveBeenCalledWith('med-id-1', 'Aspirin', '10:00');
  });

  it('updateInventory should subtract amount but not below zero', async () => {
    const mockMedicine = {
      id: 'med-1',
      inventoryCount: 5,
      update: jest.fn(async (cb) => cb(mockMedicine)),
    };
    
    (database.collections.get as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue(mockMedicine),
    });

    await updateInventory('med-1', 2);
    expect(mockMedicine.inventoryCount).toBe(3);

    await updateInventory('med-1', 5);
    expect(mockMedicine.inventoryCount).toBe(0);
  });
});
