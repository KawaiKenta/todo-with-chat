import React from 'react';
import { Container, Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import NotFound from './components/NotFound';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <Box>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;
