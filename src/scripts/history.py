from firebase_admin import db

def store_order_in_history(user_id, order_data):

    ref = db.reference(f'tradingHistory/{user_id}')
    ref.push().set(order_data)
    # print(order_data)
    print("Order stored in trading history.")
    return
