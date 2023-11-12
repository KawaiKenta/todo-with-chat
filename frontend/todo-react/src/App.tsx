import React from 'react';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Container>
      <div>Header</div>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <div>Footer</div>
    </Container>
  );
};

export default App;
