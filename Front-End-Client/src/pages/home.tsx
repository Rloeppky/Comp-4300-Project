import React from 'react';
import { Col, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Home = () => {

    //Vars used to display data
    const [testName, setTestName] = React.useState("");
    const [dataValues, setDataValues] = React.useState("");
    let averConnections = 0;
    let averTime = 0;
    let averFrontHit = 0;
    let averSecondHit = 0;
    let averThirdHit = 0;

    //Final vars
    const testCount = 200;
    const max = 100;
    const min = 1;

    //Vars used in function calls
    let totalConnections = 0;
    let totalTime = 0;
    let frontHitSuccess = 0;
    let secondHitSuccess = 0;
    let thirdHitSuccess = 0;
    let totalFrontHit = 0;
    let totalSecondHit = 0;
    let totalThirdHit = 0;
    let domainName = 0;

    function resetVars() {
        setDataValues("");
        totalConnections = 0;
        totalTime = 0;
        frontHitSuccess = 0;
        secondHitSuccess = 0;
        thirdHitSuccess = 0;
        totalFrontHit = 0;
        totalSecondHit = 0;
        totalThirdHit = 0;
        return null;
    }

    function resetDomainName() {
        let randomSpread = Math.floor(Math.random() * (max + 1) + min);
        if (randomSpread < 70) {
            domainName = Math.floor(Math.random() * (8 - 1 + 1) + 1);
        }
        else if (randomSpread < 85) {
            domainName = Math.floor(Math.random() * (16 - 9 + 1) + 9);
        }
        else if (randomSpread < 95) {
            domainName = Math.floor(Math.random() * (64 - 25 + 1) + 25);
        }
        else {
            domainName = Math.floor(Math.random() * (1024 - 88 + 1) + 88);
        }
    }

    //START OF TEST
    const recurTest = async () => {
        setTestName("recur test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
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
                const res = await fetch("http://localhost:8000/api/front/recur", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + "\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const nonrecurTest = async () => {
        setTestName("nonrecur test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
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
                const res = await fetch("http://localhost:8000/api/front/nonrecur", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = 0;
            averSecondHit = 0;
            averThirdHit = 0;
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + "\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const uniqueTest = async () => {
        setTestName("unique test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
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
                const res = await fetch("http://localhost:8000/api/front/unique", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = 0;
            averSecondHit = 0;
            averThirdHit = 0;
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + "\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const recurFIFOTest = async () => {
        setTestName("recurFIFO test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/recurFIFO", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const nonrecurFIFOTest = async () => {
        setTestName("nonrecurFIFO test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/nonrecurFIFO", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const uniqueFIFOTest = async () => {
        setTestName("uniqueFIFO test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/uniqueFIFO", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const recurLRUTest = async () => {
        setTestName("recurLRU test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/recurLRU", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const nonrecurLRUTest = async () => {
        setTestName("nonrecurFIFO test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/nonrecurLRU", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const uniqueLRUTest = async () => {
        setTestName("uniqueLRU test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/uniqueLRU", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const recurUniqueTest = async () => {
        setTestName("recurUnique test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/recurUnique", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const nonrecurUniqueTest = async () => {
        setTestName("nonrecurUnique test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/nonrecurUnique", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    //START OF TEST
    const uniqueUniqueTest = async () => {
        setTestName("uniqueUnique test");
        resetVars();
        try {
            let index = 0;
            while (index < testCount) {
                resetDomainName();
                const req = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'connections': 0,
                        'timeCount': 0,
                        'frontHit': null,
                        'secondHit': null,
                        'thirdHit': null,
                        'domainName': domainName
                    })
                };
                const res = await fetch("http://localhost:8000/api/front/uniqueUnique", req).then(res => res.json());
                totalConnections = totalConnections + res.connections;
                totalTime = totalTime + res.timeCount;
                if (res.frontHit === true) {
                    frontHitSuccess++;
                    totalFrontHit++;
                }
                else if (res.frontHit === false) {
                    totalFrontHit++;
                }
                if (res.secondHit === true) {
                    secondHitSuccess++;
                    totalSecondHit++;
                }
                else if (res.secondHit === false) {
                    totalSecondHit++;
                }
                if (res.thirdHit === true) {
                    thirdHitSuccess++;
                    totalThirdHit++;
                }
                else if (res.thirdHit === false) {
                    totalThirdHit++;
                }
                index++;
            }
            averConnections = totalConnections / testCount;
            averTime = totalTime / testCount;
            averFrontHit = Math.floor(frontHitSuccess / totalFrontHit * 100);
            averSecondHit = Math.floor(secondHitSuccess / totalSecondHit * 100);
            averThirdHit = Math.floor(thirdHitSuccess / totalThirdHit * 100);
            setDataValues("Average Connections: " + averConnections.toString() + ", Average Time Taken: " + averTime.toString() + ", Average Front Cache Hit: " + averFrontHit.toString() + "%, Average Second Cache Hit: " + averSecondHit.toString() + "%, Average Third Cache Hit: " + averThirdHit.toString() + "%\n");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='d-flex'>
            <Card style={{ backgroundColor: "#42484C" }}>
                <Col className="d-flex justify-content-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => recurTest()} size="lg">
                            Recursive Test
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => nonrecurTest()} size="lg">
                            Non-Recursive Test
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => uniqueTest()} size="lg">
                            Unqiue Test
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => recurFIFOTest()} size="lg">
                            Recursive Test: FIFO cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => nonrecurFIFOTest()} size="lg">
                            Non-Recursive Test: FIFO cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => uniqueFIFOTest()} size="lg">
                            Unqiue Test: FIFO cache
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => recurLRUTest()} size="lg">
                            Recursive Test: LRU cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => nonrecurLRUTest()} size="lg">
                            Non-Recursive Test: LRU cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => uniqueLRUTest()} size="lg">
                            Unqiue Test: LRU cache
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => recurUniqueTest()} size="lg">
                            Recursive Test: Unique cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => nonrecurUniqueTest()} size="lg">
                            Non-Recursive Test: Unique cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => uniqueUniqueTest()} size="lg">
                            Unqiue Test: Unique cache
                        </Button>
                    </Stack>
                </Col>
            </Card>
            <Card className="m-4 p-4 d-flex" style={{ backgroundColor: "#42484C", height: "650px" }}>
                <Card style={{ backgroundColor: "#F2F8FC" }}>
                    <label>{testName}</label>
                </Card>
                <Card style={{ backgroundColor: "#F2F8FC" }}>
                    <label>{dataValues}</label>
                </Card>
            </Card>
        </div>
    )
};

export default Home;