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

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Create a voting plan based on the following zip code, and list each candidate party affiliation: {zipcode}",
};

interface WhatGPT3Props {
  zipCode: string;
  onZipCodeAndAPIKeySubmit?: (zipCode: string) => void;
}

function WhatGPT3({ zipCode, onZipCodeAndAPIKeySubmit }: WhatGPT3Props) {
  interface Message {
    message: string;
    sender: string;
    position?: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
  }

  const [messages, setMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);

  let hasSentMessage = false;
  // console.log("WhatGPT3");

  useEffect(() => {
    // console.log("useEffect");
    if (zipCode !== "" && !hasSentMessage) {
      sendMessageToChatGPT();
      hasSentMessage = true;
    }
  }, [zipCode, hasSentMessage]);

  const sendMessageToChatGPT = async () => {
    const newMessage = {
      message: `My zipcode is ${zipCode}.`,
      direction: "outgoing",
      sender: "user",
    };
    // console.log("sendMessageToChatGPT");
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const handleSendMessage = async (message: string) => {
    // console.log("1");
    const newMessage = {
      message: message,
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
      // model: "gpt-3.5-turbo",
      prompt: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    console.log("API Request Body:", apiRequestBody);

    await fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        // Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // console.log("API Response:", data);

        setMessages([
          ...chatMessages,
          {
            message: data.bot.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });

    // console.log("END", apiRequestBody);
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
                return (
                  <Message
                    key={i}
                    model={{
                      ...message,
                      direction:
                        message.sender === "user" ? "outgoing" : "incoming",
                      position: i === messages.length - 1 ? "last" : "normal",
                    }}
                  />
                );
              })}
            </MessageList>
            <MessageInput
              placeholder="Type message Here"
              onSend={handleSendMessage}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}

export default WhatGPT3;
