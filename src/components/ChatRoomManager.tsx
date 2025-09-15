import React from 'react';
import { DraggablePrivateChat } from './DraggablePrivateChat';
import { useAppContext } from '../context/AppContext';

export function ChatRoomManager() {
  const { state, dispatch } = useAppContext();

  const handleCloseChat = (userId: string) => {
    dispatch({ type: 'CLOSE_PRIVATE_MESSAGE', payload: userId });
  };

  const handleMinimizeChat = (userId: string) => {
    dispatch({ type: 'MINIMIZE_PRIVATE_CHAT', payload: userId });
  };

  const handleBringToFront = (userId: string) => {
    dispatch({ type: 'BRING_CHAT_TO_FRONT', payload: userId });
  };

  return (
    <>
      {/* Render all open private chat windows */}
      {state.privateChatWindows
        .filter(window => !window.isMinimized)
        .map((window) => (
          <DraggablePrivateChat
            key={window.userId}
            userId={window.userId}
            position={window.position}
            zIndex={window.zIndex}
            onClose={() => handleCloseChat(window.userId)}
            onMinimize={() => handleMinimizeChat(window.userId)}
            onBringToFront={() => handleBringToFront(window.userId)}
          />
        ))}
      
      {/* Minimized chats taskbar */}
      {state.minimizedChats.length > 0 && (
        <div className="fixed bottom-0 left-4 right-4 z-50 bg-white border-t border-gray-200 p-2 flex gap-2 shadow-lg">
          {state.minimizedChats.map((userId) => {
            const user = state.roomUsers.find(u => u.id === userId) || 
                        state.onlineUsers.find(u => u.id === userId);
            const unreadCount = state.privateChats[userId]?.filter(msg => 
              !msg.isRead && msg.senderId !== state.currentUser?.id
            ).length || 0;
            
            return (
              <button
                key={userId}
                onClick={() => dispatch({ type: 'RESTORE_PRIVATE_CHAT', payload: userId })}
                className="flex items-center gap-2 px-3 py-2 bg-[#9933CC] text-white rounded-lg hover:bg-[#7A2AA0] transition-colors relative"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                  {user?.fullName.charAt(0)}
                </div>
                <span className="truncate max-w-20 text-sm">{user?.username}</span>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {unreadCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}