import { Box } from '@mui/material';
import { Header } from '../components/Header';
import { AuthGuard } from '../guards/AuthGuard';
import { useChatSocketContext } from '../hooks/use-chat-socket';
import { PropsWithChildren } from '../types/util.type';

type MainLayoutProps = PropsWithChildren;

export default function MainLayout({ children }: MainLayoutProps) {
  const { ChatSocketContext, chatSocketState } = useChatSocketContext();

  return (
    <ChatSocketContext.Provider value={chatSocketState}>
      <AuthGuard>
        <Box width="100%" bgcolor="black" color="white">
          <Header />
          {children}
        </Box>
      </AuthGuard>
    </ChatSocketContext.Provider>
  );
}
