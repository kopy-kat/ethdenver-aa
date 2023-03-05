import type { NextApiRequest, NextApiResponse } from "next";
import { Client, LogLevel } from "@notionhq/client";
const { NOTION_API_TOKEN, NOTION_DATABASE_ID } = process.env;

async function addToWaitlist(email:string) {
  const notion = new Client({
    auth: NOTION_API_TOKEN,
    logLevel: LogLevel.DEBUG,
  });

  await notion.pages.create({
    parent: {
      database_id: NOTION_DATABASE_ID,
    },
    properties: {
      Email: {
        rich_text: [
          {
            text: {
              content: email,
            },
          },
        ],
      },
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = JSON.parse(req.body);
  await addToWaitlist(body.email);
  res.status(200).end();
}
