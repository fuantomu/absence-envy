import { BuildPlayer } from "../../types";

export abstract class RosterProvider {

  public static async getPlayers() : Promise<BuildPlayer[]>{
    return await fetch(`http://${process.env.REACT_APP_BASEURL}:8080/player/`, {method: "GET", mode:"cors",credentials:"include"}).then((response) => response.json()).then((roster) => {
      return roster
    })
  }

  public static async sendAbsence(absence: string){
    await fetch(`http://${process.env.REACT_APP_BASEURL}:8080/absence/`, {method: "POST", mode:"cors",credentials:"include", headers: {"Content-Type": "application/json"}, body: absence}).then((response) =>{
      console.log(response)
    })
  }
}
