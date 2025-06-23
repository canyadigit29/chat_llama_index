import { NextRequest, NextResponse } from "next/server";
import { uploadDocument } from "@/cl/app/api/chat/llamaindex/documents/upload";
import { getDataSource, parseDataSource } from "../engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Custom upload API to use datasource from request body
export async function POST(request: NextRequest) {
  try {
    console.log("[Upload API] Processing upload request...");
    
    const {
      filename,
      base64,
      datasource,
    }: { filename: string; base64: string; datasource: string } =
      await request.json();
      
    console.log(`[Upload API] Received request to upload file '${filename}' with datasource: ${datasource}`);
    
    if (!base64 || !datasource) {
      console.error("[Upload API] Missing base64 or datasource in request");
      return NextResponse.json(
        { error: "base64 and datasource is required in the request body" },
        { status: 400 },
      );
    }
    
    console.log("[Upload API] Getting data source...");
    const parsedDataSource = parseDataSource(datasource);
    console.log("[Upload API] Parsed datasource:", parsedDataSource);
    
    const index = await getDataSource(parsedDataSource);
    console.log("[Upload API] Got index instance");
    
    if (!index) {
      console.error("[Upload API] Index is null or undefined");
      throw new Error(
        `StorageContext is empty - call 'pnpm run generate ${datasource}' to generate the storage first`,
      );
    }
    
    console.log("[Upload API] Uploading document to LlamaCloud...");
    const result = await uploadDocument(index, filename, base64);
    console.log("[Upload API] Upload successful:", result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Upload API] Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name,
    });
    
    return NextResponse.json(
      { 
        error: `${(error as Error).message}`,
        hint: "Using hardcoded MaxGPT index in Default project. Check if this matches your LlamaCloud setup."
      },
      { status: 500 },
    );
  }
}
