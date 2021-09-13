import { downloadFile } from "../../../helpers/Export";
import execCPAction from "../../../services/execCPAction";
import removeCP from "../../../services/removeCP";

export class CPActionHandler {
  constructor(
    action,
    needsConfirmation = false,
    confirmationMsg = "Please confirm this action"
  ) {
    this.action = action;
    this.needsConfirmation = needsConfirmation;
    this.confirmationMsg = confirmationMsg;
  }

  async execute(configurationProfileId) {
    return await execCPAction(configurationProfileId, `${this.action}!`);
  }

  handleResponse(response, context) {}
}

export class Activate extends CPActionHandler {
  constructor() {
    super("activate", false);
  }

  handleResponse(response, context) {
    context.reloadCP(response);
  }
}

export class Complete extends CPActionHandler {
  constructor() {
    super(
      "complete",
      true,
      "If you mark this Configuration Profile as 'completed', we will evaluate the information provided and generate all the \
       necessary data in this DESM instance. This task includes the creation of the DSO's, agents and schemas. Please confirm \
       to begin the process."
    );
  }
}

export class Deactivate extends CPActionHandler {
  constructor() {
    super(
      "deactivate",
      true,
      "By deactivating this Configuration Profile, it will not be available to use in this DESM instance. This means that the \
      agents belonging to it will not be able to begin or continue mapping. Please confirm."
    );
  }

  handleResponse(response, context) {
    context.reloadCP(response);
  }
}

export class Export extends CPActionHandler {
  constructor() {
    super("export", false);
  }

  handleResponse(response, context) {
    downloadFile(
      response.structure,
      `configuration-profile-${new Date().toISOString()}.json`
    );
  }
}

export class Remove extends CPActionHandler {
  constructor() {
    super(
      "remove",
      true,
      "Attention! Removing this Configuration Profile implies permanently loosing all the data in it. This includes the mapping, \
       DSO's and agents involved, and even the metadata. Make sure you export the metadata first. Please confirm."
    );
  }

  async execute(configurationProfileId) {
    return await removeCP(configurationProfileId);
  }

  handleResponse(response, context) {
    context.handleRemoveResponse(response.success);
  }
}

export class CPActionHandlerFactory {
  constructor(action) {
    if (!action) throw "No action provided";
    this.action = action;
  }

  get() {
    switch (this.action) {
      case "activate":
        return new Activate();
      case "complete":
        return new Complete();
      case "deactivate":
        return new Deactivate();
      case "export":
        return new Export();
      case "remove":
        return new Remove();
    }
  }
}
