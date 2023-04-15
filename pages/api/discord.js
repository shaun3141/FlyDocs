// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

const DISCORD_PROFILE_PICTURE =
  "https://fly-docs.vercel.app/_next/image?url=%2Fflydocs_logo.png&w=96&q=75";
const DISCORD_USERNAME = "FlyDocs";

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
  // If Post
  if (req.method === "POST") {
    // Extract the message from the request body
    const { message } = req.body;

    // Post a message to Discord Webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    axios.post(webhookUrl, {
      avatar_url: DISCORD_PROFILE_PICTURE,
      username: DISCORD_USERNAME,
      content: message,
    });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }

  res.status(200).json({ status: "Webhook Posted Successfully" });
};
