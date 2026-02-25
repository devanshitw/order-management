INSERT INTO offers (title, description, discount_type, discount_value, min_order_amount, coupon_code, is_active, valid_from, valid_until)
VALUES
  ('20% Off on Orders Above ₹500', 'Get 20% off on your order when you spend ₹500 or more. Use code WELCOME20 at checkout!', 'percentage', 20.00, 500.00, 'WELCOME20', true, NOW(), NOW() + INTERVAL '90 days'),
  ('Flat ₹50 Off', 'Save ₹50 on any order above ₹200. Apply code SAVE50 at checkout.', 'flat', 50.00, 200.00, 'SAVE50', true, NOW(), NOW() + INTERVAL '90 days'),
  ('15% Off - No Minimum!', 'Enjoy 15% off on any order. No minimum order required!', 'percentage', 15.00, 0.00, NULL, true, NOW(), NOW() + INTERVAL '30 days'),
  ('Flat ₹100 Off on ₹799+', 'Order for ₹799 or more and get a flat ₹100 discount. Use code FEAST100.', 'flat', 100.00, 799.00, 'FEAST100', true, NOW(), NOW() + INTERVAL '60 days'),
  ('10% Off First Order', 'New here? Get 10% off your first order with code FIRST10!', 'percentage', 10.00, 0.00, 'FIRST10', true, NOW(), NOW() + INTERVAL '180 days')
ON CONFLICT (coupon_code) DO NOTHING;
