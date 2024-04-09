const expressServer = require("express")
const server = require("./app.ts");
const port = 8000;

server.get('/', (req, res) => res.send("Hello World!"));

server.listen(port, () => {
    console.log('Server is running on port ' + port);
})
