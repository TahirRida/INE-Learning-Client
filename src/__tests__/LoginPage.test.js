const React = require('react');
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import LoginPage from '../Components/Authentification Page/LoginPage';
import 'jest-css-modules';
import '@testing-library/jest-dom'; 

jest.mock('axios');

describe('<LoginPage />', () => {
  it('renders the login page correctly', () => {
    const { getByRole } = render(<LoginPage />);
    expect(getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('handles sign in form submission', async () => {
    const mockToken = 'mocked-token';
    const mockUsername = 'tester01';
    const mockPassword = '1234';
    const mockResponse = { data: { token: mockToken } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const { getByTestId } = render(<LoginPage />);
    const usernameInput = getByTestId('username');
    const passwordInput = getByTestId('password');

    fireEvent.change(usernameInput, { target: { value: mockUsername } });
    fireEvent.change(passwordInput, { target: { value: mockPassword } });

    fireEvent.click(getByTestId('signIn'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signin'),
        { username: mockUsername, password: mockPassword }
      );

      expect(localStorage.getItem('username')).toEqual(mockUsername);
      expect(axios.defaults.headers.common['Authorization']).toEqual(`Bearer ${mockToken}`);
    });
  });

  it('handles sign up form submission', async () => {
    const mockResponse = { data: 'Sign up successful' };
    axios.post.mockResolvedValueOnce(mockResponse);

    const { getByTestId } = render(<LoginPage />);

    fireEvent.change(getByTestId('Susername'), { target: { value: 'testuser' } });
    fireEvent.change(getByTestId('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByTestId('Spassword'), { target: { value: 'testpassword' } });

    fireEvent.submit(getByTestId('signUpForm'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        { username: 'testuser', email: 'test@example.com', password: 'testpassword' }
      );
    });
  });
});
