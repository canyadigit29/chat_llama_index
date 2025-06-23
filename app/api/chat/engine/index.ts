import { LlamaCloudIndex } from "llamaindex/cloud/LlamaCloudIndex";
import type { CloudConstructorParams } from "llamaindex/cloud/constants";

export type LlamaCloudDataSourceParams = {
  project?: string;
  pipeline?: string;
  ensureIndex?: boolean;
};

export function parseDataSource(
  datasource: string,
): LlamaCloudDataSourceParams {
  try {
    return JSON.parse(datasource) as LlamaCloudDataSourceParams;
  } catch (e) {
    return {};
  }
}

export async function getDataSource(params: LlamaCloudDataSourceParams) {
  checkEnvVars();
  if (params.ensureIndex) {
    // ensure that the index exists
    try {
      await LlamaCloudIndex.fromDocuments({
        ...createParams(params),
        documents: [],
      });
    } catch (e) {
      if ((e as any).status === 400) {
        // ignore 400 error, it's caused by calling fromDocuments with empty documents
        // TODO: fix in LLamaIndexTS
      } else {
        throw e;
      }
    }
  }
  return new LlamaCloudIndex(createParams(params));
}

function createParams({
  project,
  pipeline,
}: LlamaCloudDataSourceParams): CloudConstructorParams {
  if (!pipeline) {
    throw new Error("Set pipeline in the params.");
  }
  
  // Hardcoded values from LlamaCloud dashboard
  const params = {
    organizationId: "1d723a68-105e-42a6-8168-059e44f0383b",
    name: pipeline,
    // Using "Default" project name as shown in screenshot
    projectName: "Default",
    apiKey: "llx-sbeDUf38rw5C2b3Xmu4JXceWGwqAa5NDtyWN0eMqQX2uffQZ",
    baseUrl: "https://api.cloud.llamaindex.ai",
  };
  
  console.log("Using LlamaCloud params:", {
    ...params,
    apiKey: "REDACTED",
    pipeline,
  });
  
  return params;
}

function checkEnvVars() {
  // Skip environment variable check since we're hardcoding values
  console.log("Skipping environment variable check - using hardcoded credentials");
  return;
}
