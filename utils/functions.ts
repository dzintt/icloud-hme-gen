import { promises as fs } from "fs";

export const logEmailToFile = async (email: string): Promise<void> => {
  try {
    await fs.appendFile("emails.txt", email + "\n");
  } catch (err) {
    console.log(err);
  }
};

export const sleepMs = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
