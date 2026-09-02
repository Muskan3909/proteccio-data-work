import {NextFunction} from "express";
import sharp from "sharp";

import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";
import {ServerResponse} from "../models/server-response";

export default async function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction) {
  if (!req.body.file) return next();
  try {
    const buffer = Buffer.from(req.body.file.replace(/^data:(.*?);base64,/, ""), "base64");
    const out = await sharp(buffer)
      .webp({quality: 50})
      .toBuffer();

    req.body.type = "webp";
    req.body.buffer = out;

    return next();
  } catch (error) {
    return res.status(200).send(new ServerResponse(false, null, "Upload failed"));
  }
}
