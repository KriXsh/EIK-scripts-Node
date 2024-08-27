# Elasticsearch CSV Uploader
Elk scripts  to perform update, insert in Elk indcies

This repository contains a Node.js script that uploads data from CSV files to an Elasticsearch cluster. The script is designed to handle large volumes of data efficiently by sending bulk requests and tracking upload progress.

# Features
- Bulk Upload: The script uploads data to Elasticsearch in bulk, with a configurable batch size.
- Batch ID Tracking: Each upload session is assigned a unique batch ID, which is stored in a JSON file for reference.
- Error Handling: The script includes error handling for bulk requests, ensuring that failures are logged and addressed.
- Flexible Configuration: Customize CSV file paths, Elasticsearch index names, and additional data fields.
  
# Prerequisites
- Node.js (v12.x or later)
- Elasticsearch Cluster
- Dependencies: Install via npm

 ## npm install @elastic/elasticsearch csv-parser uuid fs

# Usage
- Configure Elasticsearch Client: Update the Elasticsearch client setup in the script with your cluster URL and credentials.
- Set Up CSV Files: Modify the uploadMultipleCSVsToElasticsearch function with the paths to your CSV files and the corresponding Elasticsearch index names.

 # Run the Script: Execute the script using Node.js.
 - node your-script-name.js

Error Handling
The script handles errors during the bulk upload process. If a bulk request fails, the error is logged to the console for debugging.

Customization
Batch Size: The script sends bulk requests every 5000 lines by default. You can adjust this by modifying the if (lineNumber % 5000 === 0) line.
Additional Fields: You can customize the additionalHeaders array to include any additional fields you want to add to each document.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contributing
Feel free to open issues or submit pull requests for improvements and bug fixes.

Acknowledgments
Elasticsearch documentation and community support.
Open-source libraries: @elastic/elasticsearch, csv-parser, uuid.
