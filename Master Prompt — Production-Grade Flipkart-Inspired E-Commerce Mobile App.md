# MASTER PROMPT — BUILD A COMPLETE FLIPKART-INSPIRED E-COMMERCE MOBILE APP

You are a senior mobile architect, UI/UX designer, React Native developer, Java Spring Boot developer, database architect, security engineer, and QA engineer.

Build a **production-quality, full-stack e-commerce mobile application inspired by the provided reference screenshots**.

IMPORTANT:
- The screenshots are UI/UX references.
- Recreate the overall layout, information hierarchy, spacing, navigation patterns, cards, banners, product browsing experience, cart experience, account experience, and grocery/quick-commerce experience.
- DO NOT copy Flipkart trademarks, proprietary logos, copyrighted assets, or exact branded promotional artwork.
- Create an original application identity, logo, colors, banners, and product assets while maintaining a similar premium Indian e-commerce UX.
- The application should feel like a real commercial e-commerce application, not a basic college CRUD project.

==================================================
1. APPLICATION IDENTITY
==================================================

Application name:

"QuickKart"

Create a modern Indian e-commerce platform supporting:

1. E-commerce marketplace
2. Product discovery
3. Search
4. Categories
5. Product details
6. Wishlist
7. Shopping cart
8. Checkout
9. Payments
10. Orders
11. Order tracking
12. Coupons
13. User account
14. Seller marketplace
15. Admin management
16. Quick commerce / grocery section
17. Personalized recommendations
18. Notifications
19. Reviews and Q&A
20. Offers and deals

The app should support both:

- Normal e-commerce
- Quick-commerce / grocery delivery

==================================================
2. TECHNOLOGY STACK
==================================================

MOBILE FRONTEND
----------------

Use:

- React Native
- TypeScript
- Expo or React Native CLI
- React Navigation
- Redux Toolkit
- RTK Query
- Axios
- React Native Reanimated
- React Native Gesture Handler
- React Native SVG
- React Native Maps
- AsyncStorage
- Secure storage for authentication tokens
- Form validation
- Native device APIs where appropriate

Use a clean architecture:

src/

  app/
  navigation/
  screens/
  components/
  features/
  services/
  store/
  hooks/
  utils/
  constants/
  theme/
  assets/
  types/

BACKEND
-------

Use:

- Java 21+
- Spring Boot 3+
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- Redis
- JWT
- Bean Validation
- Lombok
- Maven
- OpenAPI / Swagger
- WebSocket where required

Do NOT unnecessarily create dozens of microservices.

Start with a clean modular monolith architecture that can later be split into microservices.

Recommended backend modules:

auth
users
products
categories
inventory
cart
wishlist
orders
payments
coupons
reviews
recommendations
notifications
seller
admin
delivery
quickcommerce

==================================================
3. UI DESIGN REQUIREMENTS
==================================================

Use the uploaded screenshots as the primary visual reference.

The UI should have:

- Premium modern design
- Rounded cards
- Large promotional banners
- Horizontal product carousels
- Category icons
- Bottom navigation
- Sticky action buttons where appropriate
- Smooth scrolling
- Skeleton loading
- Pull-to-refresh
- Empty states
- Error states
- Loading states
- Responsive layouts
- Proper spacing
- Consistent typography
- High-quality product cards
- Modern icons
- Subtle animations

Do NOT create a generic template-looking UI.

The interface should look like a real high-scale Indian e-commerce application.

==================================================
4. MAIN BOTTOM NAVIGATION
==================================================

Create bottom navigation:

HOME
PLAY
CATEGORIES
ACCOUNT
CART

For the quick-commerce section use:

HOME
CATEGORIES
BUY AGAIN
BASKET

Bottom navigation must:

- remain fixed
- show active state
- use icons
- animate active tab
- preserve navigation state
- display cart/basket badge count

==================================================
5. HOME SCREEN
==================================================

Recreate the structure shown in the reference screenshot.

Top section:

- Status-bar-safe area
- App logo
- Search bar
- Camera/image search button
- Voice search button
- QR/visual search button
- Location selector
- Notification/offer indicator

Create top marketplace shortcuts:

- Shopping
- Minutes
- Travel
- Value Deals

Example:

[ Shopping ]
[ Minutes ]
[ Travel ]
[ Deals ]

These should be horizontally scrollable.

LOCATION COMPONENT
------------------

Display:

HOME
User's selected address

Example:

HOME
No 3/772, Kamarajar Street...

Clicking it opens address selection.

SEARCH BAR
----------

Create:

"Search for products, brands and more"

Include:

- Search icon
- Voice search
- Camera search
- Recent searches
- Trending searches
- Search suggestions

==================================================
6. HOME CATEGORY NAVIGATION
==================================================

Create horizontally scrollable categories:

For You
Fashion
Mobiles
Electronics
Beauty
Home
Appliances
Grocery
Sports
Toys
Furniture
Automobiles

Each category should contain:

- Icon/image
- Category name
- Active indicator

==================================================
7. HOME BANNERS
==================================================

Create a carousel system.

Banner features:

- Auto-slide
- Manual swipe
- Pagination indicators
- CTA buttons
- Promotional text
- Product imagery
- Discount information

Examples:

"Freedom Sale"

"Up to 70% Off"

"Electronics Deals"

"Gaming Laptop Sale"

"Best Smartphone Deals"

Use original generated promotional assets.

==================================================
8. PERSONALIZED SECTION
==================================================

Create:

"Hey [User], still looking for these?"

Display products based on:

- Recently viewed
- Search history
- Wishlist
- Previous purchases

Each card:

- Product image
- Discount badge
- Product title
- Price
- Original price
- Discount percentage
- Rating

==================================================
9. SUGGESTED FOR YOU
==================================================

Create a personalized product recommendation section.

Display a 2-column or 3-column responsive grid.

Example:

Suggested For You

Product Card
Product Card
Product Card

Recommendation algorithm can initially use:

- Category similarity
- Browsing history
- Purchase history
- Wishlist
- Popularity
- Rating
- Price range

Later support ML recommendation APIs.

==================================================
10. DEAL SECTIONS
==================================================

Create:

Top Deals
Best Sellers
Trending Products
Deals of the Day
Recommended For You
Recently Viewed
New Arrivals
Top Rated
Under ₹999
Gaming Deals
Electronics Deals

Each section should support horizontal scrolling.

==================================================
11. PRODUCT CARD
==================================================

Build reusable ProductCard component.

Structure:

--------------------------------
|                              |
|        PRODUCT IMAGE         |
|                              |
|   -20%                       |
--------------------------------
Product Name

★★★★☆ 4.3

₹95,062
₹1,08,990

12% off

[ Add to Cart ]
--------------------------------

Features:

- Wishlist icon
- Discount badge
- Rating
- Assured/trusted badge
- Delivery information
- Add to cart
- Quick buy
- Product image carousel if required

==================================================
12. PRODUCT DETAILS SCREEN
==================================================

Create a complete product details page.

Sections:

Image carousel
Wishlist
Share
Product title
Rating
Review count
Price
MRP
Discount
Bank offers
Coupons
Delivery availability
Seller information
Product highlights
Specifications
Description
Reviews
Questions & Answers
Similar products
Frequently bought together

Bottom sticky bar:

[ Add to Cart ] [ Buy Now ]

==================================================
13. IMAGE SEARCH
==================================================

Implement image-based product search.

User can:

- Open camera
- Select image from gallery
- Upload image
- Search visually similar products

Frontend:

React Native camera/gallery picker.

Backend:

Create image-search endpoint.

Initially implement:

image upload
→ image processing
→ feature extraction/mock embedding
→ similarity search

Design architecture so an AI/ML model can later be integrated.

==================================================
14. VOICE SEARCH
==================================================

Implement voice search.

Example:

User says:

"Show me gaming laptops under 80000"

Convert speech to text.

Extract:

category = gaming laptop
maximumPrice = 80000

Return matching products.

==================================================
15. SEARCH SYSTEM
==================================================

Create advanced search.

Support:

- Keyword search
- Autocomplete
- Typo tolerance
- Filters
- Sorting
- Search history
- Trending searches
- Brand search
- Category search
- Price filtering

Filters:

Price
Brand
Rating
RAM
Storage
Processor
Display
Color
Availability
Discount
Delivery

Sorting:

Relevance
Price low to high
Price high to low
Rating
Newest
Popularity

==================================================
16. CATEGORIES SCREEN
==================================================

Recreate the reference architecture.

LEFT SIDEBAR:

For You
Fashion
Mobiles
Appliances
Electronics
Smart Gadgets
Home
Beauty & Personal Care
Toys & Baby Care
Food & Healthcare
Sports
Furniture
Automotive

RIGHT SIDE:

Popular Stores
New & Upcoming Launches
Recently Viewed Stores
Trending Categories

Use:

3-column grids
rounded image containers
category labels
CTA buttons

==================================================
17. ACCOUNT SCREEN
==================================================

Create account dashboard.

Header:

Hello, [User]

Membership section:

Premium membership

Buttons:

Orders
Wishlist
Coupons
Help Center

Finance:

Personal Loan
EMI
Credit Card
UPI / Pay Later

Recently Viewed

Account Settings

My Activity

Earn With Platform

Feedback & Information

==================================================
18. ACCOUNT SETTINGS
==================================================

Create:

Profile
Manage Devices
Saved Cards
Saved Addresses
Language
Notification Settings
Privacy Center
Reviews
Questions & Answers
Sell on Platform
Terms & Policies
FAQs

==================================================
19. CART SCREEN
==================================================

Recreate the reference screenshot.

Tabs:

Shopping
Minutes/Grocery

If cart is empty:

Illustration

"Your cart is empty!"

[ Shop Now ]

Recently Viewed

Product cards with:

[ Add to Cart ]

If cart contains products:

Deliver to:
User Name
Address

Product

Quantity selector

Price

Discount

Remove

Save for later

Buy now

Protection plans

Price Details

MRP
Discount
Delivery Fee
Coupons
Total Amount

Sticky bottom:

Total
[ Place Order ]

==================================================
20. CHECKOUT
==================================================

Create multi-step checkout.

Step 1:
Address

Step 2:
Delivery

Step 3:
Payment

Step 4:
Order confirmation

Address screen:

Saved addresses
Add new address
Edit
Delete
Set default

==================================================
21. PAYMENT SYSTEM
==================================================

Create payment architecture supporting:

UPI
Credit Card
Debit Card
Net Banking
Wallet
Cash on Delivery
EMI
Buy Now Pay Later

For development:

Create mock payment gateway.

Design backend so Razorpay/Stripe/payment provider can be integrated later.

Never store raw card details.

==================================================
22. ORDER SYSTEM
==================================================

Order states:

PLACED
CONFIRMED
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURNED
REFUNDED

Create order tracking UI.

Example:

✓ Order Placed
✓ Confirmed
✓ Packed
● Shipped
○ Out for Delivery
○ Delivered

Show:

Order ID
Estimated delivery
Items
Price
Address
Payment
Invoice
Cancel Order
Return
Replace
Track

==================================================
23. WISHLIST
==================================================

Implement:

Add/remove wishlist
Wishlist count
Move to cart
Price drop notification
Stock notification

==================================================
24. COUPONS
==================================================

Create coupon system.

Examples:

WELCOME50
SAVE500
ELECTRO10
FIRSTORDER

Backend validates:

minimum amount
maximum discount
expiry
user eligibility
category
brand
usage limit

==================================================
25. QUICK COMMERCE / MINUTES
==================================================

Create a separate quick-commerce experience based on the second reference UI.

Top navigation:

Shopping
Minutes
Travel
Deals

When Minutes is selected:

Show delivery address.

Example:

Delivering to this location

Search:

"Search in Minutes"

Categories:

For You
Rakhi
Fresh
Grocery
Beauty
Electronics
Snacks
Beverages
Household

Hero banner:

Promotional campaign

Category cards:

Cooking Needs
Cleaning Needs
Home Needs
Supplements

Show:

From ₹49
Up to 60% Off

==================================================
26. QUICK COMMERCE PRODUCT SYSTEM
==================================================

Quick-commerce products must have:

- Local inventory
- Store/dark-store association
- Real-time stock
- Delivery ETA
- Distance
- Delivery fee
- Substitution options

Example:

Product
₹149

In stock

Delivery:
13 minutes

==================================================
27. QUICK COMMERCE BASKET
==================================================

Create basket screen.

Show:

Items
Quantity
Substitution preference
Delivery fee
Taxes
Coupon
Total

Delivery ETA:

13 minutes

CTA:

[ Place Order ]

==================================================
28. DELIVERY SYSTEM
==================================================

Create delivery architecture.

Entities:

DeliveryPartner
DeliveryOrder
DeliveryLocation
DeliveryZone
DeliveryTracking

Support:

GPS location
Order tracking
ETA
Delivery partner assignment

For initial development:

Use simulated delivery tracking.

Later integrate:

Google Maps / Mapbox

==================================================
29. SELLER APPLICATION
==================================================

Create seller functionality.

Seller can:

Register
Login
Create store
Add products
Edit products
Delete products
Upload product images
Manage inventory
Manage orders
Update shipping
View sales
View revenue
Manage coupons

Seller dashboard:

Revenue
Orders
Products
Inventory
Customers
Analytics

==================================================
30. ADMIN APPLICATION
==================================================

Create admin functionality.

Admin can:

Manage users
Manage sellers
Approve sellers
Manage products
Manage categories
Manage banners
Manage coupons
Manage orders
Manage refunds
Manage reviews
Manage complaints
Manage delivery zones
Manage inventory
View analytics

Dashboard:

Total Users
Orders
Revenue
Products
Sellers
Pending Approvals
Returns
Refunds

==================================================
31. AUTHENTICATION
==================================================

Implement:

Signup
Login
Logout
JWT
Refresh token
Forgot password
Reset password
OTP verification
Email verification
Google login architecture

Roles:

CUSTOMER
SELLER
ADMIN
DELIVERY_PARTNER

Secure all protected endpoints.

==================================================
32. DATABASE DESIGN
==================================================

Create MySQL tables:

users
roles
user_roles
addresses
products
product_images
categories
brands
inventory
stores
sellers
carts
cart_items
wishlists
wishlist_items
orders
order_items
payments
coupons
coupon_usage
reviews
questions
answers
banners
notifications
search_history
recently_viewed
recommendations
delivery_orders
delivery_partners
returns
refunds

Use:

Primary keys
Foreign keys
Indexes
Unique constraints
Timestamps
Soft delete where appropriate

==================================================
33. BACKEND API DESIGN
==================================================

Create REST APIs.

AUTH:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

PRODUCT:

GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

SEARCH:

GET /api/search
GET /api/search/suggestions

CATEGORY:

GET /api/categories
GET /api/categories/{id}/products

CART:

GET /api/cart
POST /api/cart/items
PUT /api/cart/items/{id}
DELETE /api/cart/items/{id}

WISHLIST:

GET /api/wishlist
POST /api/wishlist/{productId}
DELETE /api/wishlist/{productId}

ORDERS:

POST /api/orders
GET /api/orders
GET /api/orders/{id}
POST /api/orders/{id}/cancel
POST /api/orders/{id}/return

PAYMENT:

POST /api/payments/create
POST /api/payments/verify

COUPONS:

GET /api/coupons
POST /api/coupons/apply

REVIEWS:

POST /api/products/{id}/reviews
GET /api/products/{id}/reviews

RECOMMENDATIONS:

GET /api/recommendations
GET /api/products/{id}/similar

==================================================
34. RECOMMENDATION ENGINE
==================================================

Implement a basic recommendation engine.

Inputs:

Browsing history
Search history
Cart
Wishlist
Purchases
Categories
Brands
Price range
Ratings

Recommendation strategies:

1. Recently viewed
2. Frequently bought together
3. Similar products
4. Popular products
5. Category-based recommendation
6. Personalized recommendation

Architecture:

RecommendationService

Keep it replaceable with a future ML model.

==================================================
35. AI CHATBOT
==================================================

Add an AI shopping assistant.

Example:

User:

"I need a gaming laptop under ₹80,000 with RTX graphics."

Assistant:

"Here are 6 gaming laptops matching your requirements."

The chatbot should understand:

Budget
Category
Brand
Specifications
Use case
Preferences

Support:

Product recommendation
Product comparison
Order status
Return policy
FAQ
Coupon assistance

Design an LLM integration interface so Gemini/OpenAI/other LLM providers can be plugged in through configuration.

==================================================
36. PRODUCT COMPARISON
==================================================

Allow users to select multiple products.

Example:

Compare:

Acer Nitro
Lenovo LOQ
HP Victus

Display:

Price
CPU
GPU
RAM
Storage
Display
Battery
Weight
Rating
Warranty

Highlight best values.

==================================================
37. NOTIFICATIONS
==================================================

Support:

Push notifications
Order updates
Price drops
Wishlist alerts
Offers
Delivery updates
Back-in-stock notifications

Create notification center.

==================================================
38. PERFORMANCE
==================================================

Optimize the app for large catalogs.

Use:

Pagination
Lazy loading
Image caching
Skeleton loading
Memoization
FlatList optimization
Debouncing
API caching
Redis caching

Never load thousands of products into the mobile application at once.

==================================================
39. SECURITY
==================================================

Implement:

JWT authentication
Password hashing
Role-based authorization
Input validation
Rate limiting
CORS
Secure headers
SQL injection protection
XSS protection
Secure token storage
Payment security
API authorization

Never expose:

Database credentials
JWT secrets
Payment secrets
LLM API keys

Use environment variables.

==================================================
40. UI STATES
==================================================

Every screen must support:

Loading
Success
Empty
Error
Offline
Retry

Example:

Skeleton product cards while loading.

Empty wishlist:

"No products in your wishlist yet."

Empty cart:

"Your cart is empty!"

==================================================
41. ANIMATIONS
==================================================

Use subtle animations:

Card press
Add-to-cart animation
Wishlist heart animation
Tab transition
Banner transition
Skeleton shimmer
Product image transition
Bottom sheet animation
Checkout transitions

Do NOT overuse animations.

The app should remain fast.

==================================================
42. RESPONSIVE DESIGN
==================================================

Optimize for:

Small Android phones
Large Android phones
Different screen densities
Portrait mode

Use responsive dimensions rather than hardcoded pixel positioning.

==================================================
43. DESIGN SYSTEM
==================================================

Create a centralized theme:

colors.ts
typography.ts
spacing.ts
radius.ts
shadows.ts

Example design tokens:

Primary
Secondary
Background
Surface
Text
Muted Text
Success
Warning
Error

Use a consistent 8-point spacing system.

==================================================
44. COMPONENT LIBRARY
==================================================

Create reusable components:

SearchBar
ProductCard
HorizontalProductList
CategoryCard
BannerCarousel
SectionHeader
RatingStars
PriceDisplay
DiscountBadge
LocationSelector
BottomNavigation
QuantitySelector
CouponCard
AddressCard
OrderCard
EmptyState
LoadingSkeleton
ErrorState
Modal
BottomSheet
Button
Input
Chip
FilterPanel

Do not duplicate UI code.

==================================================
45. NAVIGATION
==================================================

Implement:

AuthStack

MainTabNavigator

HomeStack
CategoryStack
ProductStack
CartStack
AccountStack

Deep links:

quickkart://product/{id}

quickkart://category/{id}

quickkart://order/{id}

==================================================
46. OFFLINE SUPPORT
==================================================

Cache:

Recently viewed
Categories
Product details
Cart where appropriate

Show:

"You are offline"

Provide retry functionality.

==================================================
47. TESTING
==================================================

Create:

Unit tests
Integration tests
API tests
Component tests
Navigation tests
Authentication tests
Cart tests
Checkout tests

Critical scenarios:

Signup
Login
Search
Add to cart
Remove from cart
Wishlist
Checkout
Payment
Order
Cancel
Return

==================================================
48. PROJECT STRUCTURE
==================================================

Create:

/mobile

  src/
    app/
    navigation/
    components/
    screens/
    features/
      auth/
      home/
      products/
      categories/
      cart/
      wishlist/
      orders/
      account/
      search/
      recommendations/
      minutes/
    services/
    store/
    hooks/
    utils/
    theme/
    assets/

/backend

  src/main/java/com/quickkart/

    auth/
    user/
    product/
    category/
    inventory/
    cart/
    wishlist/
    order/
    payment/
    coupon/
    review/
    recommendation/
    notification/
    seller/
    admin/
    delivery/
    quickcommerce/

==================================================
49. DEVELOPMENT APPROACH
==================================================

Do NOT generate the entire application as one giant file.

Build feature-by-feature.

PHASE 1
-------

Create:

- React Native project
- TypeScript
- Navigation
- Theme
- Bottom navigation
- Home screen
- Categories
- Account
- Cart

PHASE 2
-------

Build:

- Authentication
- Products
- Search
- Product details
- Wishlist
- Cart

PHASE 3
-------

Build:

- Address
- Checkout
- Coupons
- Orders
- Payment mock

PHASE 4
-------

Build:

- Seller
- Admin
- Inventory
- Delivery

PHASE 5
-------

Build:

- Quick commerce
- Minutes
- Local inventory
- Delivery ETA

PHASE 6
-------

Build:

- AI shopping assistant
- Recommendations
- Voice search
- Image search

PHASE 7
-------

Optimization:

- Redis
- caching
- pagination
- image optimization
- database indexes
- security
- testing

==================================================
50. SAMPLE DATA
==================================================

Create realistic seed data.

Categories:

Mobiles
Laptops
Electronics
Fashion
Beauty
Home
Appliances
Gaming
Sports
Grocery

Products:

Gaming laptops
Smartphones
Headphones
Smart watches
Monitors
Keyboards
Mice
TVs
Shoes
Clothing
Groceries

Use royalty-free or generated placeholder product images.

Do not use copyrighted Flipkart product assets.

==================================================
51. HOME SCREEN VISUAL STRUCTURE
==================================================

The final home screen should visually follow this hierarchy:

TOP
↓

Logo / Shopping shortcuts

↓

Location selector

↓

Search bar

↓

Category navigation

↓

Hero promotional carousel

↓

Personalized products

↓

Advertisement/promotional banner

↓

Suggested For You

↓

Top Deals

↓

Trending Products

↓

Recently Viewed

↓

More categories

↓

Bottom Navigation

==================================================
52. CATEGORY SCREEN VISUAL STRUCTURE
==================================================

LEFT:

Category sidebar

RIGHT:

Popular Stores

New Launches

Product/category grid

Recently Viewed

Trending

Bottom navigation

==================================================
53. ACCOUNT SCREEN VISUAL STRUCTURE
==================================================

Profile header

↓

Orders | Wishlist

Coupons | Help

↓

Finance Options

↓

UPI / Payment options

↓

Recently Viewed

↓

Account Settings

↓

My Activity

↓

Sell on Platform

↓

Terms / FAQs

↓

Bottom Navigation

==================================================
54. CART SCREEN VISUAL STRUCTURE
==================================================

Cart header

↓

Shopping | Minutes/Grocery

↓

Delivery Address

↓

Cart Products

↓

Protection plan

↓

Price Details

↓

Savings

↓

Sticky:

Total Amount       Place Order

==================================================
55. QUICK COMMERCE HOME
==================================================

Top:

Shopping | Minutes | Travel | Deals

↓

Location

↓

Delivery ETA

↓

Search

↓

Categories

↓

Hero banner

↓

Sponsor banner

↓

Cooking Needs

Cleaning Needs

Home Needs

Supplements

↓

Offers

↓

Buy Again

↓

Bottom navigation

==================================================
56. BACKEND ARCHITECTURE
==================================================

Use layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

For example:

ProductController
      ↓
ProductService
      ↓
ProductRepository
      ↓
MySQL

Use DTOs.

Never expose JPA entities directly from APIs.

Use:

Request DTO
Response DTO
Mapper
Validation
Exception Handler

Create:

GlobalExceptionHandler

Return standardized API responses.

Example:

{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}

==================================================
57. ERROR HANDLING
==================================================

Implement centralized error handling.

Examples:

400 BAD_REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT_FOUND
409 CONFLICT
422 VALIDATION_ERROR
500 INTERNAL_SERVER_ERROR

Mobile app must display user-friendly messages.

==================================================
58. API DOCUMENTATION
==================================================

Configure Swagger/OpenAPI.

Document:

Authentication
Products
Categories
Cart
Orders
Payments
Coupons
Reviews
Seller
Admin
Delivery

==================================================
59. DATABASE PERFORMANCE
==================================================

Add indexes for:

product.name
product.category_id
product.brand_id
product.price
product.rating
inventory.store_id
orders.user_id
orders.status
orders.created_at

Use pagination.

Example:

GET /api/products?page=0&size=20

==================================================
60. FINAL QUALITY REQUIREMENT
==================================================

The finished application must feel like:

A real production e-commerce application.

NOT:

- a CRUD demo
- a college project
- a static UI
- a collection of disconnected screens

All screens must be connected.

Example:

Home
→ Search
→ Product
→ Add to Cart
→ Cart
→ Address
→ Checkout
→ Payment
→ Order
→ Tracking

Account
→ Orders
→ Order Details
→ Return

Categories
→ Category
→ Product Listing
→ Product Details

Minutes
→ Grocery
→ Basket
→ Checkout
→ Delivery tracking

==================================================
61. IMPORTANT CODING RULES
==================================================

1. Write clean, maintainable TypeScript.
2. Write clean Java/Spring Boot.
3. Follow SOLID principles.
4. Use reusable components.
5. Avoid duplicated code.
6. Avoid giant components.
7. Use meaningful names.
8. Add validation.
9. Add error handling.
10. Use environment variables.
11. Never hardcode secrets.
12. Do not use fake APIs when backend APIs are available.
13. Use realistic seed data.
14. Make every feature actually functional.
15. Do not leave TODO placeholders for core functionality.
16. Do not generate unnecessary microservices.
17. Optimize database queries.
18. Use pagination.
19. Make UI responsive.
20. Make navigation fully functional.

==================================================
62. AI CODING AGENT INSTRUCTIONS
==================================================

Before writing code:

1. Analyze the complete requirements.
2. Inspect the provided reference screenshots.
3. Create the architecture.
4. Create the database schema.
5. Create API contracts.
6. Create navigation structure.
7. Create the design system.
8. Then implement feature-by-feature.

After each major feature:

- Run the application.
- Check compilation.
- Fix TypeScript errors.
- Fix Java compilation errors.
- Fix navigation errors.
- Fix API integration errors.
- Test the feature.
- Continue only after the previous feature works.

Never blindly generate thousands of lines of code.

If a dependency is required, explain why and install/configure it.

==================================================
63. DELIVERABLES
==================================================

Generate:

1. Complete React Native mobile application
2. Complete Spring Boot backend
3. MySQL database schema
4. Database seed data
5. REST APIs
6. Authentication
7. Product catalog
8. Search
9. Cart
10. Wishlist
11. Checkout
12. Orders
13. Payment architecture
14. Seller functionality
15. Admin functionality
16. Quick-commerce functionality
17. Recommendation engine
18. AI shopping assistant
19. Voice search architecture
20. Image search architecture
21. Notifications
22. Tests
23. Swagger documentation
24. README
25. Environment configuration example

==================================================
64. START NOW
==================================================

Start by creating the complete project architecture.

Then implement:

PHASE 1:

1. Project initialization
2. Theme/design system
3. Navigation
4. Bottom navigation
5. Home screen
6. Categories screen
7. Account screen
8. Cart screen
9. Reusable components
10. Mock product data

Make the UI closely follow the structure and visual quality of the provided screenshots while using an ORIGINAL brand identity.

After Phase 1 is working, proceed to Phase 2.

Do not stop at UI mockups.

The final goal is a fully functional full-stack e-commerce mobile application.