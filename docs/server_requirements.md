# Server side requirements
1. Add unique id to any new item
2. Return id on each post method
3. Store ids in database
4. Checks for duplicates and returns error if duplicated
5. Save data to json on each change
6. Create backups

# User stories
## Adding category
1. User adds category
2. Add category if new
3. Return error if category exists
4. Remove category if not used

# Articles
1. It is allowed that article has the same name as another article in db until it has different category name
2. It is prohibited to add article with the same name na category as another item in db
3. Remove and update article - check for unused categories and remove them

# Shops
Shops must have different names

# Shopping cart
1. Each article can be added only once
2. Adding to shopping cart increments selection
3. Removing unchecked item should decrease selection

# Database
1. Decide whether json or sql
2. Database should be loaded on server start
3. Each change should be saved in db