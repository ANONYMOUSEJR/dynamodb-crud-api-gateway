/* 
Marshall: turns functions from native JS to the AWS thingy.
UnMarshall: opposite of marshall, lol.
*/

const db = require("./db");
const {
    /*
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand,
    */
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    GetItemCommand,
    DeleteItemCommand,
    ScanCommand,
} = require( "@aws-sdk/client-dynamodb" );
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getProduct = async (event) => {
    const response = { statusCode: 200 }; // OK.

    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            kay: marshall({ ID: event.pathParameters.ID }),
        };
        const { Item } = await db.send( new GetItemCommand(params))

        console.log({ Item });
        response.body = JSON.stringify({
            message: "Successfully retrieved product!",
            data: (Item) ? unmarshall(Item) : {},
            rawData:Item,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get product!",
            errorMsg: e.message,
            errorStack: e.Stack,
        })
    }

    return response;
};

const createProduct = async (event) => {
    const response = { statusCode: 200 }; // OK.

    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: marshall( body || {} ),
        };
        const createItem = await db.send( new PutItemCommand(params) );
        
        response.body = JSON.stringify({
            message: "Successfully created product!",
            createItem,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create product!",
            errorMsg: e.message,
            errorStack: e.Stack,
        })
    }

    return response;
};

const updateProduct = async (event) => {
    const response = { statusCode: 200 }; // OK.

    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: marshall( body || {} ),
        };
        const createItem = await db.send( new PutItemCommand(params) );
        
        response.body = JSON.stringify({
            message: "Successfully created product!",
            createItem,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create product!",
            errorMsg: e.message,
            errorStack: e.Stack,
        })
    }

    return response;
};

/*
const updatePost = async (event) => {
    const response = { statusCode: 200 };

    try {
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ productId: event.pathParameters.productId }), // What is going on in the following lines?
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };
        const updateResult = await db.send( new updateItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully updated post!",
            createResult,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update post!",
            errorMsg: e.message,
            errorStack: e.Stack,
        });
    }

    return response;
};
*/



const deleteProduct = async (event) => {
    const response = { statusCode: 200 }; // OK.

    try {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: marshall({ ID: event.pathParameters.ID }),
        };
        const updateResult = await db.send( new DeleteItemCommand(params) );
        
        response.body = JSON.stringify({
            message: "Successfully deleted product!",
            createResult,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete product!",
            errorMsg: e.message,
            errorStack: e.Stack,
        })
    }

    return response;
};

const getAllProducts = async (event) => {
    const response = { statusCode: 200 }; // OK.

    try {
        const { Items } = await db.send( new ScanCommand({ TableName: process.env.DYNAMO_TABLE_NAME }));
        
        response.body = JSON.stringify({
            message: "Successfully retrieved all products!",
            data: Items.map((item) => unmarshall(item)),
            Items,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve all products!",
            errorMsg: e.message,
            errorStack: e.Stack,
        })
    }

    return response;
};

module.exports = {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
}