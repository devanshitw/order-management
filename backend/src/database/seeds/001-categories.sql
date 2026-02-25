DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM menu_items;
DELETE FROM categories;

INSERT INTO categories (id, name, description, image_url, sort_order, is_active) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Starters & Chaat', 'Crispy snacks and tangy street food', NULL, 1, true),
  ('a2222222-2222-2222-2222-222222222222', 'Breads', 'Freshly baked naan, roti, and paratha', NULL, 2, true),
  ('a3333333-3333-3333-3333-333333333333', 'Dal & Curries', 'Rich lentils and vegetable curries', NULL, 3, true),
  ('a4444444-4444-4444-4444-444444444444', 'Paneer Specials', 'Cottage cheese prepared in various styles', NULL, 4, true),
  ('a5555555-5555-5555-5555-555555555555', 'Rice & Biryani', 'Fragrant rice dishes and dum biryani', NULL, 5, true),
  ('a6666666-6666-6666-6666-666666666666', 'South Indian', 'Dosa, idli, uttapam, and more', NULL, 6, true),
  ('a7777777-7777-7777-7777-777777777777', 'Mithai & Desserts', 'Traditional Indian sweets', NULL, 7, true),
  ('a8888888-8888-8888-8888-888888888888', 'Beverages', 'Lassi, chaas, chai, and fresh juices', NULL, 8, true);
