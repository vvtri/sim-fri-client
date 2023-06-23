import { NextPageContext } from 'next';
import { ReactElement } from 'react';
import { CallScreen } from '../../../../call/common/components/CallScreen';
import CallLayout from '../../../../common/layouts/CallLayout';

type CallProps = {
  conversationId: string;
  roomId: string;
};

export default function Call(props: CallProps) {
  return <CallScreen {...props} />;
}

Call.getLayout = (page: ReactElement) => {
  return <CallLayout>{page}</CallLayout>;
};

Call.getInitialProps = (ctx: NextPageContext): CallProps => {
  return {
    conversationId: ctx.query.conversationId as string,
    roomId: ctx.query.roomId as string,
  };
};
