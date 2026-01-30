export interface QuotasCentre {
  centre: {
    id: number;
    lib_centre: string;
  };
  places_restantes: {
    [operation: string]: {
      [poste: string]: {
        quota: number;
        affectes: number;
        restants: number;
      };
    };
  };
  total_affectes: number;
}

export interface PostulantDetailPageProps {
  postulantId: number;
}

export const OPERATIONS = [
  { value: "Scrutin électoral", label: "Scrutin électoral" },
  { value: "Révision de la liste électorale", label: "Révision de la liste électorale" }
] as const;

export const POSTES_PAR_OPERATION = {
  "Scrutin électoral": [
    { value: "Président", label: "Président" },
    { value: "Secrétaire", label: "Secrétaire" }
  ],
  "Révision de la liste électorale": [
    { value: "Chef de centre", label: "Chef de centre" },
    { value: "Agent Formulaire", label: "Agent Formulaire" },
    { value: "Agent Tablette", label: "Agent Tablette" }
  ]
} as const;