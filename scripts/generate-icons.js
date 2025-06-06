import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const inputSvg = await fs.readFile(
    join(__dirname, "../public/favicon.svg"),
    "utf8"
  );
  const outputDir = join(__dirname, "../public/icons");

  try {
    await fs.mkdir(outputDir, { recursive: true });

    for (const size of sizes) {
      const svgContent = inputSvg
        .replace('width="24"', `width="${size}"`)
        .replace('height="24"', `height="${size}"`)
        .replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24"`);

      await fs.writeFile(
        join(outputDir, `icon-${size}.svg`),
        svgContent,
        "utf8"
      );

      console.log(`Gerado ícone SVG ${size}x${size}`);
    }

    // Gerar apple-touch-icon como SVG
    const iconPath = inputSvg.match(/<path.*?\/>/)?.[0] || "";
    const appleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24">
      <defs>
        <clipPath id="shape">
          <rect width="24" height="24" rx="5"/>
        </clipPath>
      </defs>
      <rect width="24" height="24" fill="#1976d2"/>
      <g clip-path="url(#shape)">
        <path fill="#ffffff" ${iconPath.split(" ").slice(1).join(" ")}
      </g>
    </svg>`;

    await fs.writeFile(
      join(__dirname, "../public/apple-touch-icon.svg"),
      appleIconSvg,
      "utf8"
    );

    console.log("Apple touch icon SVG gerado com sucesso");
  } catch (error) {
    console.error("Erro ao gerar ícones:", error);
    process.exit(1);
  }
}

generateIcons();
