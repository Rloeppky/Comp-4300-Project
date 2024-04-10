const expressOriginApi = require("express");
const routerOriginApi = expressOriginApi.Router();

const delayOrigin = 2000;
const maxVaryOrigin = delayOrigin / 5;

routerOriginApi.post("/", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayOrigin + Math.floor(Math.random() * (maxVaryOrigin + 1) + 1);
        connections++;
        return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

module.exports = routerOriginApi;