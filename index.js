const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post('/api', async (req, res) => {
    res.status(200).json({"message":"Hello world"});
});

app.post('/api/token', async (req, res) => {
    console.log("start get token");
    const { client_id, refresh_token } = req.body;
    console.log(`your data is: ${client_id} ${refresh_token}`);
    const credentials = {
        grant_type: "refresh_token",
        client_id: client_id,
        refresh_token: refresh_token
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(credentials)
    };

    const response = await fetch('https://account.uipath.com/oauth/token', options);
    const responseData = await response.json();
    res.status(200).json(responseData);
});

app.post('/api/executions', async (req, res) => {
    const { botName, token } = req.body;

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    const endPoint = botName ?
        `https://cloud.uipath.com/brookrpfaldp/Prod/orchestrator_/odata/Jobs?$select=ReleaseName,EndTime,StartTime,key&$orderby=StartTime%20desc&$filter=ReleaseName eq '${botName}'` :
        'https://cloud.uipath.com/brookrpfaldp/Prod/orchestrator_/odata/Jobs?$select=ReleaseName,EndTime,StartTime,key&$orderby=StartTime%20desc'
    const response = await fetch(endPoint, options);

    const responseData = await response.json();
    res.status(200).json(responseData);
});

app.listen(PORT, () => {
    console.log(`Proxy server running on ${PORT}`);
});