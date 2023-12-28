import { Absence, BuildPlayer } from "../../types";
import { RosterProvider } from "../RosterProvider";

export abstract class BuildHelper {
  public static async parseGetPlayers() {
    const players: BuildPlayer[] = [];

    await RosterProvider.getPlayers().then((roster) =>{
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

  public static async parseAbsenceSend(absence: Absence) {
    await RosterProvider.sendAbsence(JSON.stringify(absence))
  }

  public static async parsePostAbsence(absence : Absence) {
    const data = {
      "content": "",
      "embeds": [{
        "description": "",
        "title": "Neue Abmeldung erhalten",
        "color": null,
        "fields": [
          {
            "name": "Charakter",
            "value": absence.name,
            "inline": false
          },
          {
            "name": "Ich werde am / ab nicht verfügbar sein",
            "value": new Date(absence.startDate).toLocaleString("de-de").split(",")[0],
            "inline": false
          },
          {
            "name": "bis",
            "value": new Date(absence.endDate).toLocaleString("de-de").split(",")[0],
            "inline": false
          },
          {
            "name": "Zusätzliche Informationen",
            "value": absence.reason,
            "inline": false
          }
        ]
      }]
    }
    await RosterProvider.postAbsence(JSON.stringify(data)).then((response) => {
    })
  }
}
