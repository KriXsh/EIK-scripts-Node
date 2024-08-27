/**
 * 
 * # Dependencies: 
 *  - npm install @elastic/elasticsearch csv-parser uuid fs
 */

const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const csvParser = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

// Setup Elasticsearch client with placeholder credentials
const client = new Client({
    node: 'https://your-elasticsearch-cluster-url',
    auth: {
        username: 'your-username',
        password: 'your-password'
    }
});

let successCount = 0; // To count the successfully uploaded documents

// Upload CSV Data
async function uploadCSVToElasticsearch(filePath, indexName) {
    const batchId = uuidv4(); // Generate a unique batchId
    const additionalHeaders = [
        // you can add additional Headers
    ];
    const parser = fs.createReadStream(filePath).pipe(csvParser());
    let lineNumber = 0;
    let headers = null;
    let batch = [];

    for await (const data of parser) {
        lineNumber++;
        if (!headers) {
            headers = Object.keys(data);
        }
        const document = headers.reduce((acc, header) => {
            acc[header] = data[header] !== undefined && data[header] !== '' ? data[header] : 'NA';
            return acc;
        }, {});

        additionalHeaders.forEach(header => document[header] = 'NA');   // Add the additional headers with 'NA' values
        document.batchId = batchId;                                     // Add the batchId to the document	

        const record = [
            { index: { _index: indexName, _id: uuidv4() } },
            { createdAt: new Date().toISOString(), ...document }
        ];

        const jsonFilePath = 'batch-data.json';                            // Store the batchId in a separate file
        const csvFileName = filePath.split('/').pop();

        let existingData = {};
        try {
            existingData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        } catch (error) {
            console.error('Failed to read file:', error);
        }

        const jsonData = {
            ...existingData,
            [csvFileName]: batchId
        };

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));            // Write data back to file

        batch.push(record);

        // Send bulk request every 5000 lines
        if (lineNumber % 5000 === 0) {
            await sendBulkRequest(batch);
            batch = [];
        }

        console.log('Data being uploaded:', document);
        console.log(successCount++)
    }

    if (batch.length > 0) {
        await sendBulkRequest(batch);
    }
}

// Handle Bulk Request Errors -  function sends a bulk request to Elasticsearch. If the request fails, it logs the error:
async function sendBulkRequest(records) {
    const body = records.flatMap(record => [
        { index: { _index: record[0].index._index, _id: record[0].index._id } },
        record[1]
    ]);

    try {
        await client.bulk({ refresh: true, body });
    } catch (error) {
        console.error('Failed to send bulk request:', error);
    }
}

// Function to upload multiple CSV files to Elasticsearch
async function uploadMultipleCSVsToElasticsearch(files) {
    for (const file of files) {
        await uploadCSVToElasticsearch(file.path, file.index);
    }
}

// Example usage with placeholder file paths and index names
uploadMultipleCSVsToElasticsearch([
    { path: './your-csv-files/sample1.csv', index: 'your_index_name_1' },
    { path: './your-csv-files/sample2.csv', index: 'your_index_name_2' },
    // Add more file paths and index names here...
])
    .then(() => console.log('Success object count:', successCount))
    .catch(console.log);
