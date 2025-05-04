import requests
import pandas as pd
import json
import yfinance as yf
import numpy as np
import os

api_key = "YsLnwyIop0Sh7p97SIpVRBGXxqAWK4wP"

start_D = "2020-01-01"
end_D = "2025-01-01"



def safe_json_dump(data, filepath):
    def clean(obj):
        if isinstance(obj, dict):
            return {k: clean(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean(v) for v in obj]
        elif isinstance(obj, (np.integer, int)):
            return int(obj)
        elif isinstance(obj, (np.floating, float)):
            return None if np.isnan(obj) else float(obj)
        return obj
    with open(filepath, "w") as f:
        json.dump(clean(data), f, indent=4)


def update_nasdaq_100():
    url = "https://topforeignstocks.com/indices/the-complete-list-of-constituents-of-the-nasdaq-100-index/"
    tables = pd.read_html(url)
    tickers = tables[0].iloc[:, 2].dropna().tolist() 
    safe_json_dump(tickers, "Data/StockFilterData/nasdaq_100.json")


def sp_500():
    url = "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv"
    df = pd.read_csv(url)
    tickers = df["Symbol"].head(150).tolist()
    print(tickers)
    with open("Data/StockFilterData/sp500_top150.json", "w") as f:
        json.dump(tickers, f, indent=4)
        



def Stocks_Infos():
    with open("Data/StockFilterData/nasdaq_100.json") as f:
        nasdaq  = json.load(f)
        
    with open("Data/StockFilterData/p500_top150.json") as f:
        sp150 = json.load(f)
    
    symbols= list(set(nasdaq  + sp150))
    
    results = []
    for symbol in symbols:
        url = f"https://financialmodelingprep.com/api/v3/ratios-ttm/{symbol}?apikey={api_key}"
        resp = requests.get(url)
        if resp.status_code == 200:
            data = resp.json()
            for item in data:
                item["symbol"] = symbol
                if "dividendYielTTM" in item:
                    item["dividendYieldTTM"] = item.pop("dividendYielTTM")
            results.extend(data)
    safe_json_dump(results, "Data/StockFilterData/multiple_stocks_ratios.json")


def fetch(stocks, start_date=start_D, end_date=end_D):
    cleaned = [s.strip().upper() for s in stocks if isinstance(s, str) and s.strip()]
    combined = pd.DataFrame()
    for i in range(0, len(cleaned), 20):
        chunk = cleaned[i:i+20]
        try:
            data = yf.download(chunk, start=start_date, end=end_date, progress=False)
        except:
            continue
        if data.empty:
            continue
        if isinstance(data.columns, pd.MultiIndex):
            if 'Close' in data.columns.levels[0]:
                data = data['Close']
            else:
                continue

        for col in data.columns:
            data[col] = data[col].ffill(limit=5)
            
        data = data.dropna(how='all')
        combined = pd.concat([combined, data], axis=1)
    if combined.empty:
        return pd.DataFrame()

    prices_dict = combined.where(pd.notnull(combined), None).to_dict(orient="list")
    safe_json_dump(prices_dict, "Data/StockFilterData/stock_prices.json")

    if combined.shape[0] > 21:
        last = combined.iloc[-1]
        month_ago = combined.iloc[-22]
        pct = ((last - month_ago) / month_ago).round(6)
        safe_json_dump(pct.to_dict(), "Data/StockFilterData/one_month_changes.json")

    return combined


def get_statistics(stocks, start_date=start_D, end_date=end_D):
    data = fetch(stocks, start_date, end_date)
    if data.empty:
        return {}
    data = data.dropna(axis=1, how='all')
    if data.empty:
        return {}
    returns = data.pct_change(fill_method=None).dropna(how='all')
    if returns.empty:
        return {}
    exp = returns.mean()
    vol = returns.std()
    stats = {
        sym: {
            "expected_return": round(exp[sym], 6) if not pd.isna(exp[sym]) else None,
            "volatility": round(vol[sym], 6) if not pd.isna(vol[sym]) else None
        }
        for sym in exp.index
    }
    safe_json_dump(stats, "Data/StockFilterData/statistics.json")
    return stats


def calculate_volatilities():
    with open("Data/StockFilterData/stock_prices.json") as f:
        price_data = json.load(f)
    daily_vol = []
    annual_vol = []
    for sym, prices in price_data.items():
        if len(prices) < 2:
            continue
        log_r = [np.log(prices[i] / prices[i - 1])
                 for i in range(1, len(prices))
                 if prices[i] is not None and prices[i - 1] is not None]
        if not log_r:
            continue
        daily_vol.append({"symbol": sym, "log_returns": [round(r, 6) for r in log_r]})
        annual_vol.append({
            "symbol": sym,
            "annual_volatility": round(np.std(log_r) * np.sqrt(252), 6)
        })
    safe_json_dump(daily_vol, "Data/StockFilterData/stocks_consecutive_day_volatility.json")
    safe_json_dump(annual_vol, "Data/StockFilterData/stocks_consecutive_day_annual_volatility.json")


def load_merged_data():
    with open("Data/StockFilterData/statistics.json") as f:
        stats = json.load(f)
    with open("Data/StockFilterData/multiple_stocks_ratios.json") as f:
        ratios = json.load(f)
    with open("Data/StockFilterData/stocks_consecutive_day_annual_volatility.json") as f:
        ann = json.load(f)
    stats_df = pd.DataFrame.from_dict(stats, orient="index")
    ratios_df = pd.DataFrame(ratios)
    ann_df = pd.DataFrame(ann).set_index("symbol")
    df = ratios_df.set_index("symbol").join(stats_df).join(ann_df)
    try:
        with open("Data/StockFilterData/one_month_changes.json") as f:
            onem = json.load(f)
        df = df.join(pd.DataFrame.from_dict(onem, orient="index", columns=["1M_pct_change"]))
    except FileNotFoundError:
        pass
    return df


def get_top_short_term(df, top_n=10):
    df2 = df.dropna(subset=["expected_return", "volatility", "1M_pct_change"]).copy()
    df2.loc[:, "score"] = (
        df2["expected_return"].rank(ascending=False) +
        df2["1M_pct_change"].rank(ascending=False) +
        df2["volatility"].rank(ascending=True)
    ).round(6)
    df3 = df2.reset_index().sort_values(
        by=["score", "symbol"],
        ascending=[False, True],
        kind="mergesort"
    )
    return df3["symbol"].tolist()[:top_n]


def get_top_long_term(df, top_n=10):
    df2 = df.dropna(subset=[ # 
        "returnOnEquityTTM",
        "freeCashFlowPerShareTTM",
        "netProfitMarginTTM",
        "pegRatioTTM",
        "debtRatioTTM"
    ]).copy()
    df2.loc[:, "score"] = (
        df2["returnOnEquityTTM"].rank(ascending=False) +
        df2["freeCashFlowPerShareTTM"].rank(ascending=False) +
        df2["netProfitMarginTTM"].rank(ascending=False) +
        df2["pegRatioTTM"].rank(ascending=True) +
        df2["debtRatioTTM"].rank(ascending=True)
    ).round(6)
    df3 = df2.reset_index().sort_values(
        by=["score", "symbol"],
        ascending=[False, True],
        kind="mergesort"
    )
    return df3["symbol"].tolist()[:top_n]


def get_filtered_stocks(update=False):
    if update:
        update_nasdaq_100()
        with open("Data/StockFilterData/nasdaq_100.json") as f:
            ticks = json.load(f)
        Stocks_Infos()
        get_statistics(ticks)
        calculate_volatilities()
    df = load_merged_data()
    return {
        "top_short_term": get_top_short_term(df),
        "top_long_term": get_top_long_term(df)
    }
    
    
sp_500()