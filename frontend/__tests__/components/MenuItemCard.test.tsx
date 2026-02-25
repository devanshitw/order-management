import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MenuItemCard from '../../src/components/menu/MenuItemCard';

const mockItem = {
  id: 'item-1',
  name: 'Paneer Butter Masala',
  description: 'Cottage cheese in rich tomato-cream gravy',
  price: 250,
  category_id: 'cat-1',
  is_available: true,
};

describe('MenuItemCard', () => {
  it('renders item name, description, and price', () => {
    render(<MenuItemCard item={mockItem} onAddToCart={() => {}} />);
    expect(screen.getByText('Paneer Butter Masala')).toBeDefined();
    expect(screen.getByText('Cottage cheese in rich tomato-cream gravy')).toBeDefined();
    expect(screen.getByText('₹250.00')).toBeDefined();
  });

  it('starts with quantity 1 and shows quantity controls', () => {
    render(<MenuItemCard item={mockItem} onAddToCart={() => {}} />);
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('+')).toBeDefined();
    expect(screen.getByText('-')).toBeDefined();
  });

  it('increments and decrements quantity', () => {
    render(<MenuItemCard item={mockItem} onAddToCart={() => {}} />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('2')).toBeDefined();
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('1')).toBeDefined();
  });

  it('does not go below quantity 1', () => {
    render(<MenuItemCard item={mockItem} onAddToCart={() => {}} />);
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('1')).toBeDefined();
  });

  it('calls onAddToCart with item id and quantity when button clicked', () => {
    const onAddToCart = vi.fn();
    render(<MenuItemCard item={mockItem} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(onAddToCart).toHaveBeenCalledWith('item-1', 3);
  });
});
