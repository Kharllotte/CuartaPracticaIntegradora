import logger from "../../../utils/logger/index.js";
import { messageModel } from "../../models/mongodb/messages.js";

export default class Messages {
  constructor() {}

  save = async (obj) => {
    try {
      let result = await messageModel.create(obj);
      logger.info("Message saved");
      return result;
    } catch (err) {
      logger.error(err);
      logger.error("Failed saved message");
    }
  };

  getAll = async () => {
    const result = await messageModel.find().populate("user");
    logger.info("Messages get all successfull");
    return result;
  };
}
