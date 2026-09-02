import { NextFunction } from "express";

import { IProteccioRequest } from "../../interfaces/Proteccio-request";
import { IProteccioResponse } from "../../interfaces/Proteccio-response";
import { ServerResponse } from "../../models/server-response";

export default function (req: IProteccioRequest, res: IProteccioResponse, next: NextFunction): IProteccioResponse | void {
  const chatId = req.params.chatId;
  
  if (!chatId) {
    return res.status(400).send(new ServerResponse(false, null, "Chat ID parameter is required"));
  }

  // Pattern: UUID v4 format (8-4-4-4-12 hex chars) followed by dash and ISO date (YYYY-MM-DD)
  // Format: clientUuid-YYYY-MM-DD
  const chatIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-\d{4}-\d{2}-\d{2}$/i;
  
  if (!chatIdPattern.test(chatId)) {
    return res.status(400).send(new ServerResponse(false, null, "Invalid chat ID format"));
  }
  
  return next();
}

