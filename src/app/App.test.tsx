import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders sider with logo', async () => {
  render(<App />);
  const logo = await screen.findByAltText('TOLU Pathfinder logo');
  expect(logo).toHaveAttribute('src', '/logo168.png');
});
