import unittest
from unittest.mock import patch, MagicMock
from src.scripts.main import app

class TestMain(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # @patch('src.scripts.main.client.verify_id_token')
    # @patch('src.scripts.main.client.fetch_user_credentials')
    # @patch('src.scripts.main.client.create_coinbase_client')
    # def test_initialize_client_success(self, mock_create_coinbase_client, mock_fetch_credentials, mock_verify_id_token):
    #     mock_verify_id_token.return_value = '1234567890'
    #     mock_fetch_credentials.return_value = {
    #         'apiKey': 'test_api_key',
    #         'apiSecret': 'test_api_secret',
    #         'passphrase': 'test_passphrase',
    #         'selectedStrategy': '-NzAKOBdgR4Oethv63nV'
    #     }
    #     mock_create_coinbase_client.return_value = MagicMock()
    #     response = self.app.post('/initialize-client', json={'idToken': 'valid_id_token'})
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('Coinbase Pro client successfully initialized', response.json['message'])

    @patch('src.scripts.main.client.verify_id_token')
    def test_initialize_client_invalid_token(self, mock_verify_id_token):
        mock_verify_id_token.return_value = None
        response = self.app.post('/initialize-client', json={'idToken': 'invalid_id_token'})

        self.assertEqual(response.status_code, 403)
        self.assertIn('Invalid or expired ID token', response.json['error'])

if __name__ == '__main__':
    unittest.main()
