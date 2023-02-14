import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { errorToString } from "utils/converters";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // Get request params
    const { username, days } = request.query;
    // Load github data
    const githubResponse = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (githubResponse.data.errors) {
      throw new Error(JSON.stringify(githubResponse.data.errors));
    }
    const githubData = githubResponse.data;
    // Check github data activity for defined days
    // TODO: Implement
    const result = false;
    // Add data to response
    response.status(200).json({
      result: result,
      username: username,
      days: days,
      githubData: githubData,
    });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: errorToString(error) });
  }
}
