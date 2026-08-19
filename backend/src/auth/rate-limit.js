const buckets = new Map();

export const rateLimit = ({ windowMs, max }) => (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = buckets.get(key);
  const bucket = current && now - current.startedAt < windowMs
    ? current
    : { startedAt: now, count: 0 };

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > max) {
    return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
  }
  return next();
};
