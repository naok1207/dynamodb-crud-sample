var AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.createUser = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = JSON.parse(event.body);

  const Item = {
    email: requestBody.email,
    name: requestBody.name,
  };

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    ConditionExpression: "attribute_not_exists(email)",
    Item,
  };

  try {
    await documentClient.put(params).promise();
    body = { data: Item, message: "create user success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "create user failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};

module.exports.getUser = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Key: {
      email: requestBody.email,
    },
  };

  try {
    const result = await documentClient.get(params).promise();
    body = { data: result.Item, message: "get user success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "get user failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};

module.exports.getAllUser = async (_event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
  };

  try {
    const result = await documentClient.scan(params).promise();
    body = { data: result.Items, message: "get all user success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "get all user failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};

module.exports.getUsers = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    IndexName: "name-index",
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: { ":val": requestBody.name },
    KeyConditionExpression: "#name = :val", // 検索条件 (部分一致検索はできない)
  };

  try {
    const result = await documentClient.query(params).promise();
    body = { data: result.Items, message: "get users by name success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "get users by name failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};

module.exports.updateUser = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const requestBody = JSON.parse(event.body);

  const Item = {
    email: requestBody.email,
    name: requestBody.name,
  };

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Key: { email: Item.email },
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: { ":val": Item.name },
    UpdateExpression: "SET #name = :val", // 検索条件 (部分一致検索はできない)
  };

  try {
    await documentClient.update(params).promise();
    body = { data: Item, message: "update user name success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "update user name failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};

module.exports.deleteUser = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Key: { email: requestBody.email },
  };

  try {
    await documentClient.delete(params).promise();
    body = { message: "delete user name success" };
  } catch (err) {
    console.log({ err });
    statusCode = 400;
    body = { message: "delete user name failed" };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};
