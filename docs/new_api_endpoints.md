New API endpoints - draft

# /shopping_articles

## this endpoint will provide an access to shopping articles in database.

`GET /shopping_articles`
returns list of all articles

```json
[
  {
    "id": 1,
    "name": "article1",
    "category": {
      "id": 1,
      "name": "category1"
    },
    "selection": 1
  },
  {
    "id": 2,
    "name": "article2",
    "category": {
        "id": 2,
        "name": "category2"
    },
    "selection": 1
  }
]
```
### Responses
- 200 - OK

`GET /shopping_articles/:id`
return specific article
### Responses
- 200 - OK
- 404 - Not found

`POST /shopping_articles`
create new article

```json
{
  "name": "article3",
  "category": {
    "id": 3
  }
}
```
### Responses
- 201 - Created
```json
{
    "selection": 1,
    "id": 526,
    "name": "new article",
    "category_id": 1,
    "updatedAt": "2025-01-01T18:02:44.649Z",
    "createdAt": "2025-01-01T18:02:44.649Z"
}
```
- 400 - Bad request
- 404 - Not found (category not found)
- 409 - Conflict (article already exists)

`PUT /shopping_articles/:id`
update specific article

```json
{
  "name": "article3",
  "category": {
    "id": 3
  }
}
```
### Responses
- 201 - Created (if article does not exist)
```json
{
    "selection": 1,
    "id": 526,
    "name": "new article",
    "category_id": 1,
    "updatedAt": "2025-01-01T18:02:44.649Z",
    "createdAt": "2025-01-01T18:02:44.649Z"
}
```
- 204 - No content (if article exists and updated)
- 400 - Bad request
- 404 - Not found (category not found)
- 409 - Conflict (article already exists)

`DELETE /shopping_articles/:id`
delete specific article
### Responses
- 204 - No content
- 404 - Not found

# /shopping_cart

## this endpoint will provide an access to articles selected by user for shopping list (`hopping_list` in old API)

`GET /shopping_cart`
returns list of all articles selected by user
### Query parameters:
- `checked` - boolean, if true return only checked articles
- `unchecked` - boolean, if true return only unchecked articles
- `sort` - string, sort articles by name (`alpha`) or category order in shop (`byShop`). ByShop is default value

```json
[
  {
    "id": 1,
    "article": {
      "id": 1,
      "name": "article1"
    },
    "category": {
      "id": 1,
      "name": "category1"
    },
    "quantity": 1,
    "checked": false
  },
  {
    "id": 2,
    "article": {
      "id": 2,
      "name": "article2"
    },
    "category": {
      "id": 2,
      "name": "category2"
    },
    "quantity": 2,
    "checked": true
  }
]
```
### Responses
- 200 - OK

`GET /shopping_cart/:id`
return specific article selected by user 
### Responses
- 200 - OK
- 404 - Not found

`POST /shopping_cart`
add article selected by user

```json
{
  "article": { "id": 3 }
}
```
### Responses
- 201 - Created
```json
{
    "id": 5,
    "article_id": 134,
    "quantity": 1,
    "checked": false,
    "updatedAt": "2025-01-01T18:06:19.973Z",
    "createdAt": "2025-01-01T18:06:19.973Z"
}
```
- 400 - Bad request
- 404 - Not found (article not found)
- 409 - Conflict (article already exists)

`PUT /shopping_cart/:id`
update specific article selected by user

```json
{
  "quantity": 2,
  "checked": false
}
```
### Responses
- 204 - No content
- 404 - Not found

`DELETE /shopping_cart/:id`
remove article from cart
### Responses
- 204 - No content
- 404 - Not found

`DELETE /shopping_cart`
remove all articles from cart
### Query parameters:
- `checked` - boolean, if true remove only checked articles
- `unchecked` - boolean, if true remove only unchecked articles
- ### Responses
- 204 - No content
- 400 - Bad request

# /categories

## this endpoint will provide an access to categories in database.

`GET /categories`
returns list of all categories

```json
[
  {
    "id": 1,
    "name": "category1"
  },
  {
    "id": 2,
    "name": "category2"
  }
]
```
### Responses
- 200 - OK

`GET /categories/:id`
return specific category
### Responses
- 200 - OK
- 404 - Not found

`POST /categories`
create new category

```json
{
  "name": "category3"
}
```
### Responses
- 201 - Created
```json
{
    "id": 53,
    "name": "new category",
    "updatedAt": "2025-01-01T17:57:29.129Z",
    "createdAt": "2025-01-01T17:57:29.129Z"
}
```
- 400 - Bad request
- 409 - Conflict (category already exists)

We do not provide PUT and DELETE methods for categories as those options will be not available from FE and categories
removal will be handled by server (unused category will be removed from database automatically)

# /shops

## this endpoint will provide an access to shops in database.

`GET /shops`
returns list of all shops

```json
[
  {
    "id": 1,
    "logo": "logo1.jpg",
    "name": "shop1"
  },
  {
    "id": 2,
    "logo": "logo2.jpg",
    "name": "shop2"
  }
]
```
### Responses
- 200 - OK

`GET /shops/:id`
return specific shop

```json
{
  "id": 1,
  "logo": "logo1.jpg",
  "name": "shop1"
}
```
### Responses
- 200 - OK
- 404 - Not found

`POST /shops`
create new shop

```json
{
  "logo": "logo3.jpg",
  "name": "shop3"
}
```
### Responses
- 201 - Created
```json
{
    "id": 3,
    "logo": "logo3.jpg",
    "name": "shop3",
    "updatedAt": "2025-01-01T17:57:29.129Z",
    "createdAt": "2025-01-01T17:57:29.129Z"
}
```
- 400 - Bad request
- 409 - Conflict (shop already exists)

`PUT /shops/:id`
update specific shop

```json
{
  "logo": "logo3.jpg",
  "name": "shop3"
}
```
### Responses
- 201 - Created (if shop does not exist)
```json
{
    "id": 3,
    "logo": "logo3.jpg",
    "name": "shop3",
    "updatedAt": "2025-01-01T17:57:29.129Z",
    "createdAt": "2025-01-01T17:57:29.129Z"
}
```
- 204 - No content (if shop exists and updated)
- 400 - Bad request
- 409 - Conflict (shop already exists)

`DELETE /shops/:id`
delete specific shop
### Responses
- 204 - No content
- 404 - Not found

# /shops/:id/categories

## this endpoint will provide an access to categories list for specific shop.

`GET /shops/:id/categories`
returns list of categories for specific shop

```json
[
  {
    "category": {
      "id": 1,
      "name": "category1"
    },
    "category_order": 1
  },
  {
    "category": {
      "id": 2,
      "name": "category2"
    },
    "category_order": 1
  }
]
```
### Responses
- 200 - OK
- 404 - Not found

`PUT /shops/:id/categories`
updates categories list for specific shop (or create if not exists)

```json
[
  {
    "category": {
      "id": 1
    },
    "category_order": 1
  },
  {
    "category": {
      "id": 2
    },
    "category_order": 2
  },
  {
    "category": {
      "id": 3
    },
    "category_order": 3
  }
]
```
### Responses
- 204 - No content
- 400 - Bad request
- 404 - Not found (category not found)

# /current_shop

## this endpoint will provide an access to current selected shop by user.

`GET /current_shop`
returns current selected shop

```json
{
  "shop_id": 1,
  "logo": "logo1.jpg",
  "name": "shop1"
}
```
### Responses
- 200 - OK
- 204 - if current shop is not set

`PUT /current_shop`
updates current selected shop

```json
{
  "shop_id": 2
}
```
### Responses
- 204 - No content
- 400 - Bad request
- 404 - Not found (shop not found)

# /last_change_timestamp

## this endpoint will provide an access to timestamp of last change in database.

`GET /last_change_timestamp`
returns timestamp of last change for each table in database

```json
{
  "shopping_articles": 123456789.898,
  "shopping_cart": 123456789.898,
  "categories": 123456789.898,
  "shops": 123456789.898,
  "current_shop": 123456789.898
}
```