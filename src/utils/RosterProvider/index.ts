import { BuildPlayer } from "../../types";

export abstract class RosterProvider {

  public static async getRosterRaidPlayers(connectionString: string) : Promise<BuildPlayer[]>{
    return await fetch(`http://${process.env.REACT_APP_BASEURL}:8080/build/sql/import`, {method: "POST", mode:"cors",credentials:"include", headers: {"Content-Type": "application/json"}, body: connectionString}).then((response) => response.json()).then((roster) => {
      return roster.players
    })
  }

  public static async sendAbsence(connectionString: string) : Promise<BuildPlayer[]>{
    return await fetch(`http://${process.env.REACT_APP_BASEURL}:8080/build/sql/absence/save`, {method: "POST", mode:"cors",credentials:"include", headers: {"Content-Type": "application/json"}, body: connectionString}).then((response) => response.json()).then((roster) => {
      return roster
    })
  }
}
