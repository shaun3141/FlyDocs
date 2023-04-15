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

  const [currentIntegration, setCurrentIntegration] = useState(null);
  const [integrations, setIntegrations] = useState([
    {
      name: "Google Calendar",
      description: "Schedule meetings with your team",
      image: "/GoogleCal.png",
      link: "https://www.google.com/calendar",
    },
    {
      name: "Intercom",
      description: "Chat with your customers",
      image: "/intercom.png",
      link: "https://www.intercom.com/",
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

    // Send user question and history to API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userInput,
        history: history,
        currentIntegration: currentIntegration,
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
      { message: data.result.success, type: "apiMessage" },
    ]);
    setLoading(false);
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

  const Integration = function (props: { integration: any }) {
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
          onClick={() => setCurrentIntegration(props.integration.name)}
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
            return <Integration key={idx} integration={integration} />;
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
                type="text"
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
