import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    'Missing required AWS credentials: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set'
  );
}

const awsConfig = {
  region: process.env.AWS_REGION ?? 'us-east-1',
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

export const CLAUDE_MODEL = process.env.BEDROCK_MODEL_ID;

export async function embedText(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
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
