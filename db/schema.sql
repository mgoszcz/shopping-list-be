CREATE TABLE ShoppingArticles (
                                   id SERIAL PRIMARY KEY,
                                   name TEXT NOT NULL,
                                   category_id INT NOT NULL,
                                   selection INT DEFAULT 1
);

CREATE TABLE Categories (
                            id SERIAL PRIMARY KEY,
                            name TEXT NOT NULL
);

CREATE TABLE ShoppingCart (
                               id SERIAL PRIMARY KEY,
                               article_id INT NOT NULL REFERENCES shopping_articles(id),
                               quantity INT NOT NULL,
                               checked BOOLEAN DEFAULT FALSE
);

CREATE TABLE Shops (
                       id SERIAL PRIMARY KEY,
                       logo TEXT NOT NULL,
                       name TEXT NOT NULL
);

CREATE TABLE ShopCategories (
                                 shop_id INT NOT NULL,
                                 category_id INT NOT NULL,
                                 category_order INT NOT NULL,
                                 PRIMARY KEY (shop_id, category_id),
                                 FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
                                 FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE CurrentShop (
                                id INT PRIMARY KEY DEFAULT 1,
                                shop_id INT NOT NULL REFERENCES shops(id)
);

CREATE TABLE last_modified (
                               table_name TEXT PRIMARY KEY,
                               last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);