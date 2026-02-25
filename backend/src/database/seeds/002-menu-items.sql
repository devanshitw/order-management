INSERT INTO menu_items 
(id, name, description, price, image_url, category_id, is_available, preparation_time_minutes) 
VALUES

-- Starters & Chaat
(gen_random_uuid(), 'Samosa (2 pcs)', 'Crispy pastry filled with spiced potato and peas', 60, 'https://images.openai.com/static-rsc-1/xAPDVbxAWDr6_x5Ai2S_eIsj09DOCigBdQ7VKSqAWnON2La3NFqjUOIGzHqIQm_AjhMU0nqhy1cHA1L8XFDVrtzBphl7n8IAuj7iFA9D607UttdYC3mZ8yQNwv03SqPGuK-ncHVzxar20Dl8IJzVAg', 'a1111111-1111-1111-1111-111111111111', true, 10),
(gen_random_uuid(), 'Pani Puri (6 pcs)', 'Hollow puris filled with tangy mint water and chickpeas', 80, 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Pani_Puri1.JPG', 'a1111111-1111-1111-1111-111111111111', true, 8),
(gen_random_uuid(), 'Aloo Tikki Chaat', 'Crispy potato patties topped with chutneys and yogurt', 90, 'https://images.squarespace-cdn.com/content/v1/5cef7b136434550001a53d10/1591109617291-U40D1IM5GVH6FGKM18YD/alootikkichaat3.jpg', 'a1111111-1111-1111-1111-111111111111', true, 12),
(gen_random_uuid(), 'Paneer Tikka', 'Marinated cottage cheese cubes grilled in tandoor', 220, 'https://t3.ftcdn.net/jpg/14/79/19/76/240_F_1479197657_PcvyPdLbgYskLLBZwIWKwmy6sFbgvjRJ.jpg', 'a1111111-1111-1111-1111-111111111111', true, 15),
(gen_random_uuid(), 'Hara Bhara Kebab', 'Spinach and green pea cutlets with mint chutney', 180, 'https://t3.ftcdn.net/jpg/02/17/46/36/240_F_217463687_pzEdN1TfgiKPcudofQXC55vXhNJQz0Hf.jpg', 'a1111111-1111-1111-1111-111111111111', true, 15),

-- Breads
(gen_random_uuid(), 'Butter Naan', 'Soft leavened bread brushed with butter', 50, 'https://static.toiimg.com/photo/75574251.cms', 'a2222222-2222-2222-2222-222222222222', true, 8),
(gen_random_uuid(), 'Garlic Naan', 'Naan topped with garlic and fresh coriander', 60, 'https://www.allrecipes.com/thmb/RNyrLGqJWiDaRcBggJZekRD7PwE%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/6703829-79839289e42b481f80e689be46731023.jpg', 'a2222222-2222-2222-2222-222222222222', true, 8),
(gen_random_uuid(), 'Tandoori Roti', 'Whole wheat bread baked in clay oven', 35, 'https://static.toiimg.com/thumb/75542650.cms?height=800&imgsize=2236995&width=800', 'a2222222-2222-2222-2222-222222222222', true, 6),
(gen_random_uuid(), 'Aloo Paratha', 'Stuffed wheat bread with spiced potato filling', 70, 'https://mughaldarbar.in/upload/pro/product-featured-90.jpg', 'a2222222-2222-2222-2222-222222222222', true, 10),
(gen_random_uuid(), 'Laccha Paratha', 'Flaky layered whole wheat bread', 55, 'https://i.pinimg.com/736x/7e/c8/49/7ec849ddb02f977d0ebc0c1dcdc14581.jpg', 'a2222222-2222-2222-2222-222222222222', true, 8),

-- Dal & Curries
(gen_random_uuid(), 'Dal Makhani', 'Slow-cooked black lentils in creamy tomato gravy', 220, 'https://img.taste.com.au/-9N8RwWn/w1200-h1200-cfill-q80/taste/2025/03/dal-makhani-indian-butter-lentils-2-208408-1.jpg', 'a3333333-3333-3333-3333-333333333333', true, 20),
(gen_random_uuid(), 'Dal Tadka', 'Yellow lentils tempered with cumin and garlic', 180, 'https://images.openai.com/static-rsc-1/h1mf3qDiQm83TKlRGonbLLcCRKwHQXQPTKDYXh3SEjZumY8AafSf9c9EydHmCn3tqftPmFPGNB5mZlleGLPJNjkuS3bdi8qBQMLmTSXgo9neJ9bcMkqJsTKaHZPlOX--MrwkOroJ7n0tY6WQ_VNH5w', 'a3333333-3333-3333-3333-333333333333', true, 15),
(gen_random_uuid(), 'Chole Bhature', 'Spiced chickpea curry served with fried bread', 160, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Chole_Bhature_from_Nagpur.JPG/1280px-Chole_Bhature_from_Nagpur.JPG', 'a3333333-3333-3333-3333-333333333333', true, 18),
(gen_random_uuid(), 'Aloo Gobi', 'Potato and cauliflower cooked with Indian spices', 170, 'https://cdn.uengage.io/uploads/28289/image-674446-1746179354.jpeg', 'a3333333-3333-3333-3333-333333333333', true, 15),
(gen_random_uuid(), 'Baingan Bharta', 'Smoky roasted eggplant mash with onions and tomatoes', 180, 'https://www.cookwithmanali.com/how-to-make-bhatura/bhature-recipe/', 'a3333333-3333-3333-3333-333333333333', true, 18),

-- Paneer Specials
(gen_random_uuid(), 'Paneer Butter Masala', 'Cottage cheese in rich tomato-cream gravy', 250, 'https://static.toiimg.com/thumb/53098531.cms?height=800&imgsize=246555&width=800', 'a4444444-4444-4444-4444-444444444444', true, 18),
(gen_random_uuid(), 'Palak Paneer', 'Cottage cheese cubes in creamy spinach sauce', 230, 'https://www.sidechef.com/recipe/cfab6df8-2b92-4052-966f-c24f43180d18.jpg?d=1408x1120', 'a4444444-4444-4444-4444-444444444444', true, 18),
(gen_random_uuid(), 'Kadai Paneer', 'Paneer with bell peppers in kadai masala', 240, 'https://images.openai.com/static-rsc-1/Vgq3m4tmX9ofEvERfHpPm3LUS70aCTh8kL7dVXCHk6fH8meAxp2Cz9wzNYfs1boFGm8WMe5SPYL28Ugce6yaapUirYrjwYJoUVD21xWG3zk-140J3aF6jnwOongyHpaMtkTgNJAkPrNzYsCQLHG1vQ', 'a4444444-4444-4444-4444-444444444444', true, 18),
(gen_random_uuid(), 'Shahi Paneer', 'Paneer in cashew and cream based royal gravy', 260, 'https://i.pinimg.com/736x/39/39/90/393990c9c0e2331e30af1eeb80d619ef.jpg', 'a4444444-4444-4444-4444-444444444444', true, 20),

-- Rice & Biryani
(gen_random_uuid(), 'Veg Biryani', 'Fragrant basmati rice with mixed vegetables and saffron', 220, 'https://img.taste.com.au/_L7m5vxs/taste/2016/11/vegetable-biryani-102620-1.jpeg', 'a5555555-5555-5555-5555-555555555555', true, 25),
(gen_random_uuid(), 'Paneer Biryani', 'Dum-cooked biryani with marinated paneer', 260, 'https://orders.popskitchen.in/storage/2024/09/image-285.png', 'a5555555-5555-5555-5555-555555555555', true, 25),
(gen_random_uuid(), 'Jeera Rice', 'Basmati rice tempered with cumin seeds', 130, 'https://priyafoods.com/cdn/shop/files/JEERARICE_2.jpg?v=1701948113&width=1780', 'a5555555-5555-5555-5555-555555555555', true, 12),
(gen_random_uuid(), 'Steamed Rice', 'Plain steamed basmati rice', 100, 'https://cdn1.foodviva.com/static-content/food-images/rice-recipes/jeera-rice-recipe/jeera-rice-recipe.jpg', 'a5555555-5555-5555-5555-555555555555', true, 10),

-- South Indian
(gen_random_uuid(), 'Masala Dosa', 'Crispy rice crepe filled with spiced potato', 120, 'https://t4.ftcdn.net/jpg/18/90/35/27/240_F_1890352702_ECt4RSrVofrVpIOK60YGBR17fzPB9p1d.jpg', 'a6666666-6666-6666-6666-666666666666', true, 12),
(gen_random_uuid(), 'Idli Sambar (3 pcs)', 'Steamed rice cakes served with lentil soup and chutney', 90, 'https://i.imgur.com/HtXUXPc.jpg', 'a6666666-6666-6666-6666-666666666666', true, 10),
(gen_random_uuid(), 'Uttapam', 'Thick rice pancake topped with onions and tomatoes', 110, 'https://cdn1.foodviva.com/static-content/food-images/south-indian-recipes/uttapam/uttapam.jpg', 'a6666666-6666-6666-6666-666666666666', true, 12),
(gen_random_uuid(), 'Medu Vada (2 pcs)', 'Crispy fried lentil doughnuts with sambar and chutney', 80, 'https://www.sharmispassions.com/wp-content/uploads/2011/01/MeduVadai3.jpg', 'a6666666-6666-6666-6666-666666666666', true, 10),

-- Desserts
(gen_random_uuid(), 'Gulab Jamun (2 pcs)', 'Deep-fried milk dumplings in sugar syrup', 80, 'https://static.toiimg.com/thumb/63799510.cms?height=800&imgsize=1091643&width=800', 'a7777777-7777-7777-7777-777777777777', true, 5),
(gen_random_uuid(), 'Rasmalai (2 pcs)', 'Soft cottage cheese patties in sweetened saffron milk', 100, 'https://nestle.fitterfly.in/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZ1l1IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5ea9855ea18e7956e4dc7cb9d4416437e2b496b3/20155-Kesari_Tofu_Angoori_Rasmalai.webp', 'a7777777-7777-7777-7777-777777777777', true, 5),
(gen_random_uuid(), 'Gajar Ka Halwa', 'Slow-cooked carrot pudding with nuts and cardamom', 120, 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Cuisine_%28268%29_44.jpg', 'a7777777-7777-7777-7777-777777777777', true, 5),
(gen_random_uuid(), 'Kulfi', 'Traditional Indian frozen dessert with pistachios', 90, 'https://t3.ftcdn.net/jpg/01/41/76/88/240_F_141768845_jsbAAHDmY0zTasngshLDnKEzpwbA9noi.jpg', 'a7777777-7777-7777-7777-777777777777', true, 3),

-- Beverages
(gen_random_uuid(), 'Mango Lassi', 'Creamy yogurt smoothie with fresh mango pulp', 90, 'https://www.simplyrecipes.com/thmb/7oZrY9CXkHSqrV6diryN7Kwyups%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/Simply-Recipes-Mango-Lassi-LEAD-08-9b45bb7d7d6d45a79deee3013f2f3cf1.jpg', 'a8888888-8888-8888-8888-888888888888', true, 5),
(gen_random_uuid(), 'Sweet Lassi', 'Chilled sweetened yogurt drink', 70, 'https://cdn1.foodviva.com/static-content/food-images/punjabi-recipes/sweet-lassi/sweet-lassi.jpg', 'a8888888-8888-8888-8888-888888888888', true, 5),
(gen_random_uuid(), 'Masala Chaas', 'Spiced buttermilk with cumin and mint', 50, 'https://cdn3.foodviva.com/static-content/food-images/healthy-recipes/masala-chaas/masala-chaas.jpg', 'a8888888-8888-8888-8888-888888888888', true, 3),
(gen_random_uuid(), 'Masala Chai', 'Traditional Indian spiced tea', 40, 'https://t4.ftcdn.net/jpg/01/66/87/43/240_F_166874362_kZTGg8x1JgRsSCJgO0GWhrkgSWa4ZqRA.jpg', 'a8888888-8888-8888-8888-888888888888', true, 5),
(gen_random_uuid(), 'Fresh Lime Soda', 'Lemon juice with soda and a hint of salt or sugar', 60, 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Mint_lassi.jpg', 'a8888888-8888-8888-8888-888888888888', true, 3);