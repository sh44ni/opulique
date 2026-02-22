-- footfits.pk Seed Data for Neon PostgreSQL
-- Run this AFTER running neon-schema.sql

-- Insert sliders
INSERT INTO sliders (title, subtitle, cta_text, cta_link, background_color, image_url, sort_order, is_active)
VALUES 
  ('Authentic Branded Shoes', 'Pre-loved & Brand New from USA/Europe', 'Shop Now', '/shop', '#284E3D', '/placeholder-slider-1.jpg', 1, true),
  ('Thrift Prices, Premium Quality', 'Save up to 70% on authentic footwear', 'Browse Collection', '/shop', '#284E3D', '/placeholder-slider-2.jpg', 2, true),
  ('New Arrivals Weekly', 'Fresh stock of Nike, Adidas, New Balance & more', 'See What''s New', '/shop?sort=newest', '#284E3D', '/placeholder-slider-3.jpg', 3, true)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (slug, name, brand, gender, category, condition_label, condition_score, sizes, price, original_price, color, description, condition_notes, images, is_new, is_sale, status)
VALUES 
  ('nike-air-max-90', 'Air Max 90', 'Nike', 'Men', 'Sneakers', 'Excellent 9/10', 9, '[8,9,10,11]'::jsonb, 6500, 9000, 'White/Red', 'Classic Nike Air Max 90 in excellent condition.', 'Minor creasing on toe box.', '[]'::jsonb, false, true, 'active'),
  ('adidas-ultraboost-22', 'Ultraboost 22', 'Adidas', 'Men', 'Running', 'Excellent 9/10', 9, '[9,10,11,12]'::jsonb, 8900, 14000, 'Black/White', 'Adidas Ultraboost 22 with responsive Boost cushioning.', 'Excellent condition.', '[]'::jsonb, false, true, 'active'),
  ('new-balance-990v5', '990v5', 'New Balance', 'Men', 'Lifestyle', 'Very Good 8/10', 8, '[8,9,10,11,12]'::jsonb, 8500, 15000, 'Grey', 'New Balance 990v5 - Made in USA.', 'Light wear on outsole.', '[]'::jsonb, false, true, 'active'),
  ('nike-dunk-low-panda', 'Dunk Low Panda', 'Nike', 'Unisex', 'Sneakers', 'Excellent 9/10', 9, '[6,7,8,9,10,11]'::jsonb, 5800, 8500, 'Black/White', 'Iconic Nike Dunk Low in Panda colorway.', 'Excellent condition.', '[]'::jsonb, false, true, 'active'),
  ('puma-rs-x-reinvention', 'RS-X Reinvention', 'Puma', 'Kids', 'Sneakers', 'Brand New', 10, '[1,2,3,4,5]'::jsonb, 4500, 4500, 'Multi-Color', 'Brand new Puma RS-X for kids.', 'Brand new in box.', '[]'::jsonb, true, false, 'active'),
  ('asics-gel-kayano-29', 'Gel-Kayano 29', 'ASICS', 'Men', 'Running', 'Very Good 8/10', 8, '[9,10,11,12]'::jsonb, 7200, 12000, 'Blue/White', 'ASICS Gel-Kayano 29 stability running shoe.', 'Good condition.', '[]'::jsonb, false, true, 'active'),
  ('converse-chuck-70', 'Chuck 70 High', 'Converse', 'Unisex', 'Casual', 'Excellent 9/10', 9, '[7,8,9,10,11]'::jsonb, 3500, 5500, 'Black', 'Classic Converse Chuck 70 High Top.', 'Minimal wear.', '[]'::jsonb, false, true, 'active'),
  ('vans-old-skool', 'Old Skool', 'Vans', 'Unisex', 'Skate', 'Good 7/10', 7, '[8,9,10,11]'::jsonb, 2800, 4500, 'Black/White', 'Classic Vans Old Skool skate shoes.', 'Some wear on canvas.', '[]'::jsonb, false, true, 'active'),
  ('reebok-classic-leather', 'Classic Leather', 'Reebok', 'Men', 'Lifestyle', 'Very Good 8/10', 8, '[9,10,11,12]'::jsonb, 3200, 5000, 'White', 'Reebok Classic Leather in white.', 'Light yellowing.', '[]'::jsonb, false, true, 'active'),
  ('skechers-max-cushioning', 'Max Cushioning Elite', 'Skechers', 'Women', 'Walking', 'Excellent 9/10', 9, '[6,7,8,9]'::jsonb, 4800, 7500, 'Grey/Pink', 'Skechers Max Cushioning for comfort.', 'Like new condition.', '[]'::jsonb, false, true, 'active')
ON CONFLICT DO NOTHING;

-- Insert vouchers
INSERT INTO vouchers (code, discount_type, discount_value, min_order_amount, max_uses, is_active, expires_at)
VALUES 
  ('WELCOME10', 'percentage', 10, 3000, 100, true, NOW() + INTERVAL '30 days'),
  ('FIRST500', 'fixed', 500, 5000, 50, true, NOW() + INTERVAL '30 days'),
  ('SAVE15', 'percentage', 15, 8000, 25, true, NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;
