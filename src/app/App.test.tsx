import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import MapComponent from './map/MapComponent';
import Menu from './ui/Menu';

describe('App tests:', () => {
  test('renders sider with logo', async () => {
    render(<App />);
    const logo = await screen.findByAltText('TOLU Pathfinder logo');
    expect(logo).toHaveAttribute('src', 'logo168.png');
  });
});

describe('Menu tests:', () => {
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
});

describe('Map tests:', () => {
  test('renders map component with map tiles', async () => {
    const result = render(<MapComponent />);
    const mapTile = result.container.querySelector("img[src='map-tile.png']");
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
    const mapContainer = result.container.querySelector(
      '#leaflet-map-container'
    );

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
});
