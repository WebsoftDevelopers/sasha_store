import express from "express";

const app = express();
const port = Number(process.env.EXPO_PORT || process.env.PORT) || 3001;

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "mobile-services",
    message: "Placeholder service — mobile app API will live here.",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Mobile services listening on 0.0.0.0:${port}`);
});
