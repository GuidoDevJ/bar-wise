import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.BEDROCK_MODEL_ID ||
  !process.env.BEDROCK_EMBED_MODEL_ID
) {
  throw new Error(
    'Missing required env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, BEDROCK_MODEL_ID, BEDROCK_EMBED_MODEL_ID'
  );
}

const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

export const bedrockRuntime = new BedrockRuntimeClient(awsConfig);

export const claude = new AnthropicBedrock({
  awsAccessKey: awsConfig.credentials.accessKeyId,
  awsSecretKey: awsConfig.credentials.secretAccessKey,
  awsRegion: awsConfig.region,
});

export const CLAUDE_MODEL = process.env.BEDROCK_MODEL_ID!;

export async function embedText(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_EMBED_MODEL_ID!,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: text,
      dimensions: 1024,
      normalize: true,
    }),
  });
  const res = await bedrockRuntime.send(command);
  const body = JSON.parse(new TextDecoder().decode(res.body));
  return body.embedding as number[];
}
