import { BuildPlayer } from "../../types";

export abstract class RosterProvider {

  public static async getPlayers() : Promise<BuildPlayer[]>{
    return await fetch(`${process.env.REACT_APP_API}/player/`, {method: "GET", mode:"cors",credentials:"include"}).then((response) => response.json()).then((roster) => {
      return roster
    })
  }

  public static async sendAbsence(absence: string){
    await fetch(`${process.env.REACT_APP_API}/absence/`, {method: "POST", mode:"cors",credentials:"include", headers: {"Content-Type": "application/json"}, body: absence}).then((response) =>{
      console.log(response)
    })
  }

  public static async postAbsence(build: string) : Promise<Response>{
    return await fetch(`${process.env.REACT_APP_DISCORD_WEBHOOK}`, {method: "POST", mode:"cors",credentials:"include", headers: {"Content-Type": "application/json"}, body: build}).then((response) => {return response})
  }
}
