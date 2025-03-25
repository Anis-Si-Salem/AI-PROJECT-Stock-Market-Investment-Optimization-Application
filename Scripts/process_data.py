import yfinance as yf
import pandas as pd
import numpy as np
import os

def fetch(stocks, start_date="2020-01-01", end_date="2025-01-01"):  
        data = yf.download(stocks, start=start_date, end=end_date)
        if not data.empty:
               
            os.makedirs("Data", exist_ok=True)
            data.to_csv("Data/stocks.csv")

            if isinstance(data.columns, pd.MultiIndex):
               data = data.xs('Close', level='Price', axis=1)  # remove useless columns leaves only the 'Close' column
               
            return data
        else:
            print("Problem with fetch check ./Scripts/process_data.py")

def get_statistics(stocks, start_date="2020-01-01", end_date="2025-01-01"):
    data = fetch(stocks, start_date, end_date)

    daily_returns = data.pct_change().dropna()  #pct_change calculates the percentage change between consecutive rows #dropna removes the first row with NaN value

    expected_returns = daily_returns.mean()  #mean
    std_dev = daily_returns.std()  #standard deviation

    stats = pd.DataFrame({
        "Expected Return Daily": expected_returns,
        "Standard Deviation": std_dev,
    })

    stats.to_csv("Data/statistics.csv")

    return stats




