import { Box, BoxProps, GlobalStyles } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hook';
import { fetchUserThunk } from '../../redux/slices/auth.slice';
import { fontFamily } from '../constants/index.constant';

type AppWrapperProps = BoxProps;

export const AppWrapper = ({ children, ...rest }: AppWrapperProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserThunk());

    Audio.prototype.play = (function (play) {
      return function () {
        const audio = this;
        const args = arguments;
        const promise = play.apply(audio, args);
        if (promise !== undefined) {
          promise.catch((_: any) => {
            const el = document.createElement('button');
            el.style.display = 'none';
            el.innerHTML = 'Play';
            el.addEventListener('click', function () {
              play.apply(audio, args);
            });
          });
        }
      };
    })(Audio.prototype.play);
  }, [dispatch]);

  return (
    <Box fontFamily={fontFamily}>
      <GlobalStyles
        styles={{
          'input:-webkit-autofill': {
            WebkitBoxShadow: 'unset',
          },
          'input:-webkit-autofill:hover': {
            WebkitBoxShadow: 'unset',
          },
          'input:-webkit-autofill:focus': {
            WebkitBoxShadow: 'unset',
          },
          'input:-webkit-autofill:active': {
            WebkitBoxShadow: 'unset',
          },
          'a, a:hover': { textDecoration: 'none', color: 'inherit' },
          'input::-ms-reveal': { display: 'none' },
          img: { display: 'block' },
          '[contenteditable=true]:empty:before': {
            content: 'attr(placeholder)',
            pointerEvents: 'none',
            display: 'block',
            opacity: '0.5',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: '#2c2c2c',
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: '#9f9f9f',
          },
          '::-internal-autofill-selected': {
            backgroundColor: 'unset',
          },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          maxSnack={3}
        >
          {children}
        </SnackbarProvider>

        <ReactQueryDevtools />
      </LocalizationProvider>
    </Box>
  );
};
