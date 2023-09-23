import moment from 'moment-timezone';

// Importe la bibliothèque 'axios' pour effectuer des requêtes HTTP
import axios from 'axios';
import ical, { CalendarResponse  } from "node-ical";


// Fonction qui récupère l'agenda sur internet
export async function get_agenda(url: string): Promise<CalendarResponse> {

  
    const response = await axios.get(url);
    const cal = ical.parseICS(response.data);
   
    return cal;
}


// Fonction qui récupère chaque cours du calendrier

export function get_current_event(calendar: CalendarResponse): any[] {
  // Obtient l'heure actuelle en UTC
  const currentUtc = moment.utc();

  // Initialise un tableau pour stocker les événements
  const TAb_events: any[] = [];

  //Parcours le calendrier
  for (const key in calendar) {
    if (calendar.hasOwnProperty(key)) {
      const event = calendar[key];
      if (event.type === 'VEVENT') {

        // Extrait les informations de l'événement
        const start = moment(event.start)
        const end = moment(event.end)
        const summary = event.summary;
        const location = event.location;
        const description = event.description;

        // Ajoute un objet représentant l'événement au tableau
        TAb_events.push({
          start,
          end,
          nom_cours: summary,
          salle: location,
          nom_prof: description,
        });
      }
    }
  }
  
  return TAb_events;
}


// Fonction qui retourne les cours associés a une date
export function date_cours(cal: CalendarResponse, DATE: string): CourseInfo[] {
 
  const TAB_events = get_current_event(cal);

  // Convertit la date  en objet 'Date'
  const targetDate = moment(DATE).toDate();
 
  // Initialise un tableau pour stocker les informations sur les cours
  const courseInfoList: CourseInfo[] = [];

 // Parcourt le tableau de tous les événements
  for (const event of TAB_events) {
    const eventStartDate = moment(event.start).toDate();

    if (moment(eventStartDate).isSame(targetDate, 'day')) {
        const courseInfo: CourseInfo = {

          nom_cours: event.nom_cours,
          salle: event.salle,
          start: moment(event.start).format('HH:mm'),
          end: moment(event.end).format('HH:mm'),

        };
        
      courseInfoList.push(courseInfo);
    }
  }

  console.log("Cours :");
  console.log( courseInfoList); 
  return courseInfoList;
}

interface CourseInfo {
  nom_cours: string;
  salle: string;
  start: string;
  end: string;
}

export function verifier_date(date: string): string {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // expression reguliere pour le format AAAA-MM-JJ

  if (regex.test(date)) {
      return "true"; // La date est au format correct
  } else {
      return "false"; // La date n'est pas au format correct
  }
}


export function transfo_date(date: string): string {
    let transformedDate: string = date;

    if (date === "today" || date === "") {
      const date_jour = moment.utc();
      const date_str = date_jour.format();
      const date_a = date_str.split("T");
      transformedDate = date_a[0];
    }
    else if (date === "demain" || date === "tomorrow") {
      const date_demain = moment.utc().add(1, 'days');
      const date_str = date_demain.format();
      const date_b = date_str.split("T");
      transformedDate = date_b[0];
    }
  
    if (date.length === 2) {
      const date_jour = moment.utc();
      const date_str = date_jour.format();
      const date_split = date_str.split("T");
      const date_annee = date_split[0];
      const date_a = date_annee.split("-");
      if (date_a[2] > date) {
        const mois_modifier = parseInt(date_a[1]) + 1;
        if (mois_modifier < 10 && mois_modifier >= 1) {
          date_a[1] = `0${mois_modifier}`;
        } else {
          date_a[1] = `${parseInt(date_a[1]) + 1}`;
        }
        console.log(date_a, "modifier");
      }
      date_a[2] = date;
      console.log(date_a);
      transformedDate = `${date_a[0]}-${date_a[1]}-${date_a[2]}`;
      console.log(transformedDate);
    }
    return transformedDate;
  }