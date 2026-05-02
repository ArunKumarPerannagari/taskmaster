import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import PageContent from './components/PageContent';
import ToastContainer from './components/shared/Toast';
import { useNotifications } from './hooks/useNotifications';
import './styles/index.css';
import './styles/animations.css';

function AppShell() {
  const [user, setUser] = useState(() => sessionStorage.getItem('tm_user') || null);
  const [activePage, setActivePage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { tasks, addToast } = useTaskContext();

  useNotifications(tasks, addToast);

  if (!user) {
    return <LoginScreen onLogin={(name) => setUser(name)} />;
  }

  return (
    <div className="app-shell" data-page={activePage}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Header
          onAddTask={() => setModalOpen(true)}
          collapsed={collapsed}
        />
        <div className="page-content">
          <PageContent
            activePage={activePage}
            setActivePage={setActivePage}
            externalModalOpen={modalOpen}
            onExternalModalClose={() => setModalOpen(false)}
          />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppShell />
      </TaskProvider>
    </ThemeProvider>
  );
}
