import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingScreen } from '../common/components/utils/LoadingScreen';
import { AppWrapper } from '../common/hoc/AppWrapper';
import MainLayout from '../common/layouts/MainLayout';
import '../common/styles/global.css';
import { theme } from '../common/theme/theme';
import { store } from '../redux/store';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const persistor = persistStore(store);

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
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
              <AppWrapper>{getLayout(<Component {...pageProps} />)}</AppWrapper>
            </PersistGate>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
