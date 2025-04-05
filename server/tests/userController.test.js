const assert = require("assert");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login, getProfile, getUser, updateUser } = require("../controllers/userController");
const User = require("../models/User");

describe("User Controller - register", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return 400 if user already exists", async function () {
    const req = { body: { name: "Test User", email: "test@example.com", password: "password123" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(User, "findOne").resolves({ id: "123" });

    await register(req, res);

    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledWith({ msg: "User already exists" }), true);
  });

  it("should return 201 when a new user is created and return token", async function () {
    const req = { body: { name: "New User", email: "new@example.com", password: "password123" } };
    const res = { json: sinon.stub() };

    sandbox.stub(User, "findOne").resolves(null);
    sandbox.stub(bcrypt, "hash").resolves("hashedpassword");
    sandbox.stub(User.prototype, "save").resolves();
    
    // Update to match how JWT is called in controller
    sandbox.stub(jwt, "sign").callsFake((payload, secret, options, callback) => {
      callback(null, "fake-jwt-token");
    });

    // Set environment variable or mock process.env
    process.env.JWT_SECRET = "testsecret";

    await register(req, res);

    assert.strictEqual(res.json.calledWithMatch({ user_id: sinon.match.string, token: "fake-jwt-token" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { body: { name: "Error User", email: "error@example.com", password: "password123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    sandbox.stub(User, "findOne").throws(new Error("Database error"));

    await register(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("User Controller - login", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return 400 if user does not exist", async function () {
    const req = { body: { email: "nonexistent@example.com", password: "password123" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(User, "findOne").resolves(null);

    await login(req, res);

    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledWith({ msg: "Invalid credentials" }), true);
  });

  it("should return 400 if password is incorrect", async function () {
    const req = { body: { email: "user@example.com", password: "wrongpassword" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(User, "findOne").resolves({ id: "123", password_hash: "hashedpassword" });
    sandbox.stub(bcrypt, "compare").resolves(false);

    await login(req, res);

    assert.strictEqual(res.status.calledWith(400), true);
    assert.strictEqual(res.json.calledWith({ msg: "Invalid credentials" }), true);
  });

  it("should return 200 and a token when login is successful", async function () {
    const req = { body: { email: "user@example.com", password: "correctpassword" } };
    const res = { json: sinon.stub() };

    sandbox.stub(User, "findOne").resolves({ id: "123", password_hash: "hashedpassword" });
    sandbox.stub(bcrypt, "compare").resolves(true);
    
    // Update JWT stub to match controller
    sandbox.stub(jwt, "sign").callsFake((payload, secret, options, callback) => {
      callback(null, "fake-jwt-token");
    });
    
    // Set environment variable
    process.env.JWT_SECRET = "testsecret";

    await login(req, res);

    assert.strictEqual(res.json.calledWithMatch({ token: "fake-jwt-token" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { body: { email: "error@example.com", password: "password123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    sandbox.stub(User, "findOne").throws(new Error("Database error"));

    await login(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

/** ===================== TEST: getProfile ===================== */
describe("getProfile", function () {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  
  it("should return user details without password_hash", async function () {
    const req = { user: { id: "123" } };
    const res = { json: sinon.stub(), status: sinon.stub().returnsThis(), send: sinon.stub() };

    // Create a stub that handles the select method chain
    const selectStub = sinon.stub().returns({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com"
    });
    
    const findByIdStub = sandbox.stub(User, "findById").returns({
      select: selectStub
    });

    await getProfile(req, res);

    assert.strictEqual(findByIdStub.calledWith("123"), true);
    assert.strictEqual(selectStub.calledWith("-password_hash"), true);
    assert.strictEqual(res.json.calledWithMatch({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com" 
    }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { user: { id: "123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // This mock needs to handle the chained select method
    sandbox.stub(User, "findById").throws(new Error("Database error"));

    await getProfile(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

describe("fetchUserProfileDetails", function () {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  
  it("should return user details without password_hash", async function () {
    const req = { user: { id: "123" } };
    const res = { json: sinon.stub(), status: sinon.stub().returnsThis(), send: sinon.stub() };

    // Create a stub that handles the select method chain
    const selectStub = sinon.stub().returns({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com"
    });
    
    const findByIdStub = sandbox.stub(User, "findById").returns({
      select: selectStub
    });

    await getProfile(req, res);

    assert.strictEqual(findByIdStub.calledWith("123"), true);
    assert.strictEqual(selectStub.calledWith("-password_hash"), true);
    assert.strictEqual(res.json.calledWithMatch({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com" 
    }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { user: { id: "123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // This mock needs to handle the chained select method
    sandbox.stub(User, "findById").throws(new Error("Database error"));

    await getProfile(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

/** ===================== TEST: getUser ===================== */
describe("getUser", function () {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  
  it("should return user details by ID", async function () {
    const req = { params: { user_id: "123" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub(), send: sinon.stub() };

    // Create a stub that handles the select method chain
    const selectStub = sinon.stub().returns({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com"
    });
    
    const findByIdStub = sandbox.stub(User, "findById").returns({
      select: selectStub
    });

    await getUser(req, res);

    assert.strictEqual(findByIdStub.calledWith("123"), true);
    assert.strictEqual(selectStub.calledWith("-password_hash"), true);
    assert.strictEqual(res.json.calledWithMatch({ 
      id: "123", 
      name: "Test User", 
      email: "test@example.com"
    }), true);
  });

  it("should return 404 if user is not found", async function () {
    const req = { params: { user_id: "123" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub(), send: sinon.stub() };

    // Mock select() to return null to simulate not finding a user
    const selectStub = sinon.stub().returns(null);
    sandbox.stub(User, "findById").returns({
      select: selectStub
    });

    await getUser(req, res);

    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "User not found" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { params: { user_id: "123" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    // This mock needs to handle the chained select method
    sandbox.stub(User, "findById").throws(new Error("Database error"));

    await getUser(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});

/** ===================== TEST: updateUser ===================== */
describe("updateUser", function () {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  
  it("should update user details and return the updated user", async function () {
    const req = { params: { user_id: "123" }, body: { name: "Updated Name", email: "updated@example.com" } };
    const res = { json: sinon.stub() };

    const userStub = { id: "123", name: "Old Name", email: "old@example.com", save: sinon.stub().resolves() };
    sandbox.stub(User, "findById").resolves(userStub);

    await updateUser(req, res);

    assert.strictEqual(userStub.name, "Updated Name");
    assert.strictEqual(userStub.email, "updated@example.com");
    assert.strictEqual(res.json.calledWithMatch({ id: "123", name: "Updated Name", email: "updated@example.com" }), true);
  });

  it("should return 404 if user is not found", async function () {
    const req = { params: { user_id: "123" }, body: { name: "Updated Name", email: "updated@example.com" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sandbox.stub(User, "findById").resolves(null);

    await updateUser(req, res);

    assert.strictEqual(res.status.calledWith(404), true);
    assert.strictEqual(res.json.calledWith({ msg: "User not found" }), true);
  });

  it("should return 500 if an error occurs", async function () {
    const req = { params: { user_id: "123" }, body: { name: "Updated Name", email: "updated@example.com" } };
    const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

    sandbox.stub(User, "findById").throws(new Error("Database error"));

    await updateUser(req, res);

    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.send.calledWith("Server error"), true);
  });
});