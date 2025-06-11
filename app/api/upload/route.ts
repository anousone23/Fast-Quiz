import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Add any validation logic here
        // For example, check file size, user authentication, etc.

        // Validate file type from pathname
        if (!pathname.toLowerCase().endsWith(".pdf")) {
          throw new Error("Only PDF files are allowed");
        }

        return {
          allowedContentTypes: ["application/pdf"],
          tokenPayload: JSON.stringify({
            // Add any additional metadata you want to store
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs after successful upload
        // You can add any post-upload logic here
        console.log("Upload completed:", blob.url);

        try {
          // Optional: You could store the blob URL in your database here
          // await storeBlobUrl(blob.url, tokenPayload);
        } catch (error) {
          console.error("Error in onUploadCompleted:", error);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
