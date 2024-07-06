import unittest
# import pytest
from unittest.mock import patch
from src.scripts.client import verify_id_token, fetch_user_credentials, create_coinbase_client
import firebase_admin

class TestClient(unittest.TestCase):

    @patch('src.scripts.client.auth')
    def test_verify_id_token(self, mock_auth):
        mock_auth.verify_id_token.return_value = {'uid': '12345'}
        user_id = verify_id_token('some-token')
        self.assertEqual(user_id, '12345')
        mock_auth.verify_id_token.assert_called_with('some-token')

    @patch('src.scripts.client.auth')
    def test_verify_id_token_with_invalid_token(self, mock_auth):
        mock_auth.verify_id_token.side_effect = firebase_admin.auth.InvalidIdTokenError('Invalid token')
        user_id = verify_id_token('invalid-token')
        self.assertIsNone(user_id)
        mock_auth.verify_id_token.assert_called_with('invalid-token')


    @patch('src.scripts.client.db.reference')
    def test_fetch_user_credentials(self, mock_db_ref):
        mock_ref = mock_db_ref.return_value
        mock_ref.get.return_value = {
            'apiKey': 'key123', 'apiSecret': 'secret123', 'passphrase': 'pass123', 'selectedStrategy': 'strategy123'
        }
        result = fetch_user_credentials('user123')
        self.assertEqual(result['apiKey'], 'key123')
        mock_db_ref.assert_called_with('users/user123')


    @patch('src.scripts.client.cbp.AuthenticatedClient')
    def test_create_coinbase_client(self, mock_client):
        mock_client.return_value = 'Client initialized'
        result = create_coinbase_client('key123', 'secret123', 'pass123', 'strategy123')
        self.assertEqual(result, 'Client initialized')
        mock_client.assert_called_with('key123', 'secret123', 'pass123', api_url='https://api-public.sandbox.exchange.coinbase.com')

if __name__ == '__main__':
    unittest.main()