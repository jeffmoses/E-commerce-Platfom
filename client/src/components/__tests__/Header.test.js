import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import { MemoryRouter } from 'react-router-dom';

function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState });
  return render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>);
}

describe('Header', () => {
  it('shows Login and Register when not authenticated', () => {
    renderWithStore(<Header />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('shows Profile and Logout when authenticated', () => {
    renderWithStore(<Header />, { preloadedState: { auth: { user: { name: 'A' }, token: 't', isAuthenticated: true } } });
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
