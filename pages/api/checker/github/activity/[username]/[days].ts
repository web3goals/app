import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { errorToString } from "utils/converters";

/**
 * Check if the github user has activity without spaces for the specified number of days.
 */
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
    // Check github data activity to define result
    // TODO: Implement checking
    const result = true;
    // Add data to response
    response.status(200).json({
      result: result,
      username: username,
      days: days,
    });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: errorToString(error) });
  }
}
