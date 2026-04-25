-- IsraOrganics Seed Data
-- Run AFTER schema.sql
-- Admin password is: Admin123! (hashed with bcrypt, 12 rounds)

USE israorganics;

-- ─── Admin Account ────────────────────────────────────────────────────────────
INSERT INTO admins (email, password_hash) VALUES
('admin@israorganics.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewbk7UFkJ6h3B9jm');

-- ─── Products ─────────────────────────────────────────────────────────────────
INSERT INTO products (name, description, price, stock, image_url, product_type, hair_type_codes) VALUES

-- Straight / Wavy hair (1a–2c)
('SilkSmooth Clarifying Shampoo', 'Gently removes buildup without stripping natural oils. Ideal for fine, straight hair.', 12.99, 50, 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400', 'shampoo', '1a,1b,1c,2a,2b,2c'),
('WaveBoost Hydrating Conditioner', 'Lightweight conditioner that enhances natural wave pattern without weighing hair down.', 14.99, 45, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 'conditioner', '2a,2b,2c'),
('Frizz-Away Leave-In Treatment', 'Controls frizz and adds shine to wavy hair. Apply to damp hair for best results.', 18.99, 30, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', 'treatment', '2a,2b,2c'),

-- Curly hair (3a–3c)
('CurlDefine Moisturising Shampoo', 'Sulphate-free formula that cleanses while preserving curl definition and moisture.', 16.99, 60, 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400', 'shampoo', '3a,3b,3c'),
('CurlQuench Deep Conditioner', 'Intense moisture treatment for bouncy, defined curls. Leave in for 15–30 minutes.', 22.99, 40, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', 'conditioner', '3a,3b,3c'),
('Curl Activating Gel', 'Defines and holds curls all day long without crunch. Enriched with aloe vera and flaxseed.', 15.99, 55, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', 'gel', '3a,3b,3c'),
('Protein Repair Treatment', 'Strengthens damaged curls with keratin and wheat protein. Use monthly for best results.', 28.99, 25, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'treatment', '3b,3c,4a'),
('Jamaican Black Castor Oil', 'Promotes hair growth and seals in moisture. Ideal for scalp massages and hair sealing.', 19.99, 70, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 'oil', '3a,3b,3c,4a,4b,4c'),

-- Coily / Kinky hair (4a–4c)
('CoilyClean Moisturising Shampoo', 'Co-wash formula that cleanses without disrupting the natural moisture balance of coily hair.', 17.99, 50, 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400', 'shampoo', '4a,4b,4c'),
('Shea Butter Deep Moisture Mask', 'Rich, creamy mask packed with shea butter and argan oil. Restores elasticity to type 4 hair.', 26.99, 35, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', 'treatment', '4a,4b,4c'),
('Kinky Coil Defining Cream', 'Defines and elongates coils while fighting shrinkage. Keeps hair moisturised for days.', 21.99, 45, 'https://images.unsplash.com/photo-1520975916090-f8c257b7f6b6?w=400', 'moisturizer', '4a,4b,4c'),
('Creamy Crack Relaxer — Mild', 'Professional-grade mild relaxer for type 4 hair. Includes neutralising shampoo. Use with care.', 24.99, 20, 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400', 'relaxer', '4a,4b,4c'),
('Creamy Crack Relaxer — Regular', 'Regular-strength relaxer for stubborn, coarse type 4 hair. Includes conditioning treatment.', 27.99, 18, 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=400', 'relaxer', '4b,4c'),
('LOC Method Moisturiser', 'Step 2 of the Leave-in, Oil, Cream method. Locks in moisture and reduces breakage.', 23.99, 40, 'https://images.unsplash.com/photo-1520975916090-f8c257b7f6b6?w=400', 'moisturizer', '4a,4b,4c'),
('Scalp Stimulating Oil', 'Peppermint and tea tree oil blend that stimulates the scalp and promotes healthy hair growth.', 16.99, 60, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 'oil', '1a,1b,1c,2a,2b,2c,3a,3b,3c,4a,4b,4c'),

-- Universal / All hair types
('Hydrating Mist Spray', 'Refreshes and re-moisturises any hair type between wash days. Infused with glycerin and rose water.', 11.99, 80, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', 'moisturizer', '1a,1b,1c,2a,2b,2c,3a,3b,3c,4a,4b,4c'),
('Argan Oil Serum', 'Adds shine and eliminates frizz across all hair types. A small amount goes a long way.', 29.99, 35, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 'oil', '1a,1b,1c,2a,2b,2c,3a,3b,3c,4a,4b,4c');
