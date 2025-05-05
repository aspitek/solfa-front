import type { SelectableI } from "./types/types";

export const SYMBOLS = {
  IHttpService: Symbol.for("IHttpService"),
  IApiService: Symbol.for("IApiService"),
};

export const PARTITION_GENDERS: SelectableI[] = [
  { label: "Classique", value: "Classique" },
  { label: "Liturgique", value: "Liturgique" },
  { label: "Recueil de chant", value: "Recueil de chant" },
  { label: "Animation | 4/4", value: "Animation | 4/4" },
  { label: "Gbegbe", value: "Gbegbe" },
  { label: "Apkongbô", value: "Apkongbô" },
  { label: "Gospel", value: "Gospel" },
  { label: "6/8", value: "6/8" },
  { label: "Traditionnel", value: "Traditionnel" },
  { label: "Hymne", value: "Hymne" },
  { label: "Highlife", value: "Highlife" },
  { label: "Agbadja", value: "Agbadja" },
  { label: "Abodan", value: "Abodan" },
  { label: "6/8 Ghana", value: "6/8 Ghana" },
  { label: "Mandingue", value: "Mandingue" },
  { label: "Autre", value: "Autre" },
];

export const PARTITION_CATEGORIES: SelectableI[] = [
  { label: "Offertoire", value: "Offertoire" },
  { label: "Ordinaire", value: "Ordinaire" },
  { label: "Action de grâce", value: "Action de grâce" },
  { label: "Antienne d'ouverture", value: "Antienne d'ouverture" },
  { label: "Communion | Sainte Cène", value: "Communion | Sainte Cène" },
  { label: "Psaume", value: "Psaume" },
  { label: "Méditation", value: "Méditation" },
  { label: "Animation", value: "Animation" },
  { label: "Quête", value: "Quête" },
  { label: "Acclamation", value: "Acclamation" },
  { label: "Requiem", value: "Requiem" },
  { label: "Sacrement", value: "Sacrement" },
  { label: "Carême", value: "Carême" },
  { label: "Autre", value: "Autre" },
];
