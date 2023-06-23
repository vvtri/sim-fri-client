import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAccessToken } from '../utils/auth.util';

let chatSocket: Socket = undefined as any;
const ChatSocketContext = createContext<Socket | undefined>(chatSocket);

export const useChatSocketContext = () => {
  const [chatSocketState, setChatSocketState] = useState<Socket | undefined>();

  useEffect(() => {
    chatSocket = io(process.env.NEXT_PUBLIC_CHAT_SOCKET as string, {
      extraHeaders: { authorization: getAccessToken() } as any,
    });
    chatSocket.on('connect', () => {
      console.log('connect', chatSocket.id);
    });
    chatSocket.on('disconnect', () => {
      console.log('disconnected');
    });

    setChatSocketState(chatSocket);

    return () => {
      chatSocket.connected && chatSocket.close();
    };
  }, []);

  return { ChatSocketContext, chatSocketState };
};

export const useChatSocket = () => {
  const chatSocket = useContext(ChatSocketContext);

  return {
    chatSocket: chatSocket as Socket,
    isConnected: chatSocket?.connected,
  };
};
