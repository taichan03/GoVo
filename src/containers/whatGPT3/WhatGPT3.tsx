import React from "react";
import { useState } from "react";
import "./whatGPT3.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useEffect } from "react";

const API_KEY = "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";

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Create a voting plan based on the following zip code, and list each candidate party affiliation: {zipcode}",
};

interface WhatGPT3Props {
  zipCode: string;
}

function WhatGPT3({ zipCode }: WhatGPT3Props) {
  type Message = {
    message: string;
    direction: string;
    sender: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const sendMessageToChatGPT = async () => {
      const newMessage = {
        message: `My zipcode is ${zipCode}.`,
        direction: "outgoing",
        sender: "user",
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      setIsTyping(true);
      await processMessageToChatGPT(newMessages);
    };

    sendMessageToChatGPT();
  }, [zipCode]);

  const handleSend = async (message: string) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: Message[]) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <>
      <div className="Body">
        <MainContainer className="ChatContainer">
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message Here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}

export default WhatGPT3;
