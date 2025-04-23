import React, { useEffect } from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
  autoHideDuration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onDismiss, 
  autoHideDuration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [onDismiss, autoHideDuration]);

  const messageBarType = {
    success: MessageBarType.success,
    error: MessageBarType.error,
    info: MessageBarType.info
  }[type];

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '80%'
    }}>
      <MessageBar
        messageBarType={messageBarType}
        onDismiss={onDismiss}
        dismissButtonAriaLabel="Close"
      >
        {message}
      </MessageBar>
    </div>
  );
};

export default Toast;