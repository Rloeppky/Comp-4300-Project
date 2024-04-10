const expressSecondApi = require("express");
const routerSecondApi = expressSecondApi.Router();

const delaySecond = 500;
const maxVarySecond = delaySecond / 5;
const maxSizeSecond = 16;
const maxDomainNameSecond = 1024;
let cacheFIFO = [];
let cacheLRU = [];
let cacheLU = [];

function fifoCache(domainName) {
    if(maxSizeSecond > cacheFIFO.length) {
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
    if(maxSizeSecond > cacheLRU.length) {
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
    if(domainName <= (maxSizeSecond * 1.5)) {
        return true;
    }
    else {
        return false;
    }
}

routerSecondApi.post("/recur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
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
            let resNew = await fetch("http://localhost:8000/api/third/recur", req).then(resNew => resNew.json());
            timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
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

routerSecondApi.post("/recurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (fifoContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurFIFO", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (thirdHit) {
                    fifoCache(domainName);
                }
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

routerSecondApi.post("/recurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (lruContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurLRU", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (thirdHit) {
                    lruCache(domainName);
                }
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

routerSecondApi.post("/recurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (uniqueContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurUnique", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
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

routerSecondApi.post("/nonrecur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerSecondApi.post("/nonrecurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        secondHit = fifoContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerSecondApi.post("/nonrecurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        secondHit = lruContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerSecondApi.post("/nonrecurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        secondHit = uniqueContain(domainName);
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerSecondApi.post("/unique", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameSecond - maxSizeSecond) {
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
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        try {
            const req = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'connections': 0,
                    'timeCount': 0,
                    'domainName': domainName
                })
            };
            let resNew = await fetch("http://localhost:8000/api/third/recur", req).then(resNew => resNew.json());
            timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
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

routerSecondApi.post("/uniqueFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameSecond - maxSizeSecond) {
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
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (fifoContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurFIFO", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (thirdHit) {
                    fifoCache(domainName);
                }
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

routerSecondApi.post("/uniqueLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameSecond - maxSizeSecond) {
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
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (lruContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurLRU", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (thirdHit) {
                    lruCache(domainName);
                }
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

routerSecondApi.post("/uniqueUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameSecond - maxSizeSecond) {
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
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (uniqueContain(domainName)) {
            secondHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            secondHit = false;
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': connections,
                        'timeCount': timeCount,
                        'frontHit': frontHit,
                        'secondHit': secondHit,
                        'thirdHit': thirdHit,
                        'domainName': domainName,
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/recurUnique", req).then(resNew => resNew.json());
                timeCount = delaySecond + Math.floor(Math.random() * (maxVarySecond + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
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

routerSecondApi.post("/cacheFIFO", async (req, res) => {
    let { domainName } = req.body;
    fifoCache(domainName);
    return res.status(200).json({ success: true });
});

routerSecondApi.post("/cacheLRU", async (req, res) => {
    let { domainName } = req.body;
    lruCache(domainName);
    return res.status(200).json({ success: true });
});

module.exports = routerSecondApi;