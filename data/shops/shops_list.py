

class ShopsList:

    def __init__(self):
        self.shops = []

    def add_shop(self, shop):
        self.shops.append(shop)

    def get_shops(self):
        return self.shops

    def get_shop_by_id(self, shop_id):
        for shop in self.shops:
            if shop.id == shop_id:
                return shop
        return None
