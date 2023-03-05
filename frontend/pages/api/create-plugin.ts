// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = JSON.parse(req.body);
//   try {
    const chains: any = [];
    for (const chainId of body.chains) {
      const chain = await prisma.chain.findUnique({
        where: {
          id: chainId,
        },
      });
      chains.push({id: chainId});
    }
    const code = await prisma.pluginCode.create({
      data: {
        name: body.codeName,
        url: body.codeUrl,
        version: body.codeVersion,
        content: body.codeContent,
      },
    });
    const plugin = await prisma.plugin.create({
      data: {
        name: body.name,
        description: body.description,
        oneLiner: body.oneLiner,
        version: body.version,
        icon: body.icon,
        creator: "abstractooor.eth",
        rating: 0,
        ratingAmount: 0,
        audits: 0,
        usage: 0,
        chains: {connect: chains},
        contractAddress: body.contractAddress,
        tippingAddress: body.tippingAddress,
        pluginCategoryId: parseInt(body.pluginCategoryId),
        pluginCodeId: code.id,
      },
    });
    console.log(plugin);
    res.status(200).json(plugin);
//   } catch (e) {
//     console.log(e);
//     res.status(500);
//   }
//   res.status(500);
}
