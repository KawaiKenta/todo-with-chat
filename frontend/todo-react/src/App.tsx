import React from 'react';
import { Container, Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import NotFound from './components/NotFound';
import { Header } from './components/Header';

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
      <div>Footer</div>
    </Box>
  );
};

export default App;
