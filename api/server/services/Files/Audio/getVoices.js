const getCustomConfig = require('~/server/services/Config/getCustomConfig');
const { getProvider } = require('./textToSpeech');

/**
 * This function retrieves the available voices for the current TTS provider
 * It first fetches the TTS configuration and determines the provider
 * Then, based on the provider, it sends the corresponding voices as a JSON response
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {Error} - If the provider is not 'openai' or 'elevenlabs', an error is thrown
 */
async function getVoices(req, res) {
  try {
    const customConfig = await getCustomConfig();

    if (!customConfig || !customConfig?.speech?.tts) {
      throw new Error('Configuration or TTS schema is missing');
    }

    const ttsSchema = customConfig?.speech?.tts;
    const provider = getProvider(ttsSchema);
    let voices;

    switch (provider) {
      case 'openai':
        voices = ttsSchema.openai?.voices;
        break;
      case 'elevenlabs':
        voices = ttsSchema.elevenlabs?.voices;
        break;
      case 'localai':
        voices = ttsSchema.localai?.voices;
        break;
      default:
        throw new Error('Invalid provider');
    }

    res.json(voices);
  } catch (error) {
    res.status(500).json({ error: `Failed to get voices: ${error.message}` });
  }
}

module.exports = getVoices;
