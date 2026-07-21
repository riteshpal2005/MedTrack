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