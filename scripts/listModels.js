const { GoogleGenerativeAI } = require('@google/generative-ai');
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  try {
    const models = await client.listModels();
    console.log('models:', JSON.stringify(models, null, 2));
  } catch (err) {
    console.error('error:', err);
  }
})();
