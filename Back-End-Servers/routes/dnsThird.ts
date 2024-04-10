const expressThirdApi = require("express");
const routerThirdApi = expressThirdApi.Router();

const delayThird = 1000;
const maxVaryThird = delayThird / 5;
const maxSizeThird = 64;
const maxDomainNameThird = 1024;
let cacheFIFO = [];
let cacheLRU = [];
let cacheLU = [];

function fifoCache(domainName) {
    if(maxSizeThird > cacheFIFO.length) {
        cacheFIFO.push(domainName);
    }
    else {
        cacheFIFO.shift();
        cacheFIFO.push(domainName);
    }
    return
}
function fifoContain(domainName) {
    if(cacheFIFO.indexOf(domainName) > -1) {
        return true;
    }
    else {
        return false;
    }
}

function lruCache(domainName) {
    if(maxSizeThird > cacheLRU.length) {
        cacheLRU.push(domainName);
        cacheLU.push(0);
        let i = 0;
        while(i < cacheLU.length) {
            cacheLU[i]++;
            i++;
        }
    }
    else {
        let i = 0;
        let index = 0;
        let lastUsed = 0;
        while(i < cacheLU.length) {
            if (cacheLU[i] > lastUsed) {
                lastUsed = cacheLU;
                index = i;
            }
            cacheLU[i]++;
            i++;
        }
        cacheLRU[index] = domainName;
        cacheLU[index] = 0;
    }
    return
}

function lruContain(domainName) {
    let index = cacheLRU.indexOf(domainName);
    if(index > -1) {
        cacheLU[index] = 0;
        let i = 0;
        while(i < cacheLU.length) {
            cacheLU[i]++;
            i++;
        }
        return true;
    }
    else {
        return false;
    }
}

function uniqueContain(domainName) {
    if(domainName <= (maxSizeThird * 1.5)) {
        return true;
    }
    else {
        return false;
    }
}

routerThirdApi.post("/recur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        try {
            const req = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'connections': connections,
                    'timeCount': timeCount,
                    'domainName': domainName
                })
            };
            let resNew = await fetch("http://localhost:8000/api/origin/", req).then(resNew => resNew.json());
            timeCount = delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1) + resNew.timeCount;
            connections = resNew.connections + 1;
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error.");
        }
        return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/recurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        if (fifoContain(domainName)) {
            thirdHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            thirdHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/origin/", req).then(resNew => resNew.json());
                timeCount = delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                fifoCache(domainName);
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/recurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        if (lruContain(domainName)) {
            thirdHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            thirdHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/origin/", req).then(resNew => resNew.json());
                timeCount = delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                lruCache(domainName);
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/recurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        if (uniqueContain(domainName)) {
            thirdHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            thirdHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/origin/", req).then(resNew => resNew.json());
                timeCount = delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/nonrecur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/nonrecurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        thirdHit = fifoContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/nonrecurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        thirdHit = lruContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/nonrecurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayThird + Math.floor(Math.random() * (maxVaryThird + 1) + 1);
        connections++;
        thirdHit = uniqueContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerThirdApi.post("/cacheFIFO", async (req, res) => {
    let { domainName } = req.body;
    fifoCache(domainName);
    return res.status(200).json({ success: true });
});

routerThirdApi.post("/cacheLRU", async (req, res) => {
    let { domainName } = req.body;
    lruCache(domainName);
    return res.status(200).json({ success: true });
});

module.exports = routerThirdApi;