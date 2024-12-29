
class ShoppingArticlesList:
    def __init__(self):
        self.articles = []

    def add_article(self, article):
        self.articles.append(article)

    def get_articles(self):
        return self.articles

    def get_article_by_id(self, article_id):
        for article in self.articles:
            if article.id == article_id:
                return article
        return None
