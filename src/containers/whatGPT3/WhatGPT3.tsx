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
import axios from "axios";

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

interface ChatLogItem {
  type: string;
  message: string;
}

interface ChatDropDownProps {
  showChat: boolean;
  handleChat: () => void;
}

interface MergedProps extends ChatDropDownProps, WhatGPT3Props {}

const WhatGPT3: React.FC<MergedProps> = ({
  zipCode,
  onZipCodeAndAPIKeySubmit,
}) => {
  interface Message {
    message: string;
    sender: string;
    position?: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<ChatLogItem[]>([]); // Specify the type as ChatLogItem[]
  const [isTyping, setIsTyping] = useState(false);

  let hasSentMessage = false;

  useEffect(() => {
    const chatContainer = document.getElementById("chat_container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatLog]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newMessage = {
      message: inputValue,
      type: "user",
    };

    const newMessages = [...chatLog, newMessage];

    setChatLog(newMessages);

    sendMessage(newMessages);

    setInputValue("");
  };
  const sendMessage = async (message: ChatLogItem[]) => {
    const url = "http://localhost:5000/sixer/";

    const prompt = message.map((messageObject) => {
      let role = messageObject.type === "user" ? "user" : "assistant";
      return { role: role, content: messageObject.message };
    });
    console.log(prompt);
    const apiRequestBody = {
      prompt: prompt,
    };
    console.log(apiRequestBody);
    // setIsLoading(true);

    axios
      .post(url, apiRequestBody)
      .then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            type: "bot",
            message: response.data.bot.content,
          },
        ]);
        // setIsLoading(false);
      })
      .catch((error) => {
        // setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex flex-center justify-center items-center">
        <div className=" w-[50%] h-[600px] bg-slate-800  border-1bg-white   focus:outline-none ring-2 ring-black shadow-sm rounded-lg text-slate-800">
          <div
            id="chat_container"
            className=" overflow-auto mx-auto  flex flex-col h-full "
          >
            <div className="flex flex-col space-y-2 pb-44 p-5 flex-grow">
              {chatLog.length === 0 ? (
                <div className="custom-text">
                  Welcome to GoVo! <br />
                  <br />
                  At GoVo, we are committed to empowering you to make informed
                  decisions about the upcoming elections in your area. Our app
                  is non-partisan and doesn't endorse any political party or
                  candidate, ensuring that you receive an unbiased and
                  personalized voting plan.
                  <br />
                  <br />
                  Feel free to ask any questions or share your concerns, and
                  we'll be here to provide you with the information and guidance
                  you need. Let's work together to make a difference in the
                  democratic process!
                </div>
              ) : (
                chatLog.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        message.type === "user"
                          ? "bg-blue-200 text-black "
                          : "text-black bg-gray-200 border-2 "
                      }rounded-lg p-2 max-h-[100%] max-w-[500px]`}
                    >
                      {message.message}
                    </div>
                  </div>
                ))
              )}
              {/* {isLoading && (
                <div key={chatLog.length} className="flex justify-between">
                  <div className="rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
                </div>
              )} */}
            </div>
            <div className="  p-4 rounded-lg  dark:bg-slate-700 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 ">
              <form onSubmit={handleSubmit} className="flex  items-center">
                <div className="flex-grow ml-2">
                  <input
                    type="text"
                    className="pl-3 py-2 w-full  font-semibold ring-1 ring-black hover:bg-slate-800  focus:outline-none focus:ring-2 focus:ring-black-500 shadow-sm rounded-lg bg-slate-900   "
                    placeholder="Talk to me..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="ml-5">
                  <button
                    type="submit"
                    className="  rounded-md  py-2.5 ring-1 ring-black bg-slate-900 px-3 py-1.5 text-sm font-semibold  text-slate-400 hover:bg-slate-800 "
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatGPT3;
