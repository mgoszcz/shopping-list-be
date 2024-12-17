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
    "category": "category1",
    "selection": 1
  },
  {
    "id": 2,
    "name": "article2",
    "category": "category2",
    "selection": 1
  }
]
```

`GET /shopping_articles/:id`
return specific article (*OPTIONAL*)
`POST / shopping_articles`
create new article

```json
{
  "name": "article3",
  "category": "category3",
  "selection": 1
}
```

`PUT /shopping_articles/:id`
update specific article

```json
{
  "name": "article3",
  "category": "category3",
  "selection": 1
}
```

`DELETE /shopping_articles/:id`
delete specific article

# /shopping_cart

## this endpoint will provide an access to articles selected by user for shopping list (`hopping_list` in old API)

`GET /shopping_cart`
returns list of all articles selected by user

```json
[
  {
    "id": 1,
    "article_id": 1,
    "quantity": 1,
    "checked": false
  },
  {
    "id": 1,
    "article_id": 2,
    "quantity": 1,
    "checked": true
  }
]
```

`GET /shopping_cart/:id`
return specific article selected by user (*OPTIONAL*)
`POST / shopping_cart`
add article selected by user

```json
{
  "article_id": 3,
  "quantity": 1,
  "checked": false
}
```

`PUT /shopping_cart/:id`
update specific article selected by user

```json
{
  "quantity": 2,
  "checked": false
}
```

`DELETE /shopping_cart/:id`
remove article from cart

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

`GET /categories/:id`
return specific category (*OPTIONAL*)
`POST / categories`
create new category

```json
{
  "name": "category3"
}
```

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

`GET /shops/:id`
return specific shop

```json
{
  "id": 1,
  "logo": "logo1.jpg",
  "name": "shop1"
}
```

`POST / shops`
create new shop

```json
{
  "logo": "logo3.jpg",
  "name": "shop3"
}
```

`PUT /shops/:id`
update specific shop

```json
{
  "logo": "logo3.jpg",
  "name": "shop3"
}
```

`DELETE /shops/:id`
delete specific shop

# /shops/:id/categories

## this endpoint will provide an access to categories list for specific shop.

`GET /shops/:id/categories`
returns list of categories for specific shop

```json
[
  1,
  2
]
```

`PUT /shops/:id/categories`
updates categories list for specific shop

```json
[
  1,
  2,
  3
]
```

# /current_shop

## this endpoint will provide an access to current selected shop by user.

`GET /current_shop`
returns current selected shop

```json
{
  "id": 1,
  "logo": "logo1.jpg",
  "name": "shop1"
}
```

`PUT /current_shop`
updates current selected shop

```json
{
  "id": 2
}
```

# /last_change_timestamp

## this endpoint will provide an access to timestamp of last change in database.

`GET /last_change_timestamp`
returns timestamp of last change in database

```json
{
  "timestamp": 123456789.898
}
```