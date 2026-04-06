-- Sample Orders Data for Testing
-- This script creates sample orders for testing the account page functionality.
-- Run this script after registering a user to see orders on the account page.

-- Note: Replace <USER_ID> with the actual user ID from your users table
-- You can find your user ID by running: SELECT id, email FROM users;

-- Sample orders for demonstration
-- These match the mock data that was originally in the frontend
INSERT INTO orders (user_id, order_number, product_name, quantity, total, status, created_at) VALUES
(<USER_ID>, 'TG-A8F2C1', 'TermoGuard Core', 1, 49.99, 'DELIVERED', '2026-02-14T10:00:00Z'),
(<USER_ID>, 'TG-B3D7E9', 'TermoGuard Pro', 2, 239.98, 'DELIVERED', '2026-01-28T14:30:00Z'),
(<USER_ID>, 'TG-C5A1F4', 'TermoGuard Mesh', 1, 199.99, 'DELIVERED', '2025-12-03T09:15:00Z'),
(<USER_ID>, 'TG-D9B2G6', 'TermoGuard Core', 3, 149.97, 'DELIVERED', '2025-10-17T16:45:00Z');

-- After inserting orders, update the customer rank based on total spending
-- The OrderService.updateCustomerRank() method can be called via API
-- Or you can manually update the rank:
-- UPDATE users SET customer_rank = 'PLATINUM' WHERE id = <USER_ID>;
