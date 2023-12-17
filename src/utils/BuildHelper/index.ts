import { BuildPlayer, ConnectionString } from "../../types";
import { RosterProvider } from "../RosterProvider";

export abstract class BuildHelper {
  public static async parseSqlImport(connectionString: ConnectionString) {
    const players: BuildPlayer[] = [];
    connectionString.table = process.env.REACT_APP_SQL_TABLE

    await RosterProvider.getRosterRaidPlayers(JSON.stringify(connectionString)).then((roster) =>{
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

  public static async parseAbsenceSend(connectionString: ConnectionString, name: string, startDate: number, endDate: number, reason: string) {
    connectionString.table = "AbsenceEntity"
    connectionString.name = name
    connectionString.startDate = startDate
    connectionString.endDate = endDate
    connectionString.reason = reason

    await RosterProvider.sendAbsence(JSON.stringify(connectionString))
  }
}
