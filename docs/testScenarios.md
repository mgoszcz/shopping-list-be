# Category List
1. User can get list of categories (200)
2. User can get specific category
  - 404 is returned when non existing id is provided
3. User can add category (201)
  - 400 is returned for wrong request
  - 409 is returned if the same category already exist

# Article List
1. User can get list of articles (200)
2. User can get specific article
  - 404 is returned when non existing id is provided
3. User can add article (201)
  - 400 is returned for wrong request
  - 404 is returned if category does not exist
  - 409 is returned if article with the same name and category already exist
4. User can update article (204)
  - If article does not exist then new is created (201)
  - 400 is returned for wrong request
  - 404 is returned if category does not exist
  - 409 is returned if article with the same name and category already exist
  - if category used by updated article is not used anymore then it should be autmatically deleted
5. User can delete article (204)
  - 404 is returned when non existing id is provided
  - 409 is returned if article is in shopping cart
  - if category used by removed article is not used anymore then it should be autmatically deleted

# Shops
1. User can get list of shops (200)
2. User can get specific shop
  - 404 is returned when non existing id is provided
3. User can add shop (201)
  - 400 is returned for wrong request
  - 409 is returned if the same shop already exist
4. User can update shop (204)
  - If shop does not exist then new one is created (201)
  - 400 is returned for wrong request
  - 409 is returned if the same shop already exist
5. User can delete shop (204)
    - 404 is returned when non existing id is provided
    - if shop is used in CurrentShop the CurrentShop should be cleaned
    - all categories for removed shop should be removed

# Shop Categories
1. User can get list of shop categories (200)
  - If there are no categories for specific shop then empty array is returned
2. User can set shop categories (204)
  - If there are no categories for specific shop then they are added to database
  - If there are categories for specific shop then they are removed and uploaded with new order
  - If an empty array is sent then all categories for specific shop are removed
  - 400 is returned for wrong request
  - 404 is returned if category does not exist
3. If category is removed (when article is removed or updated) then it should be removed from shop categories

# CurrentShop
1. User can get current shop (200)
2. User can set current shop (204)
  - 400 is returned for wrong request
  - 404 is returned if shop does not exist

# Shopping Cart
1. User can get shopping cart (200)
  - items can be returned in shop or alphabetical order (parameter)
  - user can get all, only checked, or only unchecked items (parameter)
2. User can get specific item from shopping cart
  - 404 is returned when non existing id is provided
3. User can add item to shopping cart (201)
  - Adding item to cart should increment `selection` field value for articla
  - 400 is returned for wrong request
  - 404 is returned if article does not exist
  - 409 is returned if article is already in shopping cart
4. User can update item in shopping cart (204)
  - Only `quantity` and `checked` can be updated
  - 400 is returned for wrong request
  - 404 is returned if item does not exist
5. User can delete item from shopping cart (204)
  - 404 is returned when non existing id is provided
  - if after removal database is empty then it should reset id setting for shopping cart back to 1
  - Removing unchecked item from cart should decrement `selection` field value for article
6. User can delete all articles from shopping cart (204)
  - all, only checked, or only unchecked items can be removed (parameter)
  - if after removal database is empty then it should reset id setting for shopping cart back to 1
  - 400 is returned for wrong request
  - Removing unchecked item from cart should decrement `selection` field value for article

# Last Modified
1. User can get last modified date (200)
  - Categories
  - Articles
  - Shops
  - Shop Categories
  - Current Shop
  - Shopping Cart
2. If no date for specific item then 404 is returned
3. Categories
   - adding new category will update last modified date
   - removing category will update last modified (when last article using this category is removed or updated by changing category)
4. Articles
   - adding new article will update last modified date
   - removing article will update last modified date
   - updating article will update last modified date
5. Shops
  - adding new shop will update last modified date
  - removing shop will update last modified date
  - updating shop will update last modified date
6. Shop Categories
  - updating shop categories will update last modified date
  - removing shop using categories will update last modified date
  - removing category used in shop categories will update last modified date
7. Current Shop
  - updating current shop will update last modified date
  - clearing current shop after shop removal will update last modified date
8. Shopping Cart
  - adding new item to shopping cart will update last modified date
  - removing item from shopping cart will update last modified date
  - updating item in shopping cart will update last modified date
  - removing all items from shopping cart will update last modified date