import  { Server, Socket } from 'socket.io';
import { WebService } from './WebService';

// google "singleton"
export class WebsocketService {

  private static instance: WebsocketService;

  public static get(): WebsocketService {
    if (!WebsocketService.instance) WebsocketService.instance = new WebsocketService();
    return WebsocketService.instance;
  }

  private constructor() {
    // setup shit here
  
    this.io = new Server(WebService.get().getHttp(), { cors: { origin: "*" } });

    this.io.on('connection', this.onConnection);
  }
  
  private io?: Server;

  // On new websocket client connection
  private onConnection(socket: Socket) {
    console.log("Client has connected... " + socket.id);
 
    socket.on('pbwSavedColors', (data) =>{
 
      console.log('PBW UI loaded:', data);

      WebsocketService.get().broadcast('pbwSavedColors', data);
    })
   
    socket.on('radiusSlider', (data) =>{

      console.log('Radius slider position:', data);

      WebsocketService.get().broadcast('radiusSlider', data);
    })
   
    socket.on('widthSlider', (data) =>{

      console.log('Width slider position:', data);
     
      WebsocketService.get().broadcast('widthSlider', data);
    })  
 
    socket.on('textRadio', (data) =>{

      console.log('Text position:', data);
  
      WebsocketService.get().broadcast('textRadio', data);
      
    })   
 
    socket.on('rageToggle', (data) =>{

      console.log('Rage is toggled: ', data);
   
      WebsocketService.get().broadcast('rageToggle', data);
      
    })  

    socket.on('blurSlider', (data) =>{

      console.log('Outer glow blur value: ', data);
  
      WebsocketService.get().broadcast('blurSlider', data);
      
    })

    socket.on('spreadSlider', (data) =>{

      console.log('Outer glow spread value: ', data);
  
      WebsocketService.get().broadcast('spreadSlider', data);
      
    })

    socket.on('fontChange', (data) =>{

      console.log('New font selectiong: ', data);
  
      WebsocketService.get().broadcast('fontChange', data);
      
    })
  }



  public broadcast(messageType: string, data: any) {
    this.io?.emit(messageType, data);
  }

}