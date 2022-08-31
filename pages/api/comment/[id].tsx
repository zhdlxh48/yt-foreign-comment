// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { findForeignComments, ForeignComment } from "../../../utils/language";
import { Comment, getAllComments } from "../../../utils/youtube";

type Data = {
  message?: string;
  comments: ForeignComment[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query);
  let id = req.query.id as string;
  if (typeof id !== "string") {
    console.log("not string");
    id = id[0];
  }
  let order = req.query.order as "relevance" | "time";
  if (typeof order !== "string") {
    console.log("not string");
    order = order[0];
  }
  let detect = req.query.detect as string;
  if (typeof detect !== "string") {
    console.log("not string");
    detect = detect[0];
  }
  let detectPer = parseInt(detect);
  console.log({ id, order, detectPer });

  let fcmts: ForeignComment[] = [];
  try {
    const cmts = await getAllComments(id, order, 500);
    fcmts = await findForeignComments(cmts, detectPer);
    res
      .status(200)
      .json({ message: "Successfully find comments", comments: fcmts });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, comments: [] });
  }
}
