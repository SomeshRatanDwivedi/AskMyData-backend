import redisClient from "../configs/radis.config.js";

export const rateLimiter = (limit, windowInSeconds) => {
  return async (req, res, next) => {
    const userId = req.user.userId; // from your JWT middleware
    const rateLimitkey = `rate_limit:${userId}`;
    const groqApiRedisKey = `groq_api_key:${userId}`
    try {
      // Increment call count
      const requests = await redisClient.incr(rateLimitkey);
      const groqApiKey = await redisClient.get(groqApiRedisKey);
      // First time → set expiration window
      if (requests === 1) {
        await redisClient.expire(rateLimitkey, windowInSeconds);
      }

      // Check limit
      if (requests > limit) {
        return res.status(429).json({
          success:false,
          message: `Rate limit reached. Requests without a personal API key are limited to ${limit} per ${windowInSeconds} seconds.`
        });
      }

      next();
    } catch (err) {
      console.error("Rate limit error:", err);
      next(); // don’t block if Redis fails
    }
  };
};
