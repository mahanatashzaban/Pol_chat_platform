import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthPage } from './components/AuthPage';
import { LocationSelector } from './components/LocationSelector';
import { ChatRoom } from './components/ChatRoom';
import { UserProfile } from './components/UserProfile';
import { SupportTicket } from './components/SupportTicket';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { state, dispatch } = useAppContext();

  const handleCloseProfile = () => {
    // Return to previous page or default to chat if in a room, otherwise location
    if (state.selectedRoom) {
      dispatch({ type: 'SET_PAGE', payload: 'chat' });
    } else {
      dispatch({ type: 'SET_PAGE', payload: 'location' });
    }
  };

  const handleCloseSupport = () => {
    // Return to previous page or default to chat if in a room, otherwise location
    if (state.selectedRoom) {
      dispatch({ type: 'SET_PAGE', payload: 'chat' });
    } else {
      dispatch({ type: 'SET_PAGE', payload: 'location' });
    }
  };

  const renderCurrentPage = () => {
    if (!state.isAuthenticated) {
      return <AuthPage />;
    }

    switch (state.currentPage) {
      case 'location':
        return <LocationSelector />;
      case 'chat':
        return <ChatRoom />;
      case 'profile':
        return <UserProfile onClose={handleCloseProfile} />;
      case 'support':
        return <SupportTicket onClose={handleCloseSupport} />;
      default:
        return <LocationSelector />;
    }
  };

  return (
    <div className="size-full">
      {renderCurrentPage()}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}