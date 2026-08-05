import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const allowedExtensions = new Set([".xlsx", ".xls", ".csv"]);
const maxFileSize = 10 * 1024 * 1024;

function makeSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ message: "Please select a file." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return Response.json({ message: "File size must be under 10 MB." }, { status: 400 });
    }

    const extension = extname(file.name).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return Response.json({ message: "Only .xlsx, .xls, and .csv files are supported." }, { status: 400 });
    }

    const uploadDirectory = join(process.cwd(), "uploads", "timesheets");
    await mkdir(uploadDirectory, { recursive: true });

    const storedFileName = `${Date.now()}-${makeSafeFileName(file.name)}`;
    const filePath = join(uploadDirectory, storedFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    return Response.json({
      message: "Upload successful.",
      originalFileName: file.name,
      storedFileName,
    });
  } catch {
    return Response.json({ message: "Upload failed." }, { status: 500 });
  }
}