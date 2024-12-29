"""
{'data_set': <list_name>, 'item', <item_name>, 'action': <add/remove/update>, data: <dict>}
Update data:
shopping_article:
1. delete article
{shopping_artciles_list, article_name, remove, <no-data>}
2. Add article
{shopping_articles_list, new_article_name, add, {all_article_fields}}
3. Modify article
{shopping_articles_list, article_name, update, {changed_field: new_value}}
4. Rename article
    could be the same as point 3? (rather add/remove)

shopping_list:
1. Delete item
{shopping_list, article_name, remove, <no-data>}
2. Add item
{shopping_list, article_name, add, {all_shopping_list_item_fields}}
3. Modify shopping_list_item
{shopping_list, article_name, update, {changed_field: new_value}}

categories:
1. Delete item
{categories, category_name, remove, <no-data>}
2. Add item
{categories, category_name, add, <no-data>}

shops:
1. Delete shop
{shops, shop_name, remove, <no-data>}
2. Add shop
{shops, shop_name, add, {all shop data}}}
3. Modify shop
{shops, shop_name, update, {changed_field: new_value}}

current_shop:
1. Modify current shop
{current_shop, null, update, {new_shop: shop_name}}

shop_icons:
1. Remove icon
{shop_icon, icon_name, remove, <no-data>}
2. Add icon
{shop_icon, icon_name, add, {icon_img: path}}
3. Modify icon
{shop_icon, icon_name, update, {icon_img: path}}
"""
from datetime import datetime
from typing import Dict

from data_updater_model import DataUpdaterRequestModel

class RequestError(Exception):
    ...

class DataUpdater:

    def __init__(self, server_data_set: Dict):
        self.server_data = server_data_set

    @staticmethod
    def _find_dict_by_field(field_name, field_value, dict_list):
        for item in dict_list:
            if item.get(field_name) == field_value:
                return item
        return None

    def _remove_item_from_list(self, list_to_update, item_id, id_name):
        list_to_update.remove(self._find_dict_by_field(id_name, item_id, list_to_update))

    @staticmethod
    def _data_field_validator(data_field, expected_keys=None):
        if not isinstance(data_field, dict):
            raise RequestError('Data field in request is not dictionary')
        if not data_field:
            raise RequestError('Data field is empty')
        if expected_keys:
            for key in expected_keys:
                if key not in data_field:
                    raise RequestError(f'Data field should contain key {key}')

    def _add_article(self, articles_list, article_data):
        self._data_field_validator(article_data, ('name', 'category'))
        articles_list.append(article_data | {'amount': 1, 'selection': 1})

    def _add_shooping_list_item(self, shopping_list, item_data):
        self._data_field_validator(item_data, ('article_name',))
        shopping_list.append(item_data | {'amount': 1, 'checked': False})

    def _add_shop(self, shops_list, item_data):
        self._data_field_validator(item_data, ('name',))
        name = item_data.get('name')
        logo = item_data.get('logo')
        category_list = item_data.get('category_list', [])
        shops_list.append({'name': name, 'logo': logo, 'category_list': category_list})

    def _dict_list_update(self, list_to_update, item, id_name, add_item_method):
        action = item.get('action')
        item_id = item.get('item')
        match action:
            case DataUpdaterRequestModel.actions.remove:
                self._remove_item_from_list(list_to_update, item_id, id_name)
            case DataUpdaterRequestModel.actions.add:
                add_item_method(list_to_update, item.get('data'))
            case DataUpdaterRequestModel.actions.update:
                self._data_field_validator(item.get('data'))
                item_to_update = self._find_dict_by_field(id_name, item_id, list_to_update)
                if not item_to_update:
                    raise RequestError(f'Cannot find item with {id_name} {item_id} on server')
                for key, value in item.get('data').items():
                    item_to_update[key] = value
            case DataUpdaterRequestModel.actions.rename:
                raise NotImplementedError('Renaming articles is not implemented on server')
            case other:
                raise RequestError(f'Invalid action type {other}')

    def _update_articles(self, item):
        id_name = 'name'
        list_to_update = self.server_data.get('shopping_articles_list')
        self._dict_list_update(list_to_update, item, id_name, self._add_article)

    def _update_shopping_list(self, item):
        id_name = 'article_name'
        list_to_update = self.server_data.get('shopping_list')
        print(list_to_update)
        self._dict_list_update(list_to_update, item, id_name, self._add_shooping_list_item)

    def _update_categories(self, item):
        category_name = item.get('item')
        action = item.get('action')
        list_to_update = self.server_data.get('categories')
        if action == DataUpdaterRequestModel.actions.add:
            list_to_update.append(category_name)
        elif action == DataUpdaterRequestModel.actions.remove:
            list_to_update.remove(category_name)
        else:
            raise RequestError(f'Invalid action for category list: {action}')

    def _update_shops(self, item):
        id_name = 'name'
        list_to_update = self.server_data.get('shops')
        self._dict_list_update(list_to_update, item, id_name, self._add_shop)

    def _update_shops_icons(self, item):
        icon_name = item.get('item')
        action = item.get('action')
        icons_dict = self.server_data.get('shops_icons')
        match action:
            case DataUpdaterRequestModel.actions.remove:
                del icons_dict[icon_name]
            case DataUpdaterRequestModel.actions.add:
                self._data_field_validator(item.get('data'), ('icon_img', ))
                icons_dict[icon_name] = item.get('data')
            case DataUpdaterRequestModel.actions.update:
                self._data_field_validator(item.get('data'), ('icon_img',))
                if icon_name not in icons_dict:
                    raise RequestError(f'Icon {icons_dict} not found on server')
                icons_dict[icon_name] = item.get('data')

    def _update_item(self, item):
        data_set_to_update = item.get('data_set')
        match data_set_to_update:
            case DataUpdaterRequestModel.data_set.shopping_articles_list:
                self._update_articles(item)
            case DataUpdaterRequestModel.data_set.shopping_list:
                self._update_shopping_list(item)
            case DataUpdaterRequestModel.data_set.categories:
                self._update_categories(item)
            case DataUpdaterRequestModel.data_set.shops:
                self._update_shops(item)
            case DataUpdaterRequestModel.data_set.current_shop:
                if item.get('action') != DataUpdaterRequestModel.actions.update:
                    raise RequestError(f'Invalid action for current_shop: {item.get("action")}')
                if not item.get('item'):
                    raise RequestError('Current shop request should contain shop name')
                self.server_data['current_shop'] = item.get('item')
            case DataUpdaterRequestModel.data_set.shop_icon:
                self._update_shops_icons(item)
            case other:
                raise RequestError(f'Invalid dataset {other}')

    def update(self, incoming_data):
        print(incoming_data)
        if not incoming_data:
            return True
        for item in incoming_data:
            self._update_item(item)
        self.server_data['timestamp'] = datetime.now().timestamp()
        return True
