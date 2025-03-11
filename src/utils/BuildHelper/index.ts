import { Absence, BuildPlayer } from "../../types";
import { RosterProvider } from "../RosterProvider";

export abstract class BuildHelper {
  public static async parseGetPlayers() {
    const players: BuildPlayer[] = [];

    await RosterProvider.getPlayers().then((roster) => {
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
            main: player.main ?? "",
            alt: player.alt ?? "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
    return players;
  }

  public static async parseAbsenceSend(absence: Absence) {
    await RosterProvider.sendAbsence(JSON.stringify({ absence: absence }));
  }

  public static async parsePostAbsence(absence: Absence, name: string) {
    const data = {
      content: "",
      embeds: [
        {
          description: "",
          title: `Neue Abwesenheit von ${name} erhalten`,
          color: null,
          fields: [
            {
              name: "Charakter",
              value: name,
              inline: false,
            },
            {
              name: "Ich werde am / ab nicht verfügbar sein",
              value: new Date(absence.start_date)
                .toLocaleString("de-de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split(",")[0],
              inline: false,
            },
            {
              name: "bis",
              value: new Date(absence.end_date)
                .toLocaleString("de-de", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split(",")[0],
              inline: false,
            },
            {
              name: "Zusätzliche Informationen",
              value: absence.reason,
              inline: false,
            },
          ],
        },
      ],
    };
    await RosterProvider.postAbsence(JSON.stringify(data)).then((response) => {});
  }
}
