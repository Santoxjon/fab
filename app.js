var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

const indexRouter = require("./routes/index");
const matchesRouter = require("./routes/matches");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger.js");

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }", // Hide the top bar containing the "Authorize" button
};

app.use("/", indexRouter);
app.use("/matches", matchesRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    errorCode: "ENDPOINT_NOT_FOUND",
    message: "Not Found",
  });
});

module.exports = app;
