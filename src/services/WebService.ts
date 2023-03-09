import express, { Application, Request, Response } from 'express';
import { createServer, Server } from 'http';
import { readFileSync } from 'fs';

const data = readFileSync('src/db/pbwDB.json')
const pbwDB = JSON.parse(data.toString());

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

    this.http.listen(3000, '0.0.0.0', this.onListen);
    
    // set up fancy express stuff, like static hosting
    this.app.set("view engine", "ejs");

    this.app.use(express.static('public'));

    this.app.get("/", this.indexPBW);

    this.app.get("/pbwui", this.indexUI);
    
    this.app.get('/data', this.dataBase);

  }

  private app?: Application;
  private http?: Server;

  private onListen() {
    console.log('Server running...');
  }

  public getHttp() {
    return this.http;
  }

  private indexPBW(req: Request, res: Response) {
    res.render("progress");
  } 

  private indexUI(req: Request, res: Response) {
    res.render("pbwUI");
  }

 
  private dataBase(req: Request, res: Response){
    res.json(pbwDB);
  }
}