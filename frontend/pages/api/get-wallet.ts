// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { address } = req.query;
  let lowerCaseAddress = address as string;
  lowerCaseAddress = lowerCaseAddress.toLowerCase();
  if (!address) {
    res.status(400).json({ error: "No address provided" });
    return;
  }
  const wallet = await prisma.smartWallet.findUnique({
    where: {
        address: lowerCaseAddress,
    },
  });
  if (!wallet) {
    res.status(404).json({ error: "Wallet not found" });
    return;
  }
  const plugins = await prisma.implementedPlugin.findMany({
    where: {
      smartWalletAddress: lowerCaseAddress,
    },
  })
  res.status(200).json({wallet, plugins});
}
