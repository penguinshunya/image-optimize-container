import { Storage } from "@google-cloud/storage";
import fastify from "fastify";
import sharp from "sharp";
import { correctFormat, toMimeType, toQuery } from "./functions";
import { Query } from "./types";

const PORT = parseInt(process.env.PORT || "3000");
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;

if (GCS_BUCKET_NAME === undefined) {
  throw new Error("GCS_BUCKET_NAME is not defined");
}

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

  const object = storage.bucket(GCS_BUCKET_NAME).file(path);
  const [exists] = await object.exists();
  if (!exists) {
    console.log(`Object ${path} does not exist`);
    res.status(404).send("Not found: " + path);
    return;
  }
  const pipe = object.createReadStream().pipe(sharp());
  pipe.resize(query.w, query.h);
  if (query.fm !== undefined) {
    pipe.toFormat(query.fm, { quality: query.q });
  }
  const outputFormat = await pipe.metadata().then((m) => m.format);
  if (!correctFormat(outputFormat)) {
    console.log(`Output format ${outputFormat} is not supported`);
    res.status(500).send("Internal server error");
    return;
  }
  const buffer = await pipe.toBuffer();
  res.header("Content-Type", toMimeType(query.fm ?? outputFormat));
  res.header("Cache-Control", "public, max-age=2592000");
  res.send(buffer);
  console.log(`Served ${path} with query ${JSON.stringify(query)}`);
});

server.listen({ host: "0.0.0.0", port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
