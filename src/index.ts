import fastify from "fastify";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { correctFormat, toMimeType, toQuery } from "./functions";
import { Query } from "./types";

const server = fastify();
const storage = new Storage();

interface Params {
  "*": string;
}

server.get("/*", async (req, res) => {
  const path = (req.params as Params)["*"];
  let query: Query;
  try {
    query = toQuery(req.query);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      res.status(400).send(e.message);
    } else {
      console.log(e);
      res.status(500).send("Internal server error");
    }
    return;
  }

  const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
  if (!GCS_BUCKET_NAME) {
    console.log("GCS_BUCKET_NAME is not set");
    res.status(500).send("Internal server error");
    return;
  }
  const object = storage.bucket(GCS_BUCKET_NAME).file(path);
  const [exists] = await object.exists();
  if (!exists) {
    console.log(`Object ${path} does not exist`);
    res.status(404).send("Not found: " + path);
    return;
  }
  const pipe = object.createReadStream().pipe(sharp());
  pipe.resize(query.w, query.h);
  if (query.format !== undefined) {
    pipe.toFormat(query.format);
  }
  const outputFormat = await pipe.metadata().then((m) => m.format);
  if (!correctFormat(outputFormat)) {
    console.log(`Output format ${outputFormat} is not supported`);
    res.status(500).send("Internal server error");
    return;
  }
  const buffer = await pipe.toBuffer();
  res.header("Content-Type", toMimeType(query.format ?? outputFormat));
  res.header("Cache-Control", "public, max-age=2592000");
  res.send(buffer);
});

const port = parseInt(process.env.PORT || "3000");

server.listen({ host: "0.0.0.0", port }, () => {
  console.log(`Server listening on port ${port}`);
});
