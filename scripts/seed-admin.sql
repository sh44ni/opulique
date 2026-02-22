-- Create initial admin user
-- Password: admin123 (bcrypt hash)
-- IMPORTANT: Change this password after first login!

INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@footfits.pk',
  '$2a$10$rN8qN5YN5YN5YN5YN5YN5.N5YN5YN5YN5YN5YN5YN5YN5YN5YN5Y',  -- This is a placeholder, run the seed script instead
  'Admin User'
)
ON CONFLICT (email) DO NOTHING;

-- To create a proper password hash, use the seed-admin script:
-- npm install -g tsx
-- npx tsx scripts/seed-admin.ts
