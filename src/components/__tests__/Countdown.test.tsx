import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Countdown from '../Countdown';

describe('Countdown', () => {
  it('renders countdown timer', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    render(<Countdown targetDate={futureDate} />);
    const timer = screen.getByText(/:/);
    expect(timer).toBeInTheDocument();
  });
});
