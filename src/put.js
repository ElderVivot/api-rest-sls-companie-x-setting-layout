import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const TABLE_NAME = process.env.TABLE_NAME
const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

export async function PutData(event, context) {
    let body
    let statusCode = 200
    const headers = {
        "Content-Type": "application/json",
    }

    try {
        let requestJSON = JSON.parse(event.body)
        await dynamo.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    ...requestJSON
                },
            })
        )
        body = `Put item ${requestJSON.id}`
    } catch (error) {
        statusCode = 400
        body = error.message
    } finally {
        body = JSON.stringify(body)
    }

    return {
        statusCode,
        body,
        headers,
    }
}