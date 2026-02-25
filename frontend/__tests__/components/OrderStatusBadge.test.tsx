import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OrderStatusBadge from '../../src/components/order/OrderStatusBadge';
import { OrderStatus } from '../../src/types';

describe('OrderStatusBadge', () => {
  it('renders correct label for PLACED status', () => {
    render(<OrderStatusBadge status={OrderStatus.PLACED} />);
    expect(screen.getByText('Placed')).toBeDefined();
  });

  it('renders correct label for DELIVERED status', () => {
    render(<OrderStatusBadge status={OrderStatus.DELIVERED} />);
    expect(screen.getByText('Delivered')).toBeDefined();
  });

  it('renders correct label for OUT_FOR_DELIVERY status', () => {
    render(<OrderStatusBadge status={OrderStatus.OUT_FOR_DELIVERY} />);
    expect(screen.getByText('Out for Delivery')).toBeDefined();
  });

  it('renders correct label for CANCELLED status', () => {
    render(<OrderStatusBadge status={OrderStatus.CANCELLED} />);
    expect(screen.getByText('Cancelled')).toBeDefined();
  });
});
