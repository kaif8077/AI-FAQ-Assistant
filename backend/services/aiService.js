const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_TOKEN);
const MODEL = process.env.HF_MODEL || 'microsoft/phi-2';

async function getAIResponse(question) {
  const start = Date.now();
  try {
    const response = await hf.textGeneration({
      model: MODEL,
      inputs: `You are a helpful FAQ assistant. Answer concisely.\nQuestion: ${question}\nAnswer:`,
      parameters: { 
        max_new_tokens: 250,      // reduced from 500 → faster generation
        temperature: 0.3,         // lower = more direct, less random
        return_full_text: false,
        do_sample: false,         // greedy decoding → fastest
      },
      options: {
        wait_for_model: true,     // wait if model is loading
        timeout: 20,              // fail after 20 seconds
      }
    });
    return {
      answer: response.generated_text.trim(),
      processingTime: Date.now() - start,
      model: MODEL,
    };
  } catch (error) {
    console.error('AI error:', error);
    return {
      answer: "I'm having trouble answering right now. Please try again.",
      processingTime: Date.now() - start,
      model: 'fallback',
    };
  }
}

module.exports = { getAIResponse };