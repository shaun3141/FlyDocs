import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import Nango from "@nangohq/frontend";
import { Nango as NangoNode } from "@nangohq/node";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Home.module.css";
import styled from "@emotion/styled";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hi there! How can I help?",
      type: "apiMessage",
    },
  ]);

  const [currentResult, setCurrentResult] = useState(null);
  const [currentIntegration, setCurrentIntegration] = useState(null);
  const [currentUserToken, setCurrentUserToken] = useState(null);
  const [integrations, setIntegrations] = useState([
    {
      name: "Twilio",
      integrationKey: "twilio",
      description: "send an sms",
      image: "/twilio.png",
      link: "https://www.twilio.com/",
      token: "",
    },
    {
      name: "Spotify",
      integrationKey: "spotify",
      description: "Listen to music",
      image: "/spotify.png",
      link: "https://www.spotify.com/",
      token: "",
      useNango: true,
    },
    {
      name: "Github",
      integrationKey: "github",
      description: "Code hosting, version control and collaboration",
      image: "/github_white.png",
      link: "https://www.github.com/",
      token: "",
      useNango: true,
    },
    {
      name: "Google Calendar",
      integrationKey: "google-calendar",
      description: "Schedule meetings with your team",
      image: "/GoogleCal.png",
      link: "https://www.google.com/calendar",
      token: "",
      useNango: true,
    },
    {
      name: "Intercom",
      integrationKey: "intercom",
      description: "Chat with your customers",
      image: "/intercom.png",
      link: "https://www.intercom.com/",
      token: "",
      useNango: false,
    },
    {
      name: "Twilio",
      integrationKey: "twilio",
      description: "Send a text message",
      image: "/twilio.svg",
      link: "https://www.intercom.com/",
      token: "",
      useNango: false,
    },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: "Oops! There seems to be an error. Please try again.",
        type: "apiMessage",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userInput, type: "userMessage" },
    ]);

    let access_token;
    if (currentIntegration.name === "intercom") {
      // Somehting
      access_token = "";
    } else if (currentIntegration.name === "twilio") {
      // Something
      access_token = `${process.env.TWILIO_API_KEY}`;
    } else {
      const nango = new NangoNode({
        secretKey: "4a7f6f02-c9aa-4b14-b644-c833ec07bbfd",
      });

      access_token = await nango.getToken(
        currentResult.providerConfigKey,
        currentResult.connectionId
      );
      access_token = `Bearer ${access_token}`;
    }

    // Send user question and history to API
    // currently fails because of github token max length issue :/
    const response = await fetch("http://192.168.0.101:81/run_command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: userInput,
        token: access_token,
        service: currentIntegration.integrationKey,
      }),
    });

    if (!response.ok) {
      handleError();
      return;
    }

    // Reset user input
    setUserInput("");
    const data = await response.json();
    if (data.result.error === "Unauthorized") {
      handleError();
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { message: data.result, type: "apiMessage" },
    ]);
    setLoading(false);
  };

  const triggerAuth = async (integration) => {
    if (integration.useNango === false) {
      setCurrentIntegration(integration);
      return;
    }

    let nango = new Nango({
      publicKey: "defb0e4d-fca5-4e26-b7d9-d5b59dd72d66",
    });
    nango
      .auth(integration.integrationKey, "test-connection-id")
      .then(
        async (result: { providerConfigKey: string; connectionId: string }) => {
          setCurrentIntegration(integration);
          setCurrentResult(result);
        }
      )
      .catch((err: { message: string; type: string }) => {
        console.error(
          `There was an error in the OAuth flow for integration: ${err.message}`
        );
      });
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([
        [
          messages[messages.length - 2].message,
          messages[messages.length - 1].message,
        ],
      ]);
    }
  }, [messages]);

  const ContentWrapper = styled.div`
    padding: 10px;
    font-weight: bold;
    background-color: #000000;
    color: #ececf1;
    border-radius: 10px;
  `;

  const Integration = function (props: {
    integration: any;
    triggerAuth: (integration: any) => void;
  }) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderTop: "2px solid white",
          marginTop: "10px",
          paddingTop: "10px",
        }}
      >
        <Image
          src={props.integration.image}
          width={50}
          height={50}
          alt={props.integration.name}
        />
        <Button
          variant="contained"
          sx={{ marginLeft: "15px" }}
          onClick={() => triggerAuth(props.integration)}
        >
          {props.integration.name}
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Head>
        <title>FlyDocs</title>
      </Head>

      <Grid xs={12} md={4}>
        <ContentWrapper>
          <Typography variant="h5">Integrations</Typography>
          {integrations.map((integration, idx) => {
            return (
              <Integration
                key={idx}
                integration={integration}
                triggerAuth={triggerAuth}
              />
            );
          })}
        </ContentWrapper>
      </Grid>

      <Grid xs={12} md={8}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.type === "userMessage" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.type === "apiMessage"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  {/* Display the correct icon depending on the message type */}
                  {message.type === "apiMessage" ? (
                    <Image
                      src="/flydocs_logo.png"
                      alt="AI"
                      width="45"
                      height="45"
                      className={styles.boticon}
                      priority={true}
                    />
                  ) : (
                    <Image
                      src="/usericon.png"
                      alt="Me"
                      width="30"
                      height="30"
                      className={styles.usericon}
                      priority={true}
                    />
                  )}
                  <div className={styles.markdownanswer}>
                    {/* Messages are being rendered in Markdown format */}
                    <ReactMarkdown linkTarget={"_blank"}>
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform} style={{ width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <textarea
                style={{ width: "100%" }}
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{" "}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </Grid>
    </>
  );
}
