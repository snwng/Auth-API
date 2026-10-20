import express from "express";
import cors from "cors";
import routes from "./routes.js";
import config from "./utils/config.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", routes);

const PORT = config.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
