
class CategoryList:
    def __init__(self):
        self.categories = []

    def add_category(self, category):
        self.categories.append(category)

    def get_categories(self):
        return self.categories

    def get_category_by_id(self, category_id):
        for category in self.categories:
            if category.id == category_id:
                return category
        return None
