import random
import math
import matplotlib.pyplot as plt

# === Portfolio Scoring === #
def heuristic_function(stock) -> float:
    """
    returns the heuristic value of a single stock.
    """
    # Placeholder heuristic function
    # In a real scenario, this could be based on various factors like expected return, volatility, etc.
    if stock == "AAPL":
        return 1.3
    elif stock == "GOOGL":
        return 1.2
    elif stock == "MSFT":
        return 1.1
    elif stock == "AMZN":
        return 1.4
    else:
        return 1.0

def portfolio_score(portfolio) -> float:
    """
    Calculates the score of the portfolio.
    """
    return sum(heuristic_function(stock) * weight for stock, weight in portfolio.items())

# === Neighbor Generator ===
def generate_neighbor(portfolio, noise_scale=0.05, num_neighbors=10, diversification=0.25, max_attempts=1000) -> list:
    """
    Generate a list of unique neighboring portfolios with diversification constraints.
    """
    stocks = list(portfolio.keys())
    neighbors = []
    seen = set()
    attempts = 0

    while len(neighbors) < num_neighbors and attempts < max_attempts:
        attempts += 1

        new_weights = []
        for stock in stocks:
            perturb = random.uniform(-noise_scale, noise_scale)
            new_weight = max(0.0, portfolio[stock] + perturb)
            new_weights.append(new_weight)

        total = sum(new_weights)
        if total == 0:
            continue  

        normalized_weights = [w / total for w in new_weights]

        if any(weight > diversification for weight in normalized_weights):
            continue

        key = tuple(normalized_weights)
        if key in seen:
            continue
        seen.add(key)

        neighbor = {stock: weight for stock, weight in zip(stocks, normalized_weights)}
        neighbors.append(neighbor)

    return neighbors


# === Simulated Annealing Optimizer ===
def simulated_annealing(initial_portfolio, initial_temp=1.0, cooling_rate=0.9975, max_iter=500, num_neighbors=10, diversification=0.25):
    """
    Simulated Annealing to optimize a portfolio (dict of stock:weight) with diversification constraints.
    """
    current_portfolio = initial_portfolio.copy()
    current_score = portfolio_score(current_portfolio)

    best_portfolio = current_portfolio.copy()
    best_score = current_score
    temp = initial_temp

    scores = []
    temperatures = []

    for iteration in range(max_iter):
        neighbors = generate_neighbor(current_portfolio, num_neighbors=num_neighbors, diversification=diversification)
        scored_neighbors = [(neighbor, portfolio_score(neighbor)) for neighbor in neighbors]

        if not scored_neighbors:
            break  # No valid neighbors, stop the process

        best_candidate, best_candidate_score = max(scored_neighbors, key=lambda x: x[1])
        delta = best_candidate_score - current_score

        if delta > 0 or random.random() < math.exp(delta / temp):
            current_portfolio = best_candidate
            current_score = best_candidate_score

            if current_score > best_score:
                best_portfolio = current_portfolio.copy()
                best_score = current_score
        
        scores.append(current_score)
        temperatures.append(temp)

        temp = max(temp * cooling_rate, 1e-8)

    return best_portfolio, best_score, scores, temperatures

# === Plotting Function ===
def plot_simulated_annealing(scores, temperatures):
    """
    Plots the simulated annealing process.
    """
    generations = range(len(scores))

    fig, ax1 = plt.subplots()

    # Plot portfolio scores
    ax1.set_xlabel('Generation')
    ax1.set_ylabel('Portfolio Score', color='tab:blue')
    ax1.plot(generations, scores, label='Portfolio Score', color='tab:green')
    ax1.tick_params(axis='y', labelcolor='tab:blue')

    # Plot temperature on a secondary y-axis
    ax2 = ax1.twinx()
    ax2.set_ylabel('Temperature', color='tab:red')
    ax2.plot(generations, temperatures, label='Temperature', color='tab:red')
    ax2.tick_params(axis='y', labelcolor='tab:red')

    fig.tight_layout()
    plt.title('Simulated Annealing Process')
    plt.show()


# === Example Usage ===

    #optimized_portfolio, score, scores, temperatures = simulated_annealing(initial_portfolio)
    #print("Optimized Portfolio:", optimized_portfolio)
    #print("Portfolio Score:", score)

    #plot_simulated_annealing(scores, temperatures)
