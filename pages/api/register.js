import { Client } from "@notionhq/client";
import { cors } from "../../utilities/corsPolicy";

const searchQuery = async (uname, password) => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.databases.query({
    database_id: process.env.USER_DB,
    filter: {
      and: [
        {
          property: "uname",
          text: {
            equals: uname,
          },
        },
        {
          property: "password",
          text: {
            equals: password,
          },
        },
      ],
    },
  });

  if (response.results.length) {
    return { success: true, userInfo: response.results[0] };
  } else {
    return { success: false };
  }
};

export default async function handler(req, res) {
  await cors(req, res);
  console.log(req.body);
  if (req.method === "POST") {
    res.status(200).json(await searchQuery(req.body.uname, req.body.password));
  } else {
    res.status(400);
  }
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
