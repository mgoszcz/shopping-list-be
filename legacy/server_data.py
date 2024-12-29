from copy import deepcopy
from datetime import datetime


class ServerData:

    def __init__(self):
        self.shopping_list = {}
        self.shopping_list_test = {}

    @staticmethod
    def find_dict_by_field(field_name, field_value, dict_list):
        for item in dict_list:
            if item.get(field_name) == field_value:
                return item
        return None


    def compare_articles(self, pd, cd, id_field_name):
        index_to_remove = []
        for i, pattern_dict in enumerate(pd):
            incoming_item = self.find_dict_by_field(id_field_name, pattern_dict.get(id_field_name), cd)
            if not incoming_item:
                # print(f'Pattern item {pattern_dict} not found in incoming data')
                index_to_remove.append(i)
                continue
            for key, value in pattern_dict.items():
                if incoming_item.get(key) != value:
                    # print(f'Pattern item {pattern_dict} and incoming {incoming_item} differs by {key}')
                    pattern_dict[key] = incoming_item.get(key)
        for index in index_to_remove[::-1]:
            pd.pop(index)
        for i, incoming_item in enumerate(cd):
            pattern_item = self.find_dict_by_field(id_field_name, incoming_item.get(id_field_name), pd)
            if not pattern_item:
                # print(f'Incoming item {incoming_item} not found in pattern data')
                pd.insert(i, incoming_item)


    @staticmethod
    def compare_categories(pl, inl):
        index_to_remove = []
        for i, category in enumerate(pl):
            if category not in inl:
                # print(f'Pattern category {category} not found in incoming list')
                index_to_remove.append(i)
        for index in index_to_remove[::-1]:
            pl.pop(index)
        for i, category in enumerate(inl):
            if category not in pl:
                # print(f'Incoming category {category} not found in pattern list')
                pl.insert(i, category)


    @staticmethod
    def compare_shops_icons(pd, ind):
        result_dict = deepcopy(pd)
        for key, value in pd.items():
            if key not in ind:
                # print(f'PAttern key does not exist in incoming dict: {key}')
                del result_dict[key]
                continue
            if value != ind.get(key):
                # print(f'Pattern item {value} and incoming item {ind.get(key)} differs ')
                result_dict[key] = ind.get(key)
        for key, value in ind.items():
            if key not in pd:
                # print(f'Incoming key does not exist in pattern dict: {key}')
                result_dict[key] = value
                continue
        return result_dict


    def data_updater(self, local_list, incoming_list):
        #print('Compare shopping articles')
        self.compare_articles(local_list.get('shopping_articles_list'), incoming_list.get('shopping_articles_list'), 'name')
        #print('Compare shopping list')
        self.compare_articles(local_list.get('shopping_list'), incoming_list.get('shopping_list'), 'article_name')
        #print('Compare categories')
        self.compare_categories(local_list.get('categories'), incoming_list.get('categories'))
        #print('Compare shops')
        self.compare_articles(local_list.get('shops'), incoming_list.get('shops'), 'name')
        #print('Compare current shop')
        if local_list.get('current_shop') != incoming_list.get('current_shop'):
            print(f'Current shop differs, local_list: {local_list.get("current_shop")}, incoming: {incoming_list.get("current_shop")}')
            local_list['current_shop'] = incoming_list.get('current_shop')
        #print('Compare shops icons')
        local_list['shops_icons'] = self.compare_shops_icons(local_list.get('shops_icons'), incoming_list.get('shops_icons'))

    def write_server_data(self, list_to_write, incoming_data):
        self.data_updater(list_to_write.get('shopping_list'), incoming_data)
        list_to_write.get('shopping_list')['timestamp'] = datetime.now().timestamp()
