const express = require('express');
const AWS = require('aws-sdk');
const app = express();
var fs = require('fs');
require('dotenv').config();
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
AWS.config.update({
  region: process.env.NODE_ENV_REGION, 
  accessKeyId: process.env.NODE_ENV_ACCESS_KEY, 
  secretAccessKey: process.env.NODE_ENV_SECREAT_ACCESS_KEY,
});

// Create an S3 instance
const s3 = new AWS.S3();

app.get('/preview/:bucket/:key', async (req, res) => {
  const bucket = req.params.bucket;
  const key = req.params.key;
  console.log( process.env.NODE_ENV_REGION)
  try {
    // Retrieve the file from S3
    const params = {
      Bucket: bucket,
      Key: key
    };
    // console.log(params);
    const s3Response = await s3.getObject(params).promise();
    console.log(s3Response)
  
    // const filePath = `downloads/${key}`;
    // const fileStream = fs.createWriteStream(filePath);
    // s3Response.Body.pipe(fileStream);

    // Set appropriate headers and send the file as a response
    res.set({
      'Content-Type': s3Response.ContentType,
      'Content-Length': s3Response.ContentLength
    });
    res.send(s3Response.Body);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error retrieving the file');
  }
});


const PORT =  4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
