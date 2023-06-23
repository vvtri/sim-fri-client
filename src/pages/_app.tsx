import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Noto_Color_Emoji } from 'next/font/google';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { AppWrapper } from '../common/hoc/AppWrapper';
import MainLayout from '../common/layouts/MainLayout';
import '../common/styles/global.css';
import { theme } from '../common/theme/theme';
import { store } from '../redux/store';

const noto = Noto_Color_Emoji({ weight: '400', subsets: ['emoji'] });

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>SimFri</title>
      </Head>

      <CssBaseline />
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <AppWrapper className={noto.className}>
              {getLayout(<Component {...pageProps} />)}
            </AppWrapper>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}
