import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker via webpack asset URL (compatible with Next.js webpack builds)
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const pageTexts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item): item is pdfjsLib.TextItem => "str" in item)
      .map((item) => item.str)
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
}
