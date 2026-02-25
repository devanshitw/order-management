export const errorMessage = {
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',

  USER: {
    ALREADY_EXISTS: 'User with this email already exists',
    NOT_FOUND: 'User not found',
  },

  TOKEN: {
    INVALID_TOKEN: 'Invalid token',
    NOT_FOUND: 'Token not found',
  },

  PASSWORD: {
    INVALID_PASSWORD: 'Invalid email or password',
  },

  AUTH: {
    USER_NOT_AUTHENTICATED: 'User not authenticated',
  },

  MENU: {
    ITEM_NOT_FOUND: 'Menu item not found',
    CATEGORY_NOT_FOUND: 'Category not found',
    ITEM_NOT_AVAILABLE: 'Menu item is not available',
  },

  CART: {
    EMPTY: 'Cart is empty',
    ITEM_NOT_FOUND: 'Cart item not found',
  },

  ORDER: {
    NOT_FOUND: 'Order not found',
    INVALID_STATUS_TRANSITION: 'Invalid status transition',
    ALREADY_DELIVERED: 'Order has already been delivered',
    ALREADY_CANCELLED: 'Order has already been cancelled',
  },

  OFFER: {
    INVALID_COUPON: 'Invalid or expired coupon code',
    MIN_ORDER_NOT_MET: 'Minimum order amount not met. Required:',
  },
};
