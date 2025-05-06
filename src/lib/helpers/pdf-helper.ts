import chromium from 'chrome-aws-lambda';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export interface PdfOptions {
  html: string;
  format?: 'letter' | 'legal' | 'tabloid' | 'ledger' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6';
  printBackground?: boolean;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
}

export default class PdfHelper {
    private static templatesDir = path.join(process.cwd(), 'templates');
    private static cache: Record<string, Handlebars.TemplateDelegate> = {};
  
    /**
     * Load and compile a Handlebars template by name (filename without extension)
     */
    private static loadTemplate(name: string): Handlebars.TemplateDelegate {
      if (this.cache[name]) {
        return this.cache[name];
      }
  
      const filePath = path.join(this.templatesDir, `${name}.html`);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found: ${filePath}`);
      }
  
      const source = fs.readFileSync(filePath, 'utf8');
      const template = Handlebars.compile(source);
      this.cache[name] = template;
      return template;
    }
  
    /**
     * Generate a PDF Buffer from a named template and data payload
     * @param templateName  Template filename (without .html)
     * @param data          Key/value map for template placeholders
     * @param options       PDF formatting options
     */
    public static async generate(templateName: string, data: any, options?: PdfOptions): Promise<Buffer> {
      // 1) Compile HTML
      const tpl = this.loadTemplate(templateName);
      const html = tpl(data);
  
      // 2) Launch headless Chrome (works in serverless via chrome-aws-lambda)
      const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
  
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
  
        // 3) Generate PDF
        const buffer = await page.pdf({
          format: options?.format || 'a4',
          printBackground: options?.printBackground ?? true,
          margin: options?.margin || { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        });
  
        return buffer;
      } finally {
        await browser.close();
      }
    }
  }