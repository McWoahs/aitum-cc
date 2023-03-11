import express, { Application, Request, Response } from "express";
import { createServer, Server } from "http";
import { readFileSync, writeFileSync, writeFile } from "fs";

const data = readFileSync("src/db/pbwDB.json");
const pbwDB = JSON.parse(data.toString());

const cjData = readFileSync("src/db/colorjoe.json");
const colorjoe = JSON.parse(cjData.toString()) || {}; // initialize empty object if file is empty

// google "singleton"
export class WebService {
  private static instance: WebService;

  public static get(): WebService {
    if (!WebService.instance) WebService.instance = new WebService();
    return WebService.instance;
  }

  private constructor() {
    // setup shit here
    this.app = express();
    this.http = createServer(this.app);

    this.http.listen(3000, "0.0.0.0", this.onListen);

    // set up fancy express stuff, like static hosting
    this.app.set("view engine", "ejs");

    this.app.use(express.static("public"));
    this.app.use(express.json());

    this.app.get("/", this.indexPBW);

    this.app.get("/src/services", this.webSock);

    this.app.get("/pbwui", this.indexUI);

    this.app.get("/cjdb", this.cjDB);
    this.app.post("/cjdb", this.handleCjDBPost);

    this.app.get("/data", this.dataBase);
  }

  private app?: Application;
  private http?: Server;

  private onListen() {
    console.log("Server running...");
  }

  public getHttp() {
    return this.http;
  }

  private webSock(req: Request, res: Response) {
    res.send("hi")
  }

  private indexPBW(req: Request, res: Response) {
    res.render("progress");
  }

  private indexUI(req: Request, res: Response) {
    res.render("pbwUI");
  }

  private dataBase(req: Request, res: Response) {
    res.json(pbwDB);
  }

  private cjDB(req: Request, res: Response) {
    res.json(colorjoe);
  }

  private handleCjDBPost(req: Request, res: Response) {
    // Extract the color data from the request body
    const colorData = req.body;

    // Update the colorjoe object with new data
    Object.keys(colorData).forEach((key) => {
      colorjoe[key] = colorData[key];
    });

    // Write the updated colorjoe object to the JSON file
    try {
      writeFileSync("src/db/colorjoe.json", JSON.stringify(colorjoe));
      // Send a response back to the client to confirm success
      res.status(200).send("Color saved successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving color to database");
    }
  }
}
