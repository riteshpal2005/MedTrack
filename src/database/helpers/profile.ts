import { database } from "..";
import Profile from "../models/Profile";

export const createProfile = async (name: string): Promise<Profile> => {
  return await database.write(async () => {
    const profileCollection = database.collections.get<Profile>('profile');
    return await profileCollection.create((profile) => {
      profile.name = name;
      profile.createdAt = new Date();
    });
  });
};

export const deleteProfile = async (profileId: string): Promise<void> => {
  return await database.write(async () => {
    const profileCollection = database.collections.get<Profile>('profiles');
    const profile = await profileCollection.find(profileId);
    await profile.markAsDeleted();
  });
};

