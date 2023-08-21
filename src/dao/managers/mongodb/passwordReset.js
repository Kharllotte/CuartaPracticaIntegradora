import logger from "../../../utils/logger/index.js";
import {PasswordResetModel} from "../../models/mongodb/passwordReset.js";

export default class PasswordReset {
  constructor() {}

  save = async (obj) => {
    try {
      let result = await PasswordResetModel.create(obj);
      logger.info("passwordReset saved");
      return result;
    } catch (err) {
      logger.error(err);
      logger.error("Failed saved passwordReset");
    }
  };

  findByUrl = async (url) => {
    try {
      const user = await PasswordResetModel.findOne({ url }).populate('userId');
      logger.info("Get passwordReset by url");
      return user;
    } catch (error) {
      logger.error("passwordReset url");
      logger.error(error);
    }
  };

  updateStatus = async (id, status) => {
    try {
      const pwr = await PasswordResetModel.findById(id);
      pwr.active = status;
      await pwr.save()
      logger.info("Update status");
      return pwr;
    } catch (error) {
      console.log(error);
      logger.error("Update status");
      logger.error(error);
    }
  };
}
