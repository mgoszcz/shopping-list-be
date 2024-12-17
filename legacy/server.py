"""Module contains REST api server implementation"""
from flask import Flask, jsonify, request
from flask_cors import cross_origin

from server_backup import ServerBackup
from server_data import ServerData
from data_updater import DataUpdater, RequestError

app = Flask(__name__)

server_data = ServerData()


@app.route('/')
def index():
    """home page"""
    return "INDEX"


@app.route('/shopping_list')
@cross_origin()
def get_items():
    """Get all items from shopping list in json format for GET request"""
    response = jsonify(server_data.shopping_list)
    return response

@app.route('/shopping_list/timestamp')
@cross_origin()
def get_timestamp():
    """Get all items from shopping list in json format for GET request"""
    response = {'timestamp': server_data.shopping_list.get('shopping_list').get('timestamp')}
    return response

def _set_shopping_list(shopping_list_local: dict):
    print(request.json)
    server_data.write_server_data(shopping_list_local, request.json)
    response = {'timestamp': shopping_list_local.get('shopping_list').get('timestamp')}
    return response, 201


@app.route('/shopping_list_test')
@cross_origin()
def get_items_test():
    """Get all items from test shopping list in json format for GET request"""
    response = jsonify(server_data.shopping_list_test)
    return response

@app.route('/shopping_list_test/timestamp')
@cross_origin()
def get_timestamp_test():
    """Get all items from test shopping list in json format for GET request"""
    response = {'timestamp': server_data.shopping_list_test.get('shopping_list').get('timestamp')}
    return response

@app.route('/shopping_list', methods=['POST'])
@cross_origin()
def set_shopping_list():
    """Overwrite shopping list dictionary when POST request received"""
    returned_list = _set_shopping_list(server_data.shopping_list)
    ServerBackup(server_data.shopping_list).create_backup()
    return returned_list


@app.route('/shopping_list_test', methods=['POST'])
@cross_origin()
def set_shopping_list_test():
    """Overwrite test shopping list dictionary when POST request received"""
    returned_list = _set_shopping_list(server_data.shopping_list_test)
    ServerBackup(server_data.shopping_list_test, 'backup_test').create_backup()
    return returned_list

def _shopping_list_update(shopping_list, incoming_data, updater, server_backup):
    try:
        updater.update(incoming_data)
        server_backup.create_backup()
        return {'timestamp': shopping_list.get('shopping_list').get('timestamp')}, 201
    except RequestError as e:
        return {'Error': str(e)}, 400
    except NotImplementedError as e:
        return {'Error': str(e)}, 501
    except Exception as e:
        return {'Error': str(e)}, 500

@app.route('/shopping_list/update', methods=['POST'])
@cross_origin()
def update_shopping_list():
    server_backup = ServerBackup(server_data.shopping_list)
    return _shopping_list_update(server_data.shopping_list, request.json, prod_server_updater, server_backup)

@app.route('/shopping_list_test/update', methods=['POST'])
@cross_origin()
def update_test_shopping_list():
    server_backup = ServerBackup(server_data.shopping_list_test, 'backup_test')
    return _shopping_list_update(server_data.shopping_list_test, request.json, test_server_updater, server_backup)


def load_backup():
    """Load data from backup file when server started"""
    try:
        data = ServerBackup(server_data.shopping_list).load_backup()
        server_data.shopping_list['shopping_list'] = data['shopping_list']
        data = ServerBackup(server_data.shopping_list_test, 'backup_test').load_backup()
        server_data.shopping_list_test['shopping_list'] = data['shopping_list']
    except FileNotFoundError:
        print('Backup file not found')



load_backup()
prod_server_updater = DataUpdater(server_data.shopping_list.get('shopping_list'))
test_server_updater = DataUpdater(server_data.shopping_list_test.get('shopping_list'))
# app.run(debug=True)
