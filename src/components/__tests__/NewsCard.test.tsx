import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NewsCard from '../NewsCard';

const mockNews = {
  title: 'Test Haber Başlığı',
  slug: 'test-haber',
  summary: 'Bu bir test haber özetidir.',
  thumbnail_url: 'https://images.habbo.com/test.png',
  author: { username: 'TestUser', habbo_username: 'TestHabbo' },
  published_at: '2026-07-27T10:00:00Z',
};

describe('NewsCard', () => {
  it('renders news title', () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText('Test Haber Başlığı')).toBeInTheDocument();
  });

  it('renders news summary', () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText('Bu bir test haber özetidir.')).toBeInTheDocument();
  });

  it('renders tag', () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText('HABER')).toBeInTheDocument();
  });
});
