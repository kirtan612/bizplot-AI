import { useEffect } from 'react';
import { useShell } from '../contexts/ShellContext';

export function useKeyboardShortcuts() {
  const {
    toggleSidebar,
    commandPaletteOpen,
    setCommandPaletteOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    aiAdvisorOpen,
    setAiAdvisorOpen,
    profileMenuOpen,
    setProfileMenuOpen,
    shortcutsModalOpen,
    setShortcutsModalOpen
  } = useShell();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // Ctrl/Cmd + K: Toggle Command Palette
      if (isCmdOrCtrl && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // Ctrl/Cmd + B: Toggle Sidebar
      if (isCmdOrCtrl && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl/Cmd + /: Toggle Shortcuts Modal
      if (isCmdOrCtrl && event.key === '/') {
        event.preventDefault();
        setShortcutsModalOpen(prev => !prev);
        return;
      }

      // Escape key: Close any active overlays in hierarchy order
      if (event.key === 'Escape') {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        if (notificationDrawerOpen) {
          setNotificationDrawerOpen(false);
          return;
        }
        if (aiAdvisorOpen) {
          setAiAdvisorOpen(false);
          return;
        }
        if (profileMenuOpen) {
          setProfileMenuOpen(false);
          return;
        }
        if (shortcutsModalOpen) {
          setShortcutsModalOpen(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleSidebar,
    commandPaletteOpen,
    setCommandPaletteOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    aiAdvisorOpen,
    setAiAdvisorOpen,
    profileMenuOpen,
    setProfileMenuOpen,
    shortcutsModalOpen,
    setShortcutsModalOpen
  ]);
}
