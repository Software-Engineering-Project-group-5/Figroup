const axios = require('axios');

class StockPriceFetcher {
  constructor(apiKey) {
    if (StockPriceFetcher.instance) {
      return StockPriceFetcher.instance;
    }

    this.apiKey = apiKey;
    StockPriceFetcher.instance = this;
  }

  static getInstance(apiKey) {
    if (!StockPriceFetcher.instance) {
      StockPriceFetcher.instance = new StockPriceFetcher(apiKey);
    }
    return StockPriceFetcher.instance;
  }

  async getStockPrice(symbol) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
      console.log(this.apiKey)
      const response = await axios.get(url);

      const stockData = response.data['Global Quote'];
      if (!stockData) {
        throw new Error('Stock data not found');
      }

      const stockPrice = stockData['05. price'];
      return stockPrice;
    } catch (error) {
      console.error('Error fetching stock price:', error.message);
      return null;
    }
  }
}

// Export the singleton instance
module.exports = StockPriceFetcher;