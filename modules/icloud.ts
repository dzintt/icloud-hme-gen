import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Cookie } from "../utils/interfaces";

export class iCloudHME {
  private session: AxiosInstance;

  constructor(cookies: Cookie[]) {
    this.session = axios.create({
      baseURL: "https://p123-maildomainws.icloud.com/v2/hme",
      responseType: "json",
      validateStatus: null,
      headers: {
        Host: "p123-maildomainws.icloud.com",
        Origin: "https://www.icloud.com",
        Referer: "https://www.icloud.com/",
        "Sec-Ch-Ua":
          '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        Cookie: cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join(";"),
      },
      params: {
        clientBuildNumber: "2420Hotfix12",
        clientMasteringNumber: "2420Hotfix12",
        clientId: "",
        dsid: "",
      },
    });
  }

  public async generateEmail(): Promise<string> {
    const response: AxiosResponse = await this.session.post("/generate", {
      langCode: "en-us",
    });
    return response.data.result.hme;
  }

  public async claimEmail(email: string) {
    const response = await this.session.post("/reserve", {
      hme: email,
      label: "DZ GEN",
      note: "",
    });
    return response.data;
  }

  public async listEmails() {
    const response = await this.session.get("/list");
    return response.data;
  }
}
