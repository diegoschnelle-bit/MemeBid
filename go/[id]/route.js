import { NextResponse } from "next/server";
import { getProject, incrementClicks } from "@/lib/store";

export async function GET(req, { params }) {
  const project = await getProject(params.id);

  if (!project || !project.projectUrl) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Fire-and-forget — don't make the visitor wait on the click count.
  incrementClicks(params.id).catch(() => {});

  return NextResponse.redirect(project.projectUrl);
}
