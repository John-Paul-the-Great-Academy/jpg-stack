import { db } from "../services/db.server";

export async function setSetting(name: string, value: any) {
  try {
    await db.setting.upsert({
      where: {
        name,
      },
      create: {
        name,
        value: JSON.stringify(value),
      },
      update: {
        value: JSON.stringify(value),
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getSetting<T>(name: string): Promise<T | undefined> {
  try {
    const setting = await db.setting.findFirst({
      where: {
        name,
      },
    });
    return JSON.parse(setting?.value || "") as T;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function getSettings() {
  try {
    const settings = await db.setting.findMany();
    const parsedSettings = settings.map((s) => ({
      ...s,
      value: JSON.parse(s.value),
    }));
    return parsedSettings;
  } catch (error) {
    console.log(error);
    return [];
  }
}
