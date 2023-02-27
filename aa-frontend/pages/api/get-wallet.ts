// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { address } = req.query;
  if (!address) {
    res.status(400).json({ error: "No address provided" });
    return;
  }
  const wallet = await prisma.smartWallet.findUnique({
    where: {
        address: address as string,
    },
  });
  res.status(200).json(wallet);
}
