import readline from "readline";
import { Cookie, EmailInfo } from "./utils/interfaces";
import { iCloudHME } from "./modules/icloud";
import { sleepMs, logEmailToFile } from "./utils/functions";
import fs from "fs";

const cookies: Cookie[] = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));
const iCloud = new iCloudHME(cookies);

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const generateEmails = async (amount: number) => {
  let counter = 0;
  while (counter < amount) {
    console.log(`[${counter}/${amount}] Generating email...`);

    const email = await iCloud.generateEmail();
    if (!email) {
      console.log(`[${counter}/${amount}] Failed to generate email.`);
      continue;
    }

    const claimResult = await iCloud.claimEmail(email);
    if (!claimResult.success) {
      console.log(
        `[${counter}/${amount}] Failed to claim email ${email}, reason: ${claimResult.error.errorMessage}`
      );

      if (claimResult.error.errorCode === "-41015") {
        console.log(
          `[${counter}/${amount}] Reached limit, waiting 30 minutes for reset...`
        );
        await sleepMs(30 * 60 * 1000);
      }
      continue;
    }

    await logEmailToFile(email);
    counter++;
    console.log(`[${counter}/${amount}] Generated email ${email}`);
  }
};

const listEmails = async () => {
  const emails = await iCloud.listEmails();
  const activeEmails = emails.result.hmeEmails
    .filter((email: EmailInfo) => email.isActive)
    .map((email: EmailInfo) => email.hme);
  for (const email of activeEmails) {
    console.log(email);
  }
};

prompt.question(
  "[?] What would you like to do? (1. Generate Emails, 2. List All Emails) ",
  async (answer) => {
    switch (answer) {
      case "1":
        prompt.question(
          "[?] How many emails do you want to generate? ",
          async (amount) => {
            await generateEmails(parseInt(amount));
            prompt.close();
          }
        );
        break;
      case "2":
        await listEmails();
        prompt.close();
        break;
      default:
        console.log("Invalid option");
        prompt.close();
    }
  }
);
