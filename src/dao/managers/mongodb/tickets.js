import { TicketModel } from "../../models/mongodb/ticket.js";
import logger from "../../../utils/logger/index.js";

export default class TicketsManager {
  constructor() {}

  save = async (ticket) => {
    try {
      let result = await TicketModel.create(ticket);
      logger.info("Ticket saved");
      return result;
    } catch (error) {
      logger.error(error);
      logger.error("Failed ticket saved");
    }
  };

  getById = async (id) => {
    try {
      const product = await TicketModel.findOne({ _id: id });
      logger.info("Get Ticket");
      return product;
    } catch (err) {
      logger.error("Failed get Ticket");
      logger.error(err);
    }
  };

  getByCode = async (code) => {
    try {
      const product = await TicketModel.findOne({ code });
      logger.info("Get Ticket");
      return product;
    } catch (err) {
      logger.error("Failed get Ticket");
      logger.error(err);
    }
  };
}
