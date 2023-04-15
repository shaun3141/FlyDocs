// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  // If a post request, extract, to, from, and body params
  if (req.method === "POST") {
    const { to, from, body } = req.body;
    // Make a request out to Twilio to send the message

    client.messages
      .create({
        body: body,
        from: from,
        to: to,
      })
      .then((message) => {
        console.log(message.sid);
        res.status(200).json({ message: "Message sent!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error sending message" });
      });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
};
