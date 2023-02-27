// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const plugins:any = await prisma.plugin.findMany();
  for (const plugin of plugins) {
    const pluginCode = await prisma.pluginCode.findUnique({
      where: {
        id: plugin.pluginCodeId,
      },
    });
    const reviews = await prisma.pluginReview.findMany({
        where: {
            pluginId: plugin.id
        }
    })
    plugin.code = [pluginCode];
    plugin.reviews = reviews;
  }
  res.status(200).json(plugins);
}
