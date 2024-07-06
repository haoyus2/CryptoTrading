import unittest
from unittest.mock import patch
from src.scripts.history import store_order_in_history

class TestHistory(unittest.TestCase):
    @patch('src.scripts.history.db.reference')
    def test_store_order_in_history_success(self, mock_db_ref):
        # Setup mock
        mock_ref = mock_db_ref.return_value
        mock_push = mock_ref.push.return_value
        mock_push.set.return_value = None

        # Test data
        user_id = 'user123'
        order_data = {
            'product_id': 'BTC-USD',
            'side': 'buy',
            'price': 50000,
            'time': '2021-01-01T12:00:00Z'
        }
        store_order_in_history(user_id, order_data)

        mock_db_ref.assert_called_with(f'tradingHistory/{user_id}')
        mock_db_ref.return_value.push.assert_called_once()
        mock_push.set.assert_called_once_with(order_data)
        print("Order stored in trading history.")

    @patch('src.scripts.history.db.reference')
    def test_store_order_in_history_failure(self, mock_db_ref):
        # Setup mock
        mock_ref = mock_db_ref.return_value
        mock_push = mock_ref.push.return_value
        mock_set = mock_push.set
        mock_set.side_effect = Exception("Failed to store data")

        user_id = 'user123'
        order_data = {
            'product_id': 'BTC-USD',
            'side': 'buy',
            'price': 50000,
            'time': '2021-01-01T12:00:00Z'
        }

        with self.assertRaises(Exception) as context:
            store_order_in_history(user_id, order_data)
        self.assertTrue('Failed to store data' in str(context.exception))

if __name__ == '__main__':
    unittest.main()
