import app from "../server/app";

// Vercel Serverless Function entry point with exception boundary
export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel Serverless Invocation Error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        error: err?.message || "Serverless Function Exception",
        hint: "Check Vercel Dashboard > Functions Logs for stack trace"
      }));
    }
  }
}
