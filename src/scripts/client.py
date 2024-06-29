# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, db, auth
import coinbasepro as cbp

sandbox_url = "https://api-public.sandbox.exchange.coinbase.com"

cred = credentials.Certificate('../config/firebase_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://tradingweb-fa6f7-default-rtdb.firebaseio.com/'
})

def verify_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        print("Get auth ID")
        return user_id
    except firebase_admin.auth.InvalidIdTokenError:
        print("Invalid ID token.")
        return None
    except Exception as e:
        print(f"Error verifying ID token: {e}")
        return None

def fetch_user_credentials(user_id):
    ref = db.reference(f'users/{user_id}')
    user_data = ref.get()
    if user_data and all(key in user_data for key in ['apiKey', 'apiSecret', 'passphrase']):
        print("User Credential Fetched")
        selected_strategy = user_data.get('selectedStrategy', None)
        return {
            'apiKey': user_data['apiKey'],
            'apiSecret': user_data['apiSecret'],
            'passphrase': user_data['passphrase'],
            'selectedStrategy': selected_strategy
        }
    else:
        raise Exception("User data is incomplete or missing.")


def create_coinbase_client(apiKey, apiSecret, passphrase, selectedStrategy):
    # print("creating client...")
    try:
        client = cbp.AuthenticatedClient(apiKey, apiSecret, passphrase, api_url=sandbox_url )
        print("Client successfully initialized!")
        return client
    except Exception as e:
        print(f"An error occurred during client initialization: {e}")
        return None
