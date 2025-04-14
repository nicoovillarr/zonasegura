import prisma from "@/lib/prisma";

export async function GET() {
  const incidents = await prisma.incident.findMany({
    include: { neighbor: true },
  });

  const incidentCounts = incidents.reduce<Record<string, number>>(
    (acc, { neighbor: { gid } }) => {
      acc[gid] = (acc[gid] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalIncidents = incidents.length;

  const map = Object.fromEntries(
    Object.entries(incidentCounts).map(([gid, count]) => [
      gid,
      Number(((count / totalIncidents) * 100).toFixed(2)),
    ])
  );

  const cantidades = Object.entries(map).map(([_, cantidad]) => cantidad);
  const min = Math.min(...cantidades);
  const max = Math.max(...cantidades);

  const result = Object.entries(map)
    .map(([gid, qty]) => ({
      gid,
      intensity: max === min ? 0.5 : (qty - min) / (max - min),
    }))
    .reduce((acc: any, { gid, intensity }) => {
      acc[gid] = intensity;
      return acc;
    }, {});

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
