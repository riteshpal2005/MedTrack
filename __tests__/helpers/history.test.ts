import { logMedicineAction } from '../../src/database/helpers/history';
import { database } from '../../src/database';

describe('History Helper Business Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logMedicineAction should create a history log', async () => {
    const mockMedicine = { set: jest.fn() };
    const mockProfile = { set: jest.fn() };
    
    const mockLog = {
      medicine: mockMedicine,
      profile: mockProfile,
      scheduledTime: '',
      status: '',
      timestamp: new Date(),
    };

    const mockCreate = jest.fn(async (cb) => {
      await cb(mockLog);
      return mockLog;
    });

    const mockFindMed = jest.fn().mockResolvedValue({ id: 'med-1' });
    const mockFindProf = jest.fn().mockResolvedValue({ id: 'prof-1' });

    (database.collections.get as jest.Mock).mockImplementation((table) => {
      if (table === 'history_logs') {
        return { create: mockCreate };
      }
      if (table === 'medicines') {
        return { find: mockFindMed };
      }
      if (table === 'profiles') {
        return { find: mockFindProf };
      }
    });

    const result = await logMedicineAction('med-1', 'prof-1', '08:00', 'taken');

    expect(result).toBe(mockLog);
    expect(mockLog.status).toBe('taken');
    expect(mockLog.scheduledTime).toBe('08:00');
    expect(mockMedicine.set).toHaveBeenCalled();
  });
});
