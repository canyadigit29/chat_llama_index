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
  console.log("[Engine] getDataSource called with params:", params);
  
  checkEnvVars();
  
  // Create parameters with hardcoded values to ensure we use the correct index
  const cloudParams = createParams(params);
  console.log("[Engine] Created LlamaCloud params:", {
    ...cloudParams,
    apiKey: "REDACTED"
  });
  
  if (params.ensureIndex) {
    // ensure that the index exists
    try {
      console.log("[Engine] Ensuring index exists...");
      await LlamaCloudIndex.fromDocuments({
        ...cloudParams,
        documents: [],
      });
    } catch (e) {
      console.log("[Engine] Error ensuring index:", e);
      if ((e as any).status === 400) {
        // ignore 400 error, it's caused by calling fromDocuments with empty documents
        // TODO: fix in LLamaIndexTS
        console.log("[Engine] Ignoring 400 error from fromDocuments");
      } else {
        throw e;
      }
    }
  }
  
  console.log("[Engine] Creating new LlamaCloudIndex...");
  try {
    const index = new LlamaCloudIndex(cloudParams);
    console.log("[Engine] LlamaCloudIndex created successfully");
    return index;
  } catch (error) {
    console.error("[Engine] Error creating LlamaCloudIndex:", error);
    throw error;
  }
}

function createParams({
  project,
  pipeline,
}: LlamaCloudDataSourceParams): CloudConstructorParams {
  if (!pipeline) {
    throw new Error("Set pipeline in the params.");
  }
  
  // CRITICAL FIX: Using exact parameter structure as needed by the LlamaCloudIndex constructor
  // This matches the Python example you shared
  const params = {
    name: "MaxGPT", // Hardcoded to match your LlamaCloud index name exactly
    projectName: "Default", 
    organizationId: "1d723a68-105e-42a6-8168-059e44f0383b",
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
