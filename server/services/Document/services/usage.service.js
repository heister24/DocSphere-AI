import AiUsage from "../models/aiUsage.model.js";

export const saveAiUsage = async ({
  userId,
  requestType,
  usageMetadata,
  model,
}) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const inputTokens = usageMetadata?.input_tokens || 0;

    const outputTokens = usageMetadata?.output_tokens || 0;

    const totalTokens =
      usageMetadata?.total_tokens || inputTokens + outputTokens;

    // await AiUsage.create({
    //   userId,
    //   requestType,
    //   inputTokens,
    //   outputTokens,
    //   totalTokens,
    //   model,
    // });

    const usage = await AiUsage.create({
      userId,
      requestType,
      inputTokens,
      outputTokens,
      totalTokens,
      model,
    });

    console.log("SAVED USAGE:", usage);
  } catch (error) {
    // Usage tracking should NOT break the user's AI request.
    console.error("Save AI usage error:", error);
  }
};
