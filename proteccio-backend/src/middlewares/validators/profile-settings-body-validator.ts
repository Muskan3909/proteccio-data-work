import { NextFunction } from "express";

import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { ServerResponse } from "../../models/server-response";
import { sanitizePlainText } from "../../shared/utils";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const { name } = req.body;
  if (!name || name.trim() === "")
    return res.status(200).send(new ServerResponse(false, null, "Name is required"));

  // Sanitize the name to prevent HTML injection
  req.body.name = sanitizePlainText(name);

  // Ensure name is not empty after sanitization
  if (!req.body.name || req.body.name.trim().length === 0) {
    return res.status(400).send(new ServerResponse(false, null, "Name cannot be empty or contain only HTML tags"));
  }

  return next();
}
