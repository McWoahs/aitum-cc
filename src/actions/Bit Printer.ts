import { ICCActionInputs, ICustomCode } from "aitum.js/lib/interfaces";
import {
  BooleanInput,
  FloatInput,
  IntInput,
  StringInput,
} from "aitum.js/lib/inputs";
import { AitumCC } from "aitum.js";
import { DeviceType } from "aitum.js/lib/enums";

// Methods needed for ini read/write
import { writeFileSync, readFileSync } from "fs";
import { exec } from "child_process";
const { parse, stringify } = require("ini");

/*********** CONFIG ***********/
// The custom code action name
const name: string = "Bit Printer";

// The custom code inputs
const inputs: ICCActionInputs = {
  userName: new StringInput("User Name", { required: false }),
  totalBits: new IntInput("Total Bits", { required: false }),
  lifetimeBits: new IntInput("Lifetime Bits", { required: false }),
  userMessage: new StringInput("User Message", { required: false }),
};

// The code executed
async function method(inputs: {
  [key: string]: number | string | boolean | string[];
}) {
  const lib = AitumCC.get().getAitumJS();

  const aitumDevice = (await lib.getDevices(DeviceType.AITUM))[0];

  /*********** INI FILE READ/WRITE START ***********/

  //bit printer ini file variables
  //(change these paths to the location of each file on your pc)

  //target Bit_Printer_Data_Template.ini <---
  const bitPrinterDataTemplate =
    "C:/Users/mcwoa/Documents/Aitum CC/aitum-cc-main/aitum-cc-main/Bit Printer/sub_printer_config/temp/Bit_Printer_Data_Template.ini";
  //target Bit_Printer_Data.ini <---
  const bitPrinterData =
    "C:/Users/mcwoa/Documents/Aitum CC/aitum-cc-main/aitum-cc-main/Bit Printer/sub_printer_config/temp/Bit_Printer_Data.ini";
  //target printbits.vbs <---
  const bitPrinterExec =
    '"C:/Users/mcwoa/Documents/Aitum CC/aitum-cc-main/aitum-cc-main/Bit Printer/sub_printer_config/bin/printbits.vbs"';

  //read ini template
  const config = parse(readFileSync(bitPrinterDataTemplate, "utf-8"));

  //populate sections on ini template with input variable
  config.message.value = inputs.userMessage;
  config.amount.value = inputs.totalBits;
  config.name.value = inputs.userName;
  config.total.value = inputs.lifetimeBits;

  //write new ini file
  writeFileSync(bitPrinterData, stringify(config));
  await lib.sleep(500);

  //call printer vbs file
  exec(bitPrinterExec);

  /*********** INI FILE READ/WRITE END ***********/
}

/*********** DON'T EDIT BELOW ***********/
export default { name, inputs, method } as ICustomCode;
