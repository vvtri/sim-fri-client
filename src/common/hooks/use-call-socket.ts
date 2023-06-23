import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAccessToken } from '../utils/auth.util';

let chatSocket: Socket = undefined as any;
const CallSocketContext = createContext<Socket | undefined>(chatSocket);

export const useCallSocketContext = () => {
  const [callSocketState, setCallSocketState] = useState<Socket | undefined>();

  useEffect(() => {
    chatSocket = io(process.env.NEXT_PUBLIC_CALL_SOCKET as string, {
      extraHeaders: { authorization: getAccessToken() } as any,
    });
    chatSocket.on('connect', () => {
      console.log('connect', chatSocket.id);
    });
    chatSocket.on('disconnect', () => {
      console.log('disconnected');
    });

    setCallSocketState(chatSocket);

    return () => {
      chatSocket.connected && chatSocket.close();
    };
  }, []);

  return { CallSocketContext, callSocketState };
};

export const useCallSocket = () => {
  const callSocket = useContext(CallSocketContext);

  return {
    callSocket: callSocket as Socket,
    isConnected: callSocket?.connected,
  };
};
