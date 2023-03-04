// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = JSON.parse(req.body);
  const user = await prisma.user.findUnique({
    where: {
      email: body.userEmail,
    },
  });
  const createdWallet = await prisma.smartWallet.create({
    data: {
      address: body.address.toLowerCase(),
      deployed: false,
      userId: user?.id,
    },
  });
  body.plugins.forEach(async (plugin: any) => {
    await prisma.implementedPlugin.create({
      data: {
        Plugin: { connect: { id: parseInt(plugin.pluginId) } },
        config: plugin.config ? JSON.stringify(plugin.config) : {},
        SmartWallet: { connect: { address: body.address.toLowerCase() } },
      },
    });
  });
  res.status(200).json(createdWallet);
}
