import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MapComponent from './MapComponent';

test('renders map component with map tiles', async () => {
  const result = render(<MapComponent />);
  const mapTile = result.container.querySelector("img[src='/map-tile.png']");
  expect(mapTile).not.toBeNull();
});

test('renders map zoom buttons', async () => {
  render(<MapComponent />);
  const zoomPlus = screen.getByText('+');
  const zoomMinus = screen.getByText('−');
  expect(zoomPlus).toBeInTheDocument();
  expect(zoomMinus).toBeInTheDocument();
});

test('renders statistics button', async () => {
  render(<MapComponent />);
  const statisticsButton = screen.getByTitle(/Statistics/i);
  expect(statisticsButton).toBeInTheDocument();
});

test('adds a marker to the map', async () => {
  const result = render(<MapComponent />);
  const mapContainer = result.container.querySelector('#leaflet-map-container');

  fireEvent(
    mapContainer!,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  const marker = screen.getByTitle(/Node 1/i);
  expect(marker).toBeInTheDocument();
});
