import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from '../../src/components/menu/CategoryFilter';

const mockCategories = [
  { id: '1', name: 'Starters & Chaat', sort_order: 1, is_active: true },
  { id: '2', name: 'Paneer Specials', sort_order: 2, is_active: true },
];

describe('CategoryFilter', () => {
  it('renders "All" button and all categories', () => {
    render(
      <CategoryFilter categories={mockCategories} selected={null} onSelect={() => {}} />,
    );
    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('Starters & Chaat')).toBeDefined();
    expect(screen.getByText('Paneer Specials')).toBeDefined();
  });

  it('calls onSelect with category id when clicked', () => {
    const onSelect = vi.fn();
    render(
      <CategoryFilter categories={mockCategories} selected={null} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText('Starters & Chaat'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('calls onSelect with null when "All" is clicked', () => {
    const onSelect = vi.fn();
    render(
      <CategoryFilter categories={mockCategories} selected="1" onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText('All'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
