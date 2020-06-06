import Path from "path";
import celebrate from "celebrate";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(routes);

app.use("/uploads", express.static(Path.resolve(__dirname, "..", "uploads")));

app.use(celebrate.errors());
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    return res.status(400).json({
      error: err.toString(),
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
  next();
});

app
  .listen(3333)
  .on("listening", () => console.log("Server running on port 3333"));
