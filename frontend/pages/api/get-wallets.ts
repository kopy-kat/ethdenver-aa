// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { email } = req.query;
  if (!email) {
    res.status(400).json({ error: "No email provided" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });
  const wallets: any = await prisma.smartWallet.findMany({
    include: {
      chains: true,
    },
    where: {
      userId: user?.id,
    },
  });
  res.status(200).json(wallets);
}
