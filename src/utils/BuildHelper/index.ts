import { BuildPlayer } from "../../types";
import { RosterProvider } from "../RosterProvider";

export abstract class BuildHelper {
  public static async parseSqlImport() {
    const players: BuildPlayer[] = [];

    await RosterProvider.getRosterRaidPlayers().then((roster) =>{
      try {
        for (const player of roster) {
          players.push({
            id: player.id,
            name: player.name,
            class: player.class,
            spec: player.spec,
            race: player.race,
            status: "absence",
            raid: -1,
            group: "roster",
            realm: undefined,
            oldName: player.name,
            main: player.main?? ""
        })}
      } catch (error) {
        console.log(error)
      }

    });
    return players;
  }

  public static async parseAbsenceSend(name: string, startDate: number, endDate: number, reason: string) {
    const absence = { absence:{
      name,
      startDate,
      endDate,
      reason
    }
    }

    await RosterProvider.sendAbsence(JSON.stringify(absence))
  }
}
