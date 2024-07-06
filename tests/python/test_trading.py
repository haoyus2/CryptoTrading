import unittest
from unittest.mock import patch, MagicMock
from src.scripts import trading
import pandas as pd

class TestTrading(unittest.TestCase):
    @patch('src.scripts.trading.cbp.AuthenticatedClient')
    def test_get_historical_data(self, mock_client):
        client = MagicMock()
        mock_client.return_value = client
        client.get_product_historic_rates.return_value = [{"time": 1625097600, "close": 35000}]
        data = trading.get_historical_data(client, 'BTC-USD', 3600)
        self.assertEqual(data, [{"time": 1625097600, "close": 35000}])
        client.get_product_historic_rates.assert_called_with('BTC-USD', granularity=3600)

    def test_calculate_sma(self):
        data = {'close': pd.Series([1, 2, 3, 4, 5])}
        result = trading.calculate_sma(data)
        self.assertTrue(isinstance(result, pd.Series))
        self.assertEqual(len(result), 5)


    # @patch('src.scripts.trading.get_historical_data')
    # def test_make_decision_sell(self):
    #     data = {
    #         'close': [55, 60, 65, 70, 75, 80, 85, 90, 95, 101],
    #         'sma': [53, 62, 70, 77, 83, 88, 92, 95, 98, 100]
    #     }
    #     df = pd.DataFrame(data)
    #     decision = trading.make_decision(df)
    #     self.assertEqual(decision, 'sell')

    def test_make_decision_sell(self):
        data = {
            'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'low': [50] * 10,
            'high': [110] * 10,
            'open': [55] * 10,
            'close': [55, 60, 65, 70, 75, 80, 85, 90, 95, 101],
            'volume': [1000] * 10
        }
        df = pd.DataFrame(data)
        decision = trading.make_decision(df)   
        self.assertEqual(decision, 'sell')

    def test_make_decision_buy(self):
        data = {
            'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'low': [40] * 10,
            'high': [100] * 10,
            'open': [45] * 10,
            'close': [100, 95, 90, 85, 80, 75, 70, 65, 60, 50],
            'volume': [1000] * 10
        }
        df = pd.DataFrame(data)
        decision = trading.make_decision(df)
        self.assertEqual(decision, 'buy')

    def test_make_decision_hold(self):
        data = {
            'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'low': [95] * 10,
            'high': [105] * 10,
            'open': [100] * 10,
            'close': [100] * 10,
            'volume': [1000] * 10
        }
        df = pd.DataFrame(data)
        decision = trading.make_decision(df)
        self.assertEqual(decision, 'hold')
    

    @patch('src.scripts.trading.cbp.AuthenticatedClient')
    def test_get_account_balance(self, mock_client):
        client = MagicMock()
        mock_client.return_value = client
        client.get_accounts.return_value = [{'currency': 'USD', 'balance': '1000', 'available': '500'}]
        balance, available = trading.get_account_balance(client, 'USD')
        self.assertEqual(balance, 1000.0)
        self.assertEqual(available, 500.0)

if __name__ == '__main__':
    unittest.main()
