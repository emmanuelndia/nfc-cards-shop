export interface PostulantFormData {
  matricule?: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  sexe: "MASCULIN" | "FEMININ";
  contact: string;
  email?: string;
  nationalite: string;
  lieu_residence: string;
  niveau_etude: "BACCALAUREAT" | "BEPC" | "CEPE" | "AUCUN";
  anciennete: "OUI" | "NON";
  info: "OUI" | "NON";
  region_aff: string;
  dep_aff: string;
  sp_aff: string;
  commune_aff: string;
  centre_origine_id: string;
}

export const niveauEtudeOptions = [
  { value: "BACCALAUREAT", label: "Baccalauréat" },
  { value: "BEPC", label: "BEPC" },
  { value: "CEPE", label: "CEPE" },
  { value: "AUCUN", label: "Aucun" },
] as const;

export interface GeographicData {
  regions: { value: string; label: string }[];
  departements: { value: string; label: string }[];
  sousPrefectures: { value: string; label: string }[];
  communes: { value: string; label: string }[];
  centres: { value: string; label: string }[];
}

export interface FileState {
  photo_identite: File | null;
  cni: File | null;
  diplome: File | null;
  cv: File | null;
  lettre_motivation: File | null;
  carte_electeur: File | null;
}