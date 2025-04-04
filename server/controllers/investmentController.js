const Investment = require('../models/Investment');
const Group = require('../models/Group');
const StockFetcher = require('../stock/StockPriceFetcher');
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const stock_fetcher_instance = StockFetcher.getInstance(process.env.STOCK_API_KEY);
const CSV_FILE_PATH = path.resolve(__dirname, '../../US_stock_market.csv');
// Create a new investment
exports.createInvestment = async (req, res) => {
  const { group_id, stock_symbol, total_amount } = req.body;
  try {
    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    const stock_value = await stock_fetcher_instance.getStockPrice(stock_symbol);

    const investment = new Investment({
      group_id,
      stock_symbol,
      total_invested: total_amount,
      shares_bought: total_amount/stock_value,
      current_value: stock_value,
    });

    await investment.save();

    for (const member of group.members) {
      const contribution = new Contribution({
        investment_id: investment._id,
        user_id: member.toString(),
        amount: total_amount/group.members.length,
        group_id: group_id,
      });
      
      await contribution.save();
    }

    group.investments.push(investment._id);
    await group.save();

    res.json({ investment_id: investment._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get investment details
exports.getInvestment = async (req, res) => {
  try {

    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const current_value = await stock_fetcher_instance.getStockPrice(investment.stock_symbol);

    const result = {
      investment: investment,
      current_market_price: current_value,
    };
    res.json(result);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all investments for a group
exports.getGroupInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ group_id: req.params.group_id });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a contribution to an investment
exports.addContribution = async (req, res) => {
  const { user_id, amount } = req.body;
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const contribution = new Contribution({
      investment_id: investment._id,
      user_id,
      amount,
    });

    await contribution.save();
    res.json({ contribution_id: contribution._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get investment returns
exports.getInvestmentReturns = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const profitLoss = investment.current_value - investment.total_invested;
    res.json({ current_value: investment.current_value, profit_loss: profitLoss });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCompanyDetails = async (req, res) => {
  try{
    const stockDetails = {};

    console.log("entered get")

    if (!fs.existsSync(CSV_FILE_PATH)) {
      return res.status(404).json({
        success: false,
        error: 'CSV file not found. Please ensure the file exists at the correct path.'
      });
    }

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        // Extract the company name from each row
        stockDetails[row['Company Name']]=row['Stock Symbol'];
      })
      .on('end', () => {
        // Return the company names as JSON
        res.json({
          success: true,
          count: Object.keys(stockDetails).length,
          stocks: stockDetails
        });
      })
      .on('error', (error) => {
        res.status(500).json({
          success: false,
          error: error.message
        });
      });
  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};