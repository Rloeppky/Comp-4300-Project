const expressFrontApi = require("express");
const routerFrontApi = expressFrontApi.Router();

const delayFront = 200;
const maxVaryFront = delayFront / 5;
const maxSizeFront = 8;
const maxDomainNameFront = 1024;
let cacheFIFO = [];
let cacheLRU = [];
let cacheLU = [];

function fifoCache(domainName) {
    if(maxSizeFront > cacheFIFO.length) {
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
    if(maxSizeFront > cacheLRU.length) {
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
    if(domainName <= (maxSizeFront * 1.5)) {
        return true;
    }
    else {
        return false;
    }
}

routerFrontApi.post("/recur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
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
            let resNew = await fetch("http://localhost:8000/api/second/recur", req).then(resNew => resNew.json());
            timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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

routerFrontApi.post("/recurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (fifoContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/recurFIFO", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (secondHit) {
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

routerFrontApi.post("/recurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (lruContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/recurLRU", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (secondHit) {
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

routerFrontApi.post("/recurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (uniqueContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/recurUnique", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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

routerFrontApi.post("/nonrecur", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
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
            let resNew = await fetch("http://localhost:8000/api/second/nonrecur", req).then(resNew => resNew.json());
            timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
            connections = resNew.connections + 1;
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error.");
        }
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
            let resNew = await fetch("http://localhost:8000/api/third/nonrecur", req).then(resNew => resNew.json());
            timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
            connections = resNew.connections + 1;
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error.");
        }
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
            timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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

routerFrontApi.post("/nonrecurFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (fifoContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/second/nonrecurFIFO", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (secondHit) {
            fifoCache(domainName);
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/nonrecurFIFO", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                thirdHit = resNew.thirdHit;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (thirdHit) {
            //Call second/cache
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'domainName': domainName
                    })
                };
                await fetch("http://localhost:8000/api/second/cacheFIFO", req).then(res => res.json());
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            //Call third/cache
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'domainName': domainName
                    })
                };
                await fetch("http://localhost:8000/api/third/cacheFIFO", req).then(res => res.json());
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerFrontApi.post("/nonrecurLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (lruContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/second/nonrecurLRU", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (secondHit) {
            lruCache(domainName);
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/nonrecurLRU", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                thirdHit = resNew.thirdHit;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (thirdHit) {
            //Call second/cache
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'domainName': domainName
                    })
                };
                await fetch("http://localhost:8000/api/second/cacheLRU", req).then(res => res.json());
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                let resNew = await fetch("http://localhost:8000/api/origin", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
            //Call third/cache
            try {
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'domainName': domainName
                    })
                };
                await fetch("http://localhost:8000/api/third/cacheLRU", req).then(res => res.json());
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerFrontApi.post("/nonrecurUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (uniqueContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/second/nonrecurUnique", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (secondHit) {
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                        'domainName': domainName
                    })
                };
                let resNew = await fetch("http://localhost:8000/api/third/nonrecurUnique", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                thirdHit = resNew.thirdHit;
            } catch (error) {
                console.error(error);
                console.log('Front' + frontHit);
                res.status(500).send("Server error.");
            }
        }
        if (thirdHit) {
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
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
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

routerFrontApi.post("/unique", async (req, res) => {
    try {
        let { connections, timeCount, domainName } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameFront - maxSizeFront) {
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
                let resNew = await fetch("http://localhost:8000/api/origin", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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
                    'connections': connections,
                    'timeCount': timeCount,
                    'domainName': domainName
                })
            };
            let resNew = await fetch("http://localhost:8000/api/second/unique", req).then(resNew => resNew.json());
            timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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

routerFrontApi.post("/uniqueFIFO", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameFront - maxSizeFront) {
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
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (fifoContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/uniqueFIFO", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (secondHit) {
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

routerFrontApi.post("/uniqueLRU", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameFront - maxSizeFront) {
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
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (lruContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/uniqueLRU", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                secondHit = resNew.secondHit;
                thirdHit = resNew.thirdHit;
                if (secondHit) {
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

routerFrontApi.post("/uniqueUnique", async (req, res) => {
    try {
        let { connections, timeCount, domainName, frontHit, secondHit, thirdHit } = req.body;
        timeCount = timeCount + delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1);
        connections++;
        if (domainName >= maxDomainNameFront - maxSizeFront) {
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
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
                connections = resNew.connections + 1;
                return res.status(200).json({ connections: connections, timeCount: timeCount, domainName: domainName });
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error.");
            }
        }
        if (uniqueContain(domainName)) {
            frontHit = true;
            return res.status(200).json({ connections: connections, timeCount: timeCount, frontHit: frontHit, secondHit: secondHit, thirdHit: thirdHit, domainName: domainName });
        }
        else {
            frontHit = false;
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
                let resNew = await fetch("http://localhost:8000/api/second/uniqueUnique", req).then(resNew => resNew.json());
                timeCount = delayFront + Math.floor(Math.random() * (maxVaryFront + 1) + 1) + resNew.timeCount;
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

module.exports = routerFrontApi;