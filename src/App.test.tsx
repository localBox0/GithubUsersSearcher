import React from 'react';
import { render, screen } from '@testing-library/react';
import {Github} from './Github';

test('renders learn react link', () => {
  render(<Github />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
