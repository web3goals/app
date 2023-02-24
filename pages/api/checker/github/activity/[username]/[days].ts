import { NextApiRequest, NextApiResponse } from "next";
import { errorToString } from "utils/converters";

/**
 * Check if the github user has activity without spaces for the specified number of days.
 *
 * TODO: Implement a real check
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // Define data
    const { username, days } = request.query;
    const isSuccess = true;
    // Add result to response
    response.status(200).json({
      isSuccess: isSuccess,
      username: username,
      days: days,
    });
  } catch (error: any) {
    console.error(error);
    response.status(500).json({ error: errorToString(error) });
  }
}
