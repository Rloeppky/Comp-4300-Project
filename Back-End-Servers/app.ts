const expressApp = require("express");
const cors = require("cors");
const app = expressApp();

app.use(cors());
app.use(expressApp.json());

const dnsFront = require("./routes/dnsFront.ts");
const dnsSecond = require("./routes/dnsSecond.ts");
const dnsThird = require("./routes/dnsThird.ts");
const dnsOrigin = require("./routes/dnsOrigin.ts");

app.get("/", (req, res) => res.send("App is running"))
app.use("/api/front", dnsFront);
app.use("/api/second", dnsSecond);
app.use("/api/third", dnsThird);
app.use("/api/origin", dnsOrigin);

module.exports = app;