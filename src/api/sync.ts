import { api } from "./axios";

export const pushProfileToServer = async (profileData: { id: string; name: string; createdAt: number }) => {
  try {
    const response = await api.post('/profiles', {
      id: profileData.id,
      name: profileData.name,
      created_at: profileData.createdAt
    });
    return response.data;
  } catch (e) {
    console.error('Failed to sync profile to server:', e)
    throw e;
  }
};

export const pushMedicineToServer = async (medicineData: { id: string; profileId: string; name: string; dosage: string; inventoryCount: number; warningLevel: number; schedule: string; isArchived: boolean; createdAt: number }) => {
  try {
    const response = await api.post('/medicines', {
      id: medicineData.id,
      profile_id: medicineData.profileId,
      name: medicineData.name,
      dosage: medicineData.dosage,
      inventory_count: medicineData.inventoryCount,
      warning_level: medicineData.warningLevel,
      schedule: medicineData.schedule,
      is_archived: medicineData.isArchived,
      created_at: medicineData.createdAt
    });
    return response.data;
  } catch (e) {
    console.error('Failed to sync medicine:', e)
    throw e;
  }
};

export const pushHistoryLogToServer = async (logData: { id: string; medicineId: string; profileId: string; timestamp: number; scheduledTime: string; status: string }) => {
  try {
    const response = await api.post('/history', {
      id: logData.id,
      medicine_id: logData.medicineId,
      profile_id: logData.profileId,
      timestamp: logData.timestamp,
      scheduled_time: logData.scheduledTime,
      status: logData.status
    });
    return response.data;
  } catch (e) {
    console.error('Failed to sync history log:', e)
    throw e;
  }
};

export const pushHealthRecordToServer = async (recordData: { id: string; profileId: string; type: string; notes: string; createdAt: number }) => {
  try {
    const response = await api.post('/health-records', {
      id: recordData.id,
      profile_id: recordData.profileId,
      type: recordData.type,
      notes: recordData.notes,
      created_at: recordData.createdAt
    });
    return response.data;
  } catch (e) {
    console.error('Failed to sync health record:', e)
    throw e;
  }
};