import AiUsage from "../models/aiUsage.model.js";

export const getAiUsage = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const records = await AiUsage.find({
      userId,
    }).lean();

    const usage = records.reduce(
      (total, record) => {
        total.totalRequests += 1;
        total.inputTokens += record.inputTokens || 0;
        total.outputTokens += record.outputTokens || 0;
        total.totalTokens += record.totalTokens || 0;

        return total;
      },
      {
        totalRequests: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      },
    );

    return res.status(200).json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error("Get AI usage error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI usage",
    });
  }
};