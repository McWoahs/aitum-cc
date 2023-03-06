import { AitumCC } from 'aitum.js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import  express  from 'express';
import  { Server } from 'socket.io';

import { WebService } from './services/WebService';
import { WebsocketService } from './services/WebsocketService';

// *************experiment*************

// const io = new Server(server, { cors: { origin: "*" } });

WebService.get();
WebsocketService.get();

// io.on("connection", (socket) => {
//     console.log("Temp Connection With Action: " + socket.id)
// })

// *************experiment*************




/*******************************************
 *                WARNING                  *
 *   DO NOT EDIT THIS FILE AS IT CONTAINS  *
 *  CODE TO LOAD YOUR CUSTOM CODE ACTIONS  *
 *******************************************/

dotenv.config({ path: resolve(__dirname, '..', 'settings.env') });

const lib = AitumCC.get();

(async () => {
  // Set up the environment
  lib.setEnv(
    process.env.AITUM_CC_ID as string, 
    process.env.AITUM_CC_HOST as string, 
    process.env.API_KEY as string);

  // Register actions
  // Loop over potential files
  const potentialFiles = readdirSync(resolve(__dirname, 'actions')).filter(f => f.endsWith('.ts'));

  for (const pf of potentialFiles) {
    const { default: obj } = await import(resolve(__dirname, 'actions', pf));

    for (const param of ['name', 'inputs', 'method']) {
      if (!obj.hasOwnProperty(param)) {
        console.log(`Skipped loading of ${pf} as it was missing required property ${param}.`);
        continue;
      }
    }

    lib.registerAction(obj);
  }

  // Connect after a second
  setTimeout(async () => await lib.connect(), 1e3);
})();
