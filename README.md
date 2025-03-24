# Stock Market Investment Optimization

## Overview
Stock Market Investment Optimization is an AI-powered application that helps users allocate their investments across multiple companies to maximize return on investment (ROI). The system considers real-time stock market data, individual risk tolerance, and investment goals to provide optimized investment recommendations.

## Features
- **Real-time Stock Data Collection**: Uses Yahoo Finance's API to fetch stock prices, financial news, and market trends.
- **User Input Handling**: Allows users to specify investment capital, risk level (conservative, moderate, aggressive), investment duration, and industry preferences.

## Application Components
1. **Data Collection & Processing**:
   - Fetch historical and real-time stock market data.
   - Analyze stock performance metrics (P/E ratio, market cap, price fluctuations, etc.).
   - Research market trends and economic forecasts.
2. **Optimization Algorithms**:
   - Implement and compare Greedy Search, A*, and Simulated Annealing.
   - Model portfolio allocation as a CSP.
3. **Investment Strategy Dashboard**:
   - User-friendly interface for inputting investment parameters.
   - Portfolio allocation suggestions with ROI and risk assessment.
   - Visualizations: Portfolio breakdown, risk-return trade-offs, and historical performance graphs.

## Technologies Used
- **Python** (Jupyter Notebook for implementation)
- **APIs** (Alpha Vantage, Yahoo Finance)
- **AI Algorithms** (Greedy, A*, Simulated Annealing, CSP)
- **Visualization** (Matplotlib, Seaborn, Plotly)

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anis-Si-Salem/AI-PROJECT-Stock-Market-Investment.git
   cd AI-PROJECT-Stock-Market-Investment
