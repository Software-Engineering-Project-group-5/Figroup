const assert = require("assert");
const sinon = require("sinon");
const { createGroup, getGroup, addMemberByEmail, removeMember } = require("../controllers/groupController");
const Group = require("../models/Group");
const User = require("../models/User");

describe("Group Controller - createGroup", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a new group and add it to admin's groups", async function () {
    // Setup request and response
    const req = { 
      body: { 
        name: "Test Group", 
        type: "expense", 
        admin_id: "123" 
      } 
    };
    const res = { json: sinon.stub() };

    // Create stubs
    const saveGroupStub = sinon.stub().resolves();
    const saveUserStub = sinon.stub().resolves();

    // Create mocks
    const groupMock = {
      _id: "456",
      save: saveGroupStub
    };

    const userMock = {
      groups: [],
      save: saveUserStub
    };

    // Setup stubs
    sandbox.stub(Group.prototype, "save").callsFake(function() {
      this._id = "456";
      return saveGroupStub();
    });
    
    sandbox.stub(User, "findById").resolves(userMock);

    // Call function
    await createGroup(req, res);

    // Assertions
    assert.strictEqual(userMock.groups.length, 1);
    assert.strictEqual(userMock.groups[0], "456");
    assert.strictEqual(saveUserStub.calledOnce, true);
    assert.strictEqual(typeof id, "string")
    assert.strictEqual(sinon.match.has("admin_id", sinon.match.string));
  });

  it("should return 500 if an error occurs", async function () {
    // Setup request and response
    const req = { 
      body: { 
        name: "Test Group", 
        type: "expense", 
        admin_id: "123" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      send: sinon.stub() 
    };

    // Setup stub to throw error
    sandbox.stub(Group.prototype, "save").throws(new Error("Database error"));

    // Call function
    await createGroup(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("Group Controller - getGroup", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return group details with populated members, expenses, and investments", async function () {
    // Setup request and response
    const req = { params: { group_id: "456" } };
    const res = { json: sinon.stub() };

    // Create mock for populated group
    const groupMock = { 
      _id: "456", 
      name: "Test Group", 
      type: "expense",
      admin_id: "123",
      members: [{ _id: "123", name: "Test User", email: "test@example.com" }],
      expenses: [],
      investments: [] 
    };

    // Setup chain of stubs for populate method
    const populateStub3 = sinon.stub().resolves(groupMock);
    const populateStub2 = sinon.stub().returns({ populate: populateStub3 });
    const populateStub1 = sinon.stub().returns({ populate: populateStub2 });
    
    sandbox.stub(Group, "findById").returns({ 
      populate: populateStub1 
    });

    // Call function
    await getGroup(req, res);

    // Assertions
    assert.strictEqual(populateStub1.calledWith("members", "name email"), true);
    assert.strictEqual(populateStub2.calledWith("expenses"), true);
    assert.strictEqual(populateStub3.calledWith("investments"), true);
    assert.strictEqual(res.json.calledWith(groupMock), true);
  });

  it("should return 404 if group is not found", async function () {
    // Setup request and response
    const req = { params: { group_id: "999" } };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Setup chain of stubs for populate method that resolves to null
    const populateStub3 = sinon.stub().resolves(null);
    const populateStub2 = sinon.stub().returns({ populate: populateStub3 });
    const populateStub1 = sinon.stub().returns({ populate: populateStub2 });
    
    sandbox.stub(Group, "findById").returns({ 
      populate: populateStub1 
    });

    // Call function
    await getGroup(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "Group not found" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    // Setup request and response
    const req = { params: { group_id: "456" } };
    const res = { 
      status: sinon.stub().returnsThis(), 
      send: sinon.stub() 
    };

    // Setup stub to throw error
    sandbox.stub(Group, "findById").throws(new Error("Database error"));

    // Call function
    await getGroup(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("Group Controller - addMemberByEmail", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should add a user to a group by email", async function () {
    // Setup request and response
    const req = { 
      body: { 
        group_id: "456", 
        email: "test@example.com" 
      } 
    };
    const res = { json: sinon.stub() };

    // Create mocks
    const userMock = {
      _id: "123",
      email: "test@example.com",
      groups: [],
      save: sinon.stub().resolves()
    };

    const groupMock = {
      _id: "456",
      members: [],
      save: sinon.stub().resolves()
    };

    // Setup stubs
    sandbox.stub(User, "findOne").resolves(userMock);
    sandbox.stub(Group, "findById").resolves(groupMock);

    // Call function
    await addMemberByEmail(req, res);

    // Assertions
    assert.strictEqual(groupMock.members.length, 1);
    assert.strictEqual(groupMock.members[0], "123");
    assert.strictEqual(userMock.groups.length, 1);
    assert.strictEqual(userMock.groups[0], "456");
    assert.strictEqual(groupMock.save.calledOnce, true);
    assert.strictEqual(userMock.save.calledOnce, true);
    assert.strictEqual(res.json.calledWith({ success: true }), true);
  });

  it("should return 404 if user is not found", async function () {
    // Setup request and response
    const req = { 
      body: { 
        group_id: "456", 
        email: "nonexistent@example.com" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Setup stub
    sandbox.stub(User, "findOne").resolves(null);

    // Call function
    await addMemberByEmail(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "User not found" }), true);
  });

  it("should return 404 if group is not found", async function () {
    // Setup request and response
    const req = { 
      body: { 
        group_id: "999", 
        email: "test@example.com" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Setup stubs
    const userMock = {
      _id: "123",
      email: "test@example.com"
    };
    
    sandbox.stub(User, "findOne").resolves(userMock);
    sandbox.stub(Group, "findById").resolves(null);

    // Call function
    await addMemberByEmail(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "Group not found" }), true);
  });

  it("should return 400 if user is already in the group", async function () {
    // Setup request and response
    const req = { 
      body: { 
        group_id: "456", 
        email: "test@example.com" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Create mocks
    const userMock = {
      _id: "123",
      email: "test@example.com"
    };

    const groupMock = {
      _id: "456",
      members: ["123"] // User already in members array
    };

    // Setup stubs
    sandbox.stub(User, "findOne").resolves(userMock);
    sandbox.stub(Group, "findById").resolves(groupMock);

    // Call function
    await addMemberByEmail(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledWith({ msg: "User already in group" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    // Setup request and response
    const req = { 
      body: { 
        group_id: "456", 
        email: "test@example.com" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      send: sinon.stub() 
    };

    // Setup stub to throw error
    sandbox.stub(User, "findOne").throws(new Error("Database error"));

    // Call function
    await addMemberByEmail(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("Group Controller - removeMember", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should remove a user from a group", async function () {
    // Setup request and response
    const req = { 
      params: { 
        group_id: "456", 
        user_id: "123" 
      } 
    };
    const res = { json: sinon.stub() };

    // Create mocks
    const userMock = {
      _id: "123",
      groups: ["456", "789"],
      save: sinon.stub().resolves()
    };

    const groupMock = {
      _id: "456",
      members: ["123", "789"],
      save: sinon.stub().resolves()
    };

    // Setup stub implementation for comparing ObjectId strings
    const members = groupMock.members;
    groupMock.members = {
      filter: function(callback) {
        return members.filter(id => !callback(id));
      }
    };

    const groups = userMock.groups;
    userMock.groups = {
      filter: function(callback) {
        return groups.filter(id => !callback(id));
      }
    };

    // Setup stubs
    sandbox.stub(Group, "findById").resolves(groupMock);
    sandbox.stub(User, "findById").resolves(userMock);

    // Call function
    await removeMember(req, res);

    // Assertions
    assert.deepStrictEqual(groupMock.members, ["123"]);
    assert.deepStrictEqual(userMock.groups, ["456"]);
    assert.strictEqual(groupMock.save.calledOnce, true);
    assert.strictEqual(userMock.save.calledOnce, true);
    assert.strictEqual(res.json.calledWith({ success: true }), true);
  });

  it("should return 404 if group is not found", async function () {
    // Setup request and response
    const req = { 
      params: { 
        group_id: "999", 
        user_id: "123" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Setup stub
    sandbox.stub(Group, "findById").resolves(null);

    // Call function
    await removeMember(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "Group not found" }), true);
  });

  it("should return 404 if user is not found", async function () {
    // Setup request and response
    const req = { 
      params: { 
        group_id: "456", 
        user_id: "999" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      json: sinon.stub() 
    };

    // Setup stubs
    const groupMock = {
      _id: "456",
      members: ["123", "789"]
    };
    
    sandbox.stub(Group, "findById").resolves(groupMock);
    sandbox.stub(User, "findById").resolves(null);

    // Call function
    await removeMember(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "User not found" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    // Setup request and response
    const req = { 
      params: { 
        group_id: "456", 
        user_id: "123" 
      } 
    };
    const res = { 
      status: sinon.stub().returnsThis(), 
      send: sinon.stub() 
    };

    // Setup stub to throw error
    sandbox.stub(Group, "findById").throws(new Error("Database error"));

    // Call function
    await removeMember(req, res);

    // Assertions
    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});