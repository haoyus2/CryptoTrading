# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, db, auth
import coinbasepro as cbp
from dotenv import load_dotenv
import os

sandbox_url = "https://api-public.sandbox.exchange.coinbase.com"

load_dotenv()
firebase_config = {
    "type": os.getenv('FIREBASE_TYPE'),
    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
    "auth_uri": os.getenv('FIREBASE_AUTH_URI'),
    "token_uri": os.getenv('FIREBASE_TOKEN_URI'),
    "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
    "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL'),
    "universe_domain": os.getenv('FIREBASE_UNIVERSE_DOMAIN')
}

cred = credentials.Certificate(firebase_config)

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
