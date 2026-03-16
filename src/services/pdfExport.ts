import jsPDF from 'jspdf';
import Konva from 'konva';

export async function exportToPdf(
  stageRef: React.RefObject<Konva.Stage | null>,
  title: string
): Promise<void> {
  const stage = stageRef.current;
  if (!stage) return;

  // Hide transformer before export
  const transformers = stage.find('Transformer');
  transformers.forEach((t) => t.visible(false));
  stage.batchDraw();

  const pixelRatio = 2;
  const dataUrl = stage.toDataURL({ pixelRatio });

  // Restore transformers
  transformers.forEach((t) => t.visible(true));
  stage.batchDraw();

  const stageWidth = stage.width();
  const stageHeight = stage.height();

  // Determine orientation
  const landscape = stageWidth > stageHeight;
  const pdf = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Title
  pdf.setFontSize(16);
  pdf.text(title, pageWidth / 2, 30, { align: 'center' });

  // Fit canvas image into page with margin
  const margin = 40;
  const availW = pageWidth - margin * 2;
  const availH = pageHeight - 60 - margin;
  const scale = Math.min(availW / stageWidth, availH / stageHeight);
  const imgW = stageWidth * scale;
  const imgH = stageHeight * scale;
  const imgX = (pageWidth - imgW) / 2;
  const imgY = 50;

  pdf.addImage(dataUrl, 'PNG', imgX, imgY, imgW, imgH);
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
}
