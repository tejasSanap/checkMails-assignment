import { google } from "googleapis";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const authorization = headers().get("authorization");
  if (!authorization) {
    return NextResponse.json(
      { error: "Authorization header is missing" },
      { status: 400 }
    );
  }

  const accessToken = authorization.split(" ")[1];
  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is missing" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const maxRes = req.nextUrl.searchParams.get("maxResults");

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxRes,
    });
    const messages = response.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const emailResponse = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full",
        });

        const headers = emailResponse.data.payload.headers;
        const subject = headers.find(
          (header) => header.name === "Subject"
        )?.value;
        const mailFrom = headers.find(
          (header) => header.name === "From"
        )?.value;
        const date = headers.find((header) => header.name === "Date")?.value;
        const parts = emailResponse.data.payload.parts;

        let body = "";
        if (parts) {
          const part = parts.find((part) => part.mimeType === "text/plain");
          if (part) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        }
        return {
          id: emailResponse.data.id,
          subject,
          body,
          mailFrom,
          date,
        };
      })
    );

    // console.log("emails", emails);
    return NextResponse.json({ emails });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
