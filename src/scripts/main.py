import coinbasepro as cbp
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import client
import trading
from threading import Thread, Event, Lock

app = Flask(__name__)
CORS(app)
thread_data = {} 
thread_data_lock = Lock()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/initialize-client', methods=['POST'])
def initialize_client():
    id_token = request.json.get('idToken')
    print("Get token")
    if not id_token:
        return jsonify({"error": "No ID token provided"}), 400
    user_id = client.verify_id_token(id_token)
    if not user_id:
        return jsonify({"error": "Invalid or expired ID token"}), 403
    else:
        print("useid:",user_id)
    
    # stop current thread
    with thread_data_lock:
        if user_id in thread_data:
            thread_data[user_id]['stop_event'].set()
            thread_data[user_id]['thread'].join()
            del thread_data[user_id]

    try:
        user_credentials = client.fetch_user_credentials(user_id)
        # print("user credentials:",user_credentials)
        coinbase_client = client.create_coinbase_client(**user_credentials)
        # print("coinbase_client...")
        if coinbase_client:
            stop_event = Event()
            if user_credentials['selectedStrategy']:
                if user_credentials['selectedStrategy'] == '-NzAKNfqOdQQsAd_sZ_p':
                    print('Running strategy A')
                    run_trading_cycle_in_thread(user_id, coinbase_client, stop_event, product_id='BTC-USD')
                elif user_credentials['selectedStrategy'] == '-NzAKOBdgR4Oethv63nV':
                    print('Running strategy B')
                    run_trading_cycle_in_thread(user_id, coinbase_client, stop_event, product_id='USDT-USD')
                else:
                    print('No valid strategy is running')
            else:
                print('User dosen\'t choose a strategy')
            return jsonify({"message": "Coinbase Pro client successfully initialized"}), 200
        else:
            return jsonify({"error": "Failed to create Coinbase Pro client"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def run_trading_cycle_in_thread(user_id, coinbase_client, stop_event, product_id):
    print("\nTrading cycle running...")
    thread = Thread(target=trading.run_trading_cycle, args=(stop_event, user_id, coinbase_client, product_id))
    thread.daemon = True 
    thread.start()
    thread_data[user_id] = {'thread': thread, 'stop_event': stop_event}


if __name__ == '__main__':
    app.run(debug=True,  port=5000)