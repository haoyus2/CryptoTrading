import coinbasepro as cbp
import pandas as pd
import time
import decimal
import history

def get_historical_data(client, product_id, granularity):
    return client.get_product_historic_rates(product_id, granularity=granularity)

def calculate_sma(data, window=30):
    return data['close'].rolling(window=window).mean()

def make_decision(data):
    df = pd.DataFrame(data, columns=['time', 'low', 'high', 'open', 'close', 'volume'])
    df['sma'] = calculate_sma(df, 10)
    current_close = df['close'].iloc[-1]
    current_sma = df['sma'].iloc[-1]
    previous_sma = df['sma'].iloc[-2]
    if current_close > current_sma and current_sma > previous_sma:
        return 'sell'
    elif current_close < current_sma and current_sma < previous_sma:
        return 'buy'
    else:
        return 'hold'

def get_account_balance(auth_client, currency):
    accounts = auth_client.get_accounts()
    for account in accounts:
        if account['currency'] == currency:
            return float(account['balance']), float(account['available'])
    return 0, 0

def place_order(auth_client, decision, product_id):
    base_currency, quote_currency = product_id.split('-')
    if decision == 'buy':
        balance, _ = get_account_balance(auth_client, quote_currency)
        funds = balance / 2
        funds = decimal.Decimal(funds).quantize(decimal.Decimal('0.01'), rounding=decimal.ROUND_DOWN)
        return auth_client.place_market_order(product_id=product_id, side='buy', funds=str(funds))
    elif decision == 'sell':
        _, available = get_account_balance(auth_client, base_currency)
        size = available / 2
        size = decimal.Decimal(size).quantize(decimal.Decimal('0.01'), rounding=decimal.ROUND_DOWN)
        return auth_client.place_market_order(product_id=product_id, side='sell', size=str(size))
    else:
        print('Wrong desidion input!')
        return False
    

def run_trading_cycle(stop_event, user_id, client, product_id, granularity=60):
    count = 0
    cur_order_id = None
    print(stop_event, stop_event.is_set() )
    while  not stop_event.is_set() and count < 20:
        print('\nRound: ', count)

        # get historical data
        try:
            data = get_historical_data(client, product_id, granularity)
            print("Got historical data")
        except Exception as e:
            print(f"Error during getting historical data: {e}")

        # make decision
        try:
            decision = make_decision(data)
            print("Decision made:", decision)
        except Exception as e:
            print(f"Error during making decision: {e}")

        # check previous order
        try:
            if cur_order_id:
                print('Checking previous order status:')
                cur_order = client.get_order(cur_order_id)
                if cur_order['status'] == 'done':
                    cur_order_id = None
                    if cur_order['done_reason'] == 'canceled':
                        print('Done but canceled')
                    elif cur_order['done_reason'] == 'filled':
                        print("Done and store")
                        # store finished order
                        order_data = {
                            'product_id': cur_order['product_id'],
                            'side': cur_order['side'],
                            'size':  float(cur_order.get('filled_size', 0)),
                            'price': float(cur_order.get('executed_value', 0)),
                            'time': cur_order['done_at'],
                            'status': cur_order['status'],
                            # 'reason': cur_order['done_reason']
                        }
                        # print(order_data)
                        history.store_order_in_history(user_id, order_data)
                    else:
                        print('Strange done reason:', cur_order['done_reason'])
                else:
                    print('Strange order status:', cur_order['status'])
                    client.cancel_order(cur_order_id)
                    cur_order_id = None
                    print("Canceled strange order")   
        except Exception as e:
            print(f"Error during getting previous order: {e}")
        
        # execute trading by decision
        try:
            if decision != 'hold':
                order_response = place_order(client, decision, product_id)
                cur_order_id = order_response["id"]
                print("Curr order: ", cur_order_id)
                print(f"Order Response: {order_response}")
            else:
                print("Holding")
        except Exception as e:
            print(f"  Error during placing an order: {e}")
                
        if stop_event.is_set():
            print("Stopping trading cycle on request.")
            break
        count += 1
        time.sleep(20)  
    print('Done automatic trading loop!')