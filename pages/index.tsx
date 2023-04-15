import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { Box, Paper, Button, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import ReactMarkdown from "react-markdown";

import styles from "../styles/Home.module.css";

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
      body: JSON.stringify({ question: userInput, history: history }),
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

  return (
    <>
      <Head>
        <title>FlyDocs</title>
      </Head>

      <Grid xs={12} m={12} sx={{ textAlign: "center", margin: 0 }}>
        <h1>Hi team!</h1>
      </Grid>

      <Grid xs={12} md={4}>
        <Paper sx={{ padding: "10px", backgroundColor: "blue" }} elevation={3}>
          <h3>Integrations</h3>
        </Paper>
      </Grid>

      <Grid xs={12} md={8}>
        <Paper sx={{ padding: "10px", backgroundColor: "red" }} elevation={3}>
          <h3>Chat</h3>
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
                        src="/parroticon.png"
                        alt="AI"
                        width="30"
                        height="30"
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
            <div className={styles.cloudform} style={{width: "100%"}}>
              <form onSubmit={handleSubmit}>
                <textarea style={{width: "100%"}}
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
                    loading
                      ? "Waiting for response..."
                      : "Type your question..."
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
            <div className={styles.footer}>
              <p>
                Powered by{" "}
                <a
                  href="https://github.com/hwchase17/langchain"
                  target="_blank"
                >
                  LangChain
                </a>
                . Built by{" "}
                <a href="https://twitter.com/chillzaza_" target="_blank">
                  Zahid
                </a>
                .
              </p>
            </div>
          </div>
        </Paper>
      </Grid>
    </>
  );
}
