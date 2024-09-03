import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./styles/Chatbot.css";

const Chatbot = ({ weatherData, airQualityData }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const chatContainerRef = useRef(null);
  const [initialMsg , setInitialMsg] = useState(true);

  const parseMessage = (message) => {
    return message
      .split("*")
      .filter((item) => item.trim())
      .map((item, index) => (
        <li key={index}>
          {item.trim()}
        </li>
      ));
  };

  const addMessageToChatHistory = (role, message) => {
    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      {
        role,
        parts: [message],
      },
    ]);
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (currentUser) {
        initialMsg && addMessageToChatHistory(
          "model",
          `Hi, ${currentUser.username}! I am your AI assistant! I will ensure that your trip is smooth and memorable. Let me explain my role in the trip.`
        );

        const airQualityMessage = airQualityData
          ? `The air quality at your location (${airQualityData.city_name}) has an AQI of ${airQualityData.data[0].aqi}. Predominant pollen type is ${airQualityData.data[0].predominant_pollen_type}.`
          : null;

        const weatherMessage = weatherData
          ? `The current weather at your location (${weatherData.location.name}) is ${weatherData.current.condition.text} with a temperature of ${weatherData.current.temp_c}°C.`
          : null;

        const initialMessages = [airQualityMessage, weatherMessage].filter(
          (message) => message !== null
        );

        if (initialMessages.length > 0) {
          initialMessages.forEach((msg) =>
            addMessageToChatHistory("model", msg)
          );

          try {
            const response = await fetch("/api/chatbot/gemini", {
              method: "POST",
              body: JSON.stringify({
                history: [
                  ...chatHistory,
                  ...initialMessages.map((msg) => ({
                    role: "model",
                    parts: [msg],
                  })),
                ],
                message: initialMessages.join(" "),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const data = await response.json();

            addMessageToChatHistory("model", data.response);
          } catch (error) {
            console.error("Error sending initial data:", error);
          }
        }
        setInitialMsg(false);
      }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, weatherData, airQualityData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("/api/chatbot/gemini", options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value],
        },
        {
          role: "model",
          parts: [data.response],
        },
      ]);
      setValue("");
      console.log("Sending to /api/chatbot/gemini:", { history: chatHistory, message: value });

    } catch (error) {
      console.error("Error in getResponse:", error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getResponse();
    }
  };

  const saveChatHistory = async () => {
    getResponse();
    try {
      await fetch("/api/chatbot/history", {
        method: "POST",
        body: JSON.stringify({ chatHistory }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // Ensure cookies are sent with the request
      });
      console.log(body);
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };
  
  useEffect(() => {
    // Save chat history on component unmount
    return () => {
      if (currentUser) {
        saveChatHistory();
      }
    };
  }, [chatHistory, currentUser]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (currentUser) {
        try {
          const response = await fetch("/api/chatbot/history", {
            method: "GET",
            credentials: "include",
          });

          console.log(response);
  
          if (response.ok) {
            const data = await response.json();
            if (data.chatHistory) {
              setChatHistory(data.chatHistory);
            }
          } else {
            console.error("Failed to fetch chat history");
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
  
    fetchChatHistory();
  }, [currentUser]);

  return (
    <div className="chat_bot">
      <div className="input-container">
        <input
          value={value}
          placeholder="Ask Your AI Trip Advisor"
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {!error && <button onClick={getResponse}>Ask AI</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result" ref={chatContainerRef}>
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <div className="answer">
              {chatItem.role === "user" ? currentUser.username : "AI"} :
              <ul className="ChatResponse">
                {parseMessage(chatItem.parts.join(", "))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
