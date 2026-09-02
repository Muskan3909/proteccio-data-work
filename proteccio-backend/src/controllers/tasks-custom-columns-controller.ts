import {IProteccioRequest} from "../interfaces/Proteccio-request";
import {IProteccioResponse} from "../interfaces/Proteccio-response";
import {ServerResponse} from "../models/server-response";
import ProteccioControllerBase from "./Proteccio-controller-base";
import HandleExceptions from "../decorators/handle-exceptions";

export default class TasksCustomColumnsController extends ProteccioControllerBase {

  // Columns

  @HandleExceptions()
  public static async create(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async get(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async update(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async delete(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  // Options

  @HandleExceptions()
  public static async createOption(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async getOption(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async updateOption(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }

  @HandleExceptions()
  public static async deleteOption(req: IProteccioRequest, res: IProteccioResponse): Promise<IProteccioResponse> {
    return res.status(200).send(new ServerResponse(true, []));
  }
}
