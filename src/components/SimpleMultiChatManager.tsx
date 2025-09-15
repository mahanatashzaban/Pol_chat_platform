import React, { useState } from 'react';
import { PrivateChat } from './PrivateChat';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence } from 'motion/react';

export function SimpleMultiChatManager() {
  const { state } = useAppContext();
  const [openChats, setOpenChats] = useState<Set<string>>(new Set());

  // Listen for private message opens
  React.useEffect(() => {
    if (state.privateMessageOpen && !openChats.has(state.privateMessageOpen)) {
      setOpenChats(prev => new Set([...prev, state.privateMessageOpen!]));
    }
  }, [state.privateMessageOpen, openChats]);

  const handleCloseChat = (userId: string) => {
    setOpenChats(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {Array.from(openChats).map((userId, index) => (
        <div
          key={userId}
          style={{
            position: 'fixed',
            right: `${20 + (index * 420)}px`,
            top: `${100 + (index * 30)}px`,
            zIndex: 1000 + index,
          }}
        >
          <PrivateChat
            userId={userId}
            onClose={() => handleCloseChat(userId)}
          />
        </div>
      ))}
    </AnimatePresence>
  );
}