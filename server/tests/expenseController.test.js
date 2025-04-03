const assert = require("assert");
const sinon = require("sinon");
const { createExpense, getExpense, getGroupExpenses } = require("../controllers/expenseController");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const Balance = require("../models/Balance");

describe("Expense Controller - createExpense", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return 404 if group not found", async function () {
    const req = { 
      body: { 
        group_id: "nonexistent", 
        payer_id: "user1", 
        amount: 300, 
        description: "Dinner", 
        split_type: "EQUAL" 
      } 
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(Group, "findById").resolves(null);

    await createExpense(req, res);

    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "Group not found" }), true);
  });

//   it("should create an expense with equal split and update balances", async function () {
//     const req = { 
//       body: { 
//         group_id: "group123", 
//         payer_id: "user1", 
//         amount: 300, 
//         description: "Dinner", 
//         split_type: "EQUAL" 
//       } 
//     };
//     const res = { json: sinon.stub() };

//     // Mock group with three members
//     const mockGroup = {
//       _id: "group123",
//       members: ["user1", "user2", "user3"],
//       expenses: [],
//       save: sinon.stub().resolves()
//     };

//     // Mock expenses and balances
//     const mockExpense = {
//       _id: "expense123",
//       save: sinon.stub().resolves()
//     };

//     const mockBalanceUser1 = {
//       group_id: "group123",
//       user_id: "user1",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     const mockBalanceUser2 = {
//       group_id: "group123",
//       user_id: "user2",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     const mockBalanceUser3 = {
//       group_id: "group123",
//       user_id: "user3",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     // Setup stubs
//     sandbox.stub(Group, "findById").resolves(mockGroup);
//     sandbox.stub(Expense.prototype, "save").resolves({ _id: "expense123" });
    
//     // Balance.findOne should return different balances depending on the user
//     const balanceFindOneStub = sandbox.stub(Balance, "findOne");
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user1" }).resolves(mockBalanceUser1);
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user2" }).resolves(mockBalanceUser2);
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user3" }).resolves(mockBalanceUser3);
    
//     // Mock Expense constructor
//     const ExpenseConstructorStub = sandbox.stub().returns(mockExpense);
//     sandbox.stub(Expense, "prototype").constructor = ExpenseConstructorStub;

//     await createExpense(req, res);

//     // Verify group was looked up
//     assert.strictEqual(Group.findById.calledWith("group123"), true);
    
//     // Verify expense was saved
//     assert.strictEqual(mockExpense.save.called, true);
    
//     // Verify group was updated with the new expense
//     assert.strictEqual(mockGroup.expenses.includes("expense123"), true);
//     assert.strictEqual(mockGroup.save.called, true);
    
//     // Verify balances were looked up for all members
//     assert.strictEqual(Balance.findOne.calledWith({ group_id: "group123", user_id: "user1" }), true);
//     assert.strictEqual(Balance.findOne.calledWith({ group_id: "group123", user_id: "user2" }), true);
//     assert.strictEqual(Balance.findOne.calledWith({ group_id: "group123", user_id: "user3" }), true);
    
//     // Verify balances were saved
//     assert.strictEqual(mockBalanceUser1.save.called, true);
//     assert.strictEqual(mockBalanceUser2.save.called, true);
//     assert.strictEqual(mockBalanceUser3.save.called, true);
    
//     // Verify response
//     assert.strictEqual(res.json.calledWith({ expense_id: "expense123" }), true);
//   });

//   it("should create an expense with custom split", async function () {
//     const req = { 
//       body: { 
//         group_id: "group123", 
//         payer_id: "user1", 
//         amount: 300, 
//         description: "Dinner", 
//         split_type: "CUSTOM",
//         split_details: {
//           "user1": 100,
//           "user2": 150,
//           "user3": 50
//         }
//       } 
//     };
//     const res = { json: sinon.stub() };

//     // Mock group
//     const mockGroup = {
//       _id: "group123",
//       members: ["user1", "user2", "user3"],
//       expenses: [],
//       save: sinon.stub().resolves()
//     };

//     // Mock expense
//     const mockExpense = {
//       _id: "expense123",
//       save: sinon.stub().resolves()
//     };

//     // Mock balances
//     const mockBalanceUser1 = {
//       group_id: "group123",
//       user_id: "user1",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     const mockBalanceUser2 = {
//       group_id: "group123",
//       user_id: "user2",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     const mockBalanceUser3 = {
//       group_id: "group123",
//       user_id: "user3",
//       balances: new Map(),
//       save: sinon.stub().resolves()
//     };

//     // Setup stubs
//     sandbox.stub(Group, "findById").resolves(mockGroup);
//     sandbox.stub(Expense.prototype, "save").resolves({ _id: "expense123" });
    
//     const balanceFindOneStub = sandbox.stub(Balance, "findOne");
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user1" }).resolves(mockBalanceUser1);
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user2" }).resolves(mockBalanceUser2);
//     balanceFindOneStub.withArgs({ group_id: "group123", user_id: "user3" }).resolves(mockBalanceUser3);
    
//     // Mock Expense constructor
//     const ExpenseConstructorStub = sandbox.stub().returns(mockExpense);
//     sandbox.stub(Expense, "prototype").constructor = ExpenseConstructorStub;

//     await createExpense(req, res);

//     // Verify expense was saved
//     assert.strictEqual(mockExpense.save.called, true);
    
//     // Verify response
//     assert.strictEqual(res.json.calledWith({ expense_id: "expense123" }), true);
//   });

  it("should return 500 if an error occurs", async function () {
    const req = { 
      body: { 
        group_id: "group123", 
        payer_id: "user1", 
        amount: 300, 
        description: "Dinner", 
        split_type: "EQUAL" 
      } 
    };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // Mock console.error to prevent test output noise
    sandbox.stub(console, "error");
    
    // Force an error
    sandbox.stub(Group, "findById").throws(new Error("Database error"));

    await createExpense(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("Expense Controller - getExpense", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return expense details by ID", async function () {
    const req = { params: { expense_id: "expense123" } };
    const res = { json: sinon.stub() };

    const mockExpense = {
      _id: "expense123",
      group_id: "group123",
      payer_id: "user1",
      amount: 300,
      description: "Dinner",
      split_type: "EQUAL"
    };

    sandbox.stub(Expense, "findById").resolves(mockExpense);

    await getExpense(req, res);

    assert.strictEqual(Expense.findById.calledWith("expense123"), true);
    assert.strictEqual(res.json.calledWith(mockExpense), true);
  });

  it("should return 404 if expense not found", async function () {
    const req = { params: { expense_id: "nonexistent" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(Expense, "findById").resolves(null);

    await getExpense(req, res);

    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "Expense not found" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { params: { expense_id: "expense123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // Mock console.error to prevent test output noise
    sandbox.stub(console, "error");
    
    // Force an error
    sandbox.stub(Expense, "findById").throws(new Error("Database error"));

    await getExpense(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("Expense Controller - getGroupExpenses", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return all expenses for a group", async function () {
    const req = { params: { group_id: "group123" } };
    const res = { json: sinon.stub() };

    const mockExpenses = [
      {
        _id: "expense123",
        group_id: "group123",
        payer_id: "user1",
        amount: 300,
        description: "Dinner",
        split_type: "EQUAL"
      },
      {
        _id: "expense456",
        group_id: "group123",
        payer_id: "user2",
        amount: 150,
        description: "Groceries",
        split_type: "CUSTOM"
      }
    ];

    sandbox.stub(Expense, "find").resolves(mockExpenses);

    await getGroupExpenses(req, res);

    assert.strictEqual(Expense.find.calledWith({ group_id: "group123" }), true);
    assert.strictEqual(res.json.calledWith(mockExpenses), true);
  });

  it("should return empty array if no expenses found", async function () {
    const req = { params: { group_id: "group123" } };
    const res = { json: sinon.stub() };

    sandbox.stub(Expense, "find").resolves([]);

    await getGroupExpenses(req, res);

    assert.strictEqual(Expense.find.calledWith({ group_id: "group123" }), true);
    assert.strictEqual(res.json.calledWith([]), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { params: { group_id: "group123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // Mock console.error to prevent test output noise
    sandbox.stub(console, "error");
    
    // Force an error
    sandbox.stub(Expense, "find").throws(new Error("Database error"));

    await getGroupExpenses(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});