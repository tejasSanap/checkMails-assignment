import { NextResponse } from "next/server";

import OpenAI from "openai";
export async function POST(req, res) {
  try {
    const data = await req.json();
    if (!data || !data.emails || !data.apiKey) {
      return NextResponse.json(
        { error: "Emails and API key are required" },
        { status: 400 }
      );
    }
    const openai = new OpenAI({
      apiKey: data.apiKey,
    });

    const classifications = await Promise.all(
      data.emails.map(async (email) => {
        const truncatedEmail =
          email.body.length > 2000 ? email.body.slice(0, 2000) : email.body;
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `label the following email into one of these categories: 
      Important: Emails that are personal or work-related and require immediate attention.
Promotions: Emails related to sales, discounts, and marketing campaigns.
Social: Emails from social networks, friends, and family.
Marketing: Emails related to marketing, newsletters, and notifications.
Spam: Unwanted or unsolicited emails.
General: If none of the above are matched, use General

    Respond with only the category name and nothing else. If you can't classify due to input not provided, respond with 'General'.\n\nEmail:\n\n${truncatedEmail}. dont give any explanation, i am only expecting single word reponse.`,
            },
          ],
        });

        const classification = completion.choices[0].message.content;

        return {
          id: email.id,
          classification,
        };
      })
    );

    return NextResponse.json({ classifications });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
