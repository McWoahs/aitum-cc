import { ICCActionInputs, ICustomCode } from "aitum.js/lib/interfaces";
import { AitumCC } from "aitum.js";
import { DeviceType } from "aitum.js/lib/enums";
import axios from "axios";
import { StringInput, StringListInput } from "aitum.js/lib/inputs";
import { multiStateThemes, singleStateThemes } from "../types/HueTypes";

/*********** CONFIG ***********/
// The custom code action name
const name: string = "Hue Set Theme";

// The custom code inputs
const inputs: ICCActionInputs = {
  theme: new StringInput("Theme", { required: true }),
};

// The code executed.
async function method(inputs: { theme: string }) {
  const { theme } = inputs;
  const lib = AitumCC.get().getAitumJS();
  const aitumDevice = (await lib.getDevices(DeviceType.AITUM))[0];

  const lightIds = ["18", "16", "17", "12"]; // change this

  const responses = lightIds.map((lightId) => {
    let state;
    const normalizedTheme = theme.toLowerCase().split(" ").join("");
    if (Object.keys(multiStateThemes).indexOf(normalizedTheme) !== -1) {
      state = multiStateThemes[normalizedTheme][lightId];
      return axios.put(
        `http://${process.env.HUE_IP}/api/${process.env.HUE_USERNAME}/lights/${lightId}/state`,
        state
      );
    } else if (Object.keys(singleStateThemes).indexOf(normalizedTheme) !== -1) {
      // could do this using groups/x/action payload -
      // but I kind of like the effect of each light changing separately
      state = singleStateThemes[normalizedTheme];
      return axios.put(
        `http://${process.env.HUE_IP}/api/${process.env.HUE_USERNAME}/groups/2/action`,
        state
      );
    }
  });

  Promise.all(responses).then((resp) => console.log("hue responses:", resp));
}

/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;
