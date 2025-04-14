import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "fs";
import path from "path";

type BarrioProperties = {
  GID: number;
  NROBARRIO: number;
  BARRIO: string;
  CODBA: string;
};

const prisma = new PrismaClient();

const main = async () => {
  const filePath = path.join(__dirname, "../public/barrios.geojson");
  // Check if the file exists
  if (!existsSync(filePath)) {
    console.error("El archivo no existe:", filePath);
    process.exit(1);
  }

  const fileContents = readFileSync(filePath);

  // Check if the file is empty
  if (fileContents.length === 0) {
    console.error("File is empty");
    return;
  }

  // Parse the GeoJSON file
  let data;
  try {
    data = JSON.parse(fileContents.toString());
  } catch (error) {
    console.error("Error parsing GeoJSON file:", error);
    return;
  }

  const barrios: BarrioProperties[] = data.features.map(
    (feature: any) => feature.properties
  );

  console.log(`Adding ${barrios.length} neighbors...`);

  await prisma.neighbor.createMany({
    data: barrios.map((barrio) => ({
      gid: barrio.GID,
      nro: barrio.NROBARRIO,
      name: barrio.BARRIO,
      codba: barrio.CODBA,
    })),
  });

  console.log("Barrios seeded successfully!");

  const availableTypes = [
    "robo", "hurto", "vandalismo", "agresion", "homicidio", "secuestro",
    "extorsion", "estafa", "acoso", "amenaza", "otros",
  ];

  const availableSources = [
    "ElPais", "ElObservador", "Subrayado", "Teledoce", "MontevideoPortal",
    "LaDiaria", "ElEspectador", "RadioUniversal", "RadioSarandi", "RadioCero",
  ];

  const incidents = [];

  for (let i = 0; i < 2000; i++) {
    const randomNeighbor = Math.floor(Math.random() * barrios.length);
    const randomType = Math.floor(Math.random() * availableTypes.length);
    const randomDate = new Date(Date.now() - Math.random() * 10000000000).toISOString();
    const randomSource = Math.floor(Math.random() * availableSources.length);

    incidents.push(prisma.incident.create({
      data: {
        type: availableTypes[randomType],
        date: randomDate,
        address: "-",
        createdAt: new Date(),
        source: availableSources[randomSource],
        neighborId: barrios[randomNeighbor].GID,
      },
    }));
  }

  await prisma.$transaction(incidents);

  console.log("Incidents seeded successfully!");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
