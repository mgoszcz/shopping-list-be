class _DataSet:
    shopping_list = 'shopping_list'
    shopping_articles_list = 'shopping_articles_list'
    categories = 'categories'
    shops = 'shops'
    current_shop = 'current_shop'
    shop_icon = 'shop_icon'


class _Actions:
    remove = 'remove'
    add = 'add'
    update = 'update'
    rename = 'rename'


class DataUpdaterRequestModel:
    data_set = _DataSet
    actions = _Actions
