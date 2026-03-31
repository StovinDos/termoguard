# Account Page Orders Implementation

This document describes the changes made to implement real order data, customer rank, and join date functionality on the account page.

## Changes Made

### Backend Changes

#### 1. Order Entity (`Order.java`)
- Created new `Order` entity with fields:
  - `id`: Primary key
  - `user`: Foreign key to User entity
  - `orderNumber`: Unique order identifier (e.g., TG-A8F2C1)
  - `productName`: Name of the product
  - `quantity`: Number of items ordered
  - `total`: Total price (BigDecimal)
  - `status`: Order status (PROCESSING, SHIPPED, DELIVERED)
  - `createdAt`: Order creation timestamp

#### 2. OrderRepository (`OrderRepository.java`)
- Created repository interface for Order entity
- Methods:
  - `findByUserIdOrderByCreatedAtDesc(Long userId)`: Get all orders for a user
  - `existsByOrderNumber(String orderNumber)`: Check if order number exists

#### 3. OrderDto (`OrderDto.java`)
- Created `OrderResponse` DTO for API responses
- Maps Order entity to JSON response

#### 4. OrderService (`OrderService.java`)
- Business logic for order operations
- Methods:
  - `getUserOrders(Long userId)`: Get all orders for a user
  - `updateCustomerRank(Long userId)`: Calculate and update customer rank based on total spending
  - `calculateRank(BigDecimal totalSpent)`: Calculate rank tiers:
    - Bronze: < $100
    - Silver: $100 - $299.99
    - Gold: $300 - $599.99
    - Platinum: $600+

#### 5. OrderController (`OrderController.java`)
- REST API endpoint: `GET /api/orders`
- Returns all orders for the authenticated user

#### 6. User Entity Updates (`User.java`)
- Added `customerRank` field (BRONZE, SILVER, GOLD, PLATINUM)
- Added `CustomerRank` enum
- Default value: BRONZE

#### 7. UserDto Updates (`AuthDto.java`)
- Added `customerRank` field to UserDto
- Included in authentication responses

#### 8. CustomUserDetailsService Updates
- Added `getUserIdFromEmail(String email)` method
- Used by controllers to get user ID from authenticated principal

### Frontend Changes

#### 1. AccountPage Component (`AccountPage.jsx`)
- Added state for orders and loading status
- Added `useEffect` hook to fetch orders from `/api/orders` endpoint
- Transform backend response to match frontend format
- Display loading spinner while fetching orders
- Show "No orders yet" message if no orders exist
- Fall back to mock orders in demo mode or on error
- Use `user.customerRank` from backend if available
- Calculate rank from total spent as fallback

### Database Schema

The following tables will be automatically created by Hibernate:

#### `orders` table
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    order_number VARCHAR(20) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `users` table updates
- Added `customer_rank` column: VARCHAR(20) with default 'BRONZE'

## How to Test

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Register a New User
- Navigate to http://localhost:5173/register
- Create a new account

### 4. Add Sample Orders
- Connect to your PostgreSQL database
- Find your user ID: `SELECT id, email FROM users WHERE email = 'your-email@example.com';`
- Edit `backend/src/main/resources/sample-orders.sql` and replace `<USER_ID>` with your actual user ID
- Run the SQL script to insert sample orders

### 5. Update Customer Rank
The customer rank can be updated in two ways:

#### Option A: Manually via SQL
```sql
-- Calculate total spent
SELECT SUM(total) FROM orders WHERE user_id = <USER_ID>;

-- Update rank based on total
UPDATE users SET customer_rank = 'PLATINUM' WHERE id = <USER_ID>;
```

#### Option B: Programmatically
Call the `OrderService.updateCustomerRank(userId)` method after orders are placed (this would typically be done in a checkout/order creation endpoint).

### 6. View Account Page
- Log in with your account
- Navigate to the Account page
- You should see:
  - Your actual orders from the database
  - Correct total orders count
  - Correct total spent amount
  - Your customer rank (Bronze/Silver/Gold/Platinum)
  - Your join date (Member Since)

## API Endpoints

### GET /api/orders
Returns all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "orderNumber": "TG-A8F2C1",
    "productName": "TermoGuard Core",
    "quantity": 1,
    "total": 49.99,
    "status": "DELIVERED",
    "createdAt": "2026-02-14T10:00:00Z"
  }
]
```

## Customer Rank Tiers

The customer rank is automatically calculated based on total spending:

| Rank     | Total Spent     | Color  |
|----------|----------------|--------|
| Bronze   | < $100         | Green  |
| Silver   | $100 - $299.99 | Cyan   |
| Gold     | $300 - $599.99 | Amber  |
| Platinum | $600+          | Violet |

## Join Date

The join date (Member Since) is automatically tracked using the `createdAt` field on the User entity. This field is set when the user registers and is immutable. It's displayed in the format "Mar 2026" on the account page.

## Demo Mode

When the application is in demo mode (backend not connected), the account page will:
- Use mock order data
- Calculate rank from mock data
- Still display the user's actual join date if authenticated

## Future Enhancements

Potential improvements that could be added:

1. **Order Creation Endpoint**: `POST /api/orders` to create new orders
2. **Order Details Page**: View individual order details with tracking
3. **Order Status Updates**: Track order progress through different statuses
4. **Rank History**: Track when user achieved each rank
5. **Rank Benefits**: Display benefits for each tier
6. **Order Filtering**: Filter by date range, status, or product
7. **Export Orders**: Download order history as CSV/PDF
8. **Order Notifications**: Email notifications for order status changes
9. **Automatic Rank Updates**: Trigger rank update after order completion
10. **Rank Badges**: Visual badges for customer rank achievement
