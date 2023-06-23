import { AuthGuard } from '../guards/AuthGuard';
import { useCallSocketContext } from '../hooks/use-call-socket';
import { PropsWithChildren } from '../types/util.type';

type MainLayoutProps = PropsWithChildren;

export default function CallLayout({ children }: MainLayoutProps) {
  const { CallSocketContext, callSocketState } = useCallSocketContext();

  return (
    <CallSocketContext.Provider value={callSocketState}>
      <AuthGuard>{children}</AuthGuard>
    </CallSocketContext.Provider>
  );
}
