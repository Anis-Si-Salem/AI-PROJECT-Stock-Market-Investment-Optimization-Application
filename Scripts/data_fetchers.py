import yfinance as yf
import pandas as pd
import os

def fetch(stocks):
    
    data = yf.download(stocks, period="1d") #period "1d", "5d"	,"1mo"	,"3mo"	,"6mo"	,"1y"	,"2y"	,"5y"	,"10y"	,"ytd"	,"max"
    data.to_csv("Data/stock_data.csv", index=False)
