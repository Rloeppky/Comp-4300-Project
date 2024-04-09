import React from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Home = () => {

    let [message, setMessage] = React.useState('');

    const recurFIFOTest = async () => {
        try {
            let count = 0;
            const req = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //'username': username,
                    //'password': password
                })
            };
            //const res = await fetch("http://localhost:8001/api/dnsFront/", req).then(res => res.json());
            //sessionStorage.setItem("token", res.token);
            count++;
            setMessage(count.toString())
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='d-flex'>
            <Card style={{ backgroundColor: "#42484C" }}>
                <Col className="d-flex justify-content-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Recursive Test
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Non-Recursive Test
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Unqiue Test
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" onClick={(e) => recurFIFOTest()} size="lg">
                            Recursive Test: FIFO cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Non-Recursive Test: FIFO cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Unqiue Test: FIFO cache
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Recursive Test: LRU cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Non-Recursive Test: LRU cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Unqiue Test: LRU cache
                        </Button>
                    </Stack>
                </Col>
                <Col className="d-flex justify-items-center">
                    <Stack gap={3}>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Recursive Test: Unique cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Non-Recursive Test: Unique cache
                        </Button>
                        <Button className="mx-auto" variant="primary" type="submit" size="lg">
                            Unqiue Test: Unique cache
                        </Button>
                    </Stack>
                </Col>
            </Card>
            <Card className="m-4 p-4 d-flex" style={{ backgroundColor: "#42484C", height: "650px" }}>

            </Card>
        </div>
    )
};

export default Home;