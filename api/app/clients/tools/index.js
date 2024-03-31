const availableTools = require('./manifest.json');
// Basic Tools
const CodeBrew = require('./CodeBrew');
const WolframAlphaAPI = require('./Wolfram');
const AzureAiSearch = require('./AzureAiSearch');
const OpenAICreateImage = require('./DALL-E');
const Database = require('./Database');
const N8nSave = require('./N8nSave');
const N8nRun = require('./N8nRun');
const N8nList = require('./N8nList');
const StableDiffusionAPI = require('./StableDiffusion');
const SelfReflectionTool = require('./SelfReflection');

// Structured Tools
const DALLE3 = require('./structured/DALLE3');
const ChatTool = require('./structured/ChatTool');
const E2BTools = require('./structured/E2BTools');
const CodeSherpa = require('./structured/CodeSherpa');
const StructuredSD = require('./structured/StableDiffusion');
const StructuredACS = require('./structured/AzureAISearch');
const CodeSherpaTools = require('./structured/CodeSherpaTools');
const GoogleSearchAPI = require('./structured/GoogleSearch');
const StructuredWolfram = require('./structured/Wolfram');
const TavilySearchResults = require('./structured/TavilySearchResults');
const TraversaalSearch = require('./structured/TraversaalSearch');

module.exports = {
  availableTools,
  // Basic Tools
  CodeBrew,
  AzureAiSearch,
  GoogleSearchAPI,
  WolframAlphaAPI,
  OpenAICreateImage,
  Database,
  N8nSave,
  N8nRun,
  N8nList,
  StableDiffusionAPI,
  SelfReflectionTool,
  // Structured Tools
  DALLE3,
  ChatTool,
  E2BTools,
  CodeSherpa,
  StructuredSD,
  StructuredACS,
  CodeSherpaTools,
  StructuredWolfram,
  TavilySearchResults,
  TraversaalSearch,
};
