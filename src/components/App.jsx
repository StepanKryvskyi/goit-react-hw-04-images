import React, { useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { Container } from './App.styled';

function App() {
  const [value, setValue] = useState('');

  const handleSubmit = value => {
    setValue(value);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery value={value} />
    </Container>
  );
}

export default App;
