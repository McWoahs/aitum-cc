import { ICCActionInputs, ICustomCode } from "aitum.js/lib/interfaces";
import { AitumCC } from "aitum.js";
import { DeviceType } from "aitum.js/lib/enums";
import axios from "axios";
import { BooleanInput, StringInput } from "aitum.js/lib/inputs";

/*********** CONFIG ***********/
// The custom code action name
const name: string = "Hue State";

// The custom code inputs
const inputs: ICCActionInputs = {
  state: new BooleanInput("On?", { required: true }),
};

// The code executed.
async function method(inputs: {
  [key: string]: number | string | boolean | string[];
}) {
  const { state } = inputs;
  const lib = AitumCC.get().getAitumJS();

  const aitumDevice = (await lib.getDevices(DeviceType.AITUM))[0];

  const hueState = {
    on: state,
  };
  console.log("sending:", JSON.stringify(hueState));
  const response = axios.put(
    `http://${process.env.HUE_IP}/api/${process.env.HUE_USERNAME}/groups/2/action`,
    hueState
  );
  response.then((resp: any) => console.log("hue resp: ", resp));
}

/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;
