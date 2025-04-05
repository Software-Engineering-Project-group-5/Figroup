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
      const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await axios.get(url);
  
      const { price } = response.data;
      if (!price) {
        throw new Error('Stock price not found');
      }
  
      return price;
    } catch (error) {
      console.error('Error fetching stock price:', error.response?.data || error.message);
      return null;
    }
  }
}

// Export the singleton instance
module.exports = StockPriceFetcher;
