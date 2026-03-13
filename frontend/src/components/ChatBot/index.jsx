import { useState } from "react";
import ChatIcon from "./ChatIcon";
import ChatWindow from "./ChatWindow";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      {!isOpen && <ChatIcon onClick={() => setIsOpen(true)} />}
    </div>
  );
};

export default ChatBot;
