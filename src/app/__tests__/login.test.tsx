import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

const mockSignIn = jest.fn();
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({ auth: { signInWithPassword: mockSignIn } }),
}));

import LoginPage from '@/app/(main)/login/page';

describe('LoginPage', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockPush.mockReset();
  });

  it('renders login form with title and inputs', () => {
    render(<LoginPage />);
    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-Posta adresin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Şifren')).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    mockSignIn.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid credentials' } });
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText('E-Posta adresin'), 'wrong@test.com');
    await user.type(screen.getByPlaceholderText('Şifren'), 'wrong');
    await user.click(screen.getByText('GİRİŞ YAP'));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('calls signInWithPassword on submit', async () => {
    mockSignIn.mockResolvedValue({ data: { user: {} }, error: null });
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('E-Posta adresin'), 'test@habbo.com');
    await user.type(screen.getByPlaceholderText('Şifren'), '123456');
    await user.click(screen.getByText('GİRİŞ YAP'));

    expect(mockSignIn).toHaveBeenCalledWith({ email: 'test@habbo.com', password: '123456' });
  });

  it('redirects to home on success', async () => {
    mockSignIn.mockResolvedValue({ data: { user: {} }, error: null });
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('E-Posta adresin'), 'test@habbo.com');
    await user.type(screen.getByPlaceholderText('Şifren'), '123456');
    await user.click(screen.getByText('GİRİŞ YAP'));

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
