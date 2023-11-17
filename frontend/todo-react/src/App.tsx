import React from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import NotFound from './components/NotFound';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Provider } from 'jotai';
import { Snackbar } from './components/Snackbar';

const App = () => {
  return (
    <Provider>
      <Box>
        <Snackbar />
        <Header />
        <Box>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:userId" element={<UserPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Provider>
  );
};

export default App;
