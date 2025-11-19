import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import Login from '../Login';
import api from '../../utils/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../utils/api');

function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState });
  return render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>);
}

describe('Login page', () => {
  beforeEach(() => {
    api.post.mockReset();
    localStorage.clear();
  });

  it('shows validation errors when fields are empty', async () => {
    renderWithStore(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Required/i)).toBeInTheDocument();
  });

  it('submits valid credentials and stores token', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'abc123', data: { name: 'Test' } } });

    renderWithStore(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/users/login', { email: 'test@example.com', password: 'password123' }));
    expect(localStorage.getItem('token')).toBe('abc123');
  });
});
