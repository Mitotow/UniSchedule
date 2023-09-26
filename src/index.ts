import App from "./providers/App";

// Controllers
import ControllerPing from "./controllers/ControllerPing";
import ControllerGroups from "./controllers/ControllerGroups";

/* Add controllers*/
App.addController(new ControllerPing); // Add test controller
App.addController(new ControllerGroups); // Add groups controller