import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Menu from './Menu';

test('renders all menu categories', async () => {
  render(<Menu />);

  const graphMenu = await screen.findByText(/Graph/i);
  const algorithmMenu = await screen.findByText(/Algorithm/i);
  const settingsMenu = await screen.findByText(/Settings/i);

  expect(graphMenu).toBeInTheDocument();
  expect(algorithmMenu).toBeInTheDocument();
  expect(settingsMenu).toBeInTheDocument();
});

test('collapses the graph category', async () => {
  render(<Menu />);

  const graph = await screen.findByText(/Graph/i);
  fireEvent(
    graph,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const randomOption = await screen.findByText(/Random/i);
  const parentIsHidden =
    randomOption.parentElement?.parentElement?.classList.contains(
      'ant-menu-hidden'
    );
  expect(parentIsHidden).toBe(true);
});

test('expands and renders the settings category', async () => {
  render(<Menu />);

  const settings = await screen.findByText(/Settings/i);
  fireEvent(
    settings,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const searchSpeedSetting = await screen.findByText(/Search speed/i);
  expect(searchSpeedSetting).toBeInTheDocument();
});
