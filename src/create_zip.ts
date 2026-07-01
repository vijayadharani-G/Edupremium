import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function main() {
  const zip = new JSZip();
  const sourceDir = path.resolve('./elearning_xampp');
  const targetZipPath = path.resolve('./public/elearning_project.zip');

  // Ensure public directory exists
  const publicDir = path.dirname(targetZipPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  function addFilesRecursively(currentPath: string, zipFolder: JSZip) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const nextFolder = zipFolder.folder(item);
        if (nextFolder) {
          addFilesRecursively(fullPath, nextFolder);
        }
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  console.log(`Starting zip compression for: ${sourceDir}`);
  addFilesRecursively(sourceDir, zip);

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(targetZipPath, content);
  console.log(`Successfully compiled ZIP file at: ${targetZipPath}`);
}

main().catch(err => {
  console.error('Error zipping directory:', err);
});
