
export interface Candidature {
  id: string;
  entreprise: string;
  poste: string;
  statut: 'brouillon' | 'envoyee' | 'relancee' | 'entretien' | 'refusee' | 'acceptee';
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  datePostulation: string;
  dateRelance?: string;
  score: number;
  contact?: {
    nom: string;
    email: string;
    telephone?: string;
    poste: string;
  };
  entrepriseData: {
    secteur: string;
    taille: string;
    localisation: string;
    siteWeb?: string;
    linkedin?: string;
  };
  historique: {
    date: string;
    action: string;
    details: string;
  }[];
  notes: string;
  fichiers: {
    cv?: string;
    lettreMotivation?: string;
    autres?: string[];
  };
}

export interface KPI {
  label: string;
  value: number;
  changement: number;
  tendance: 'hausse' | 'baisse' | 'stable';
  icon: string;
  couleur: string;
}

export interface ScoreFactors {
  correspondanceCompetences: number;
  reputationEntreprise: number;
  opportuniteCroissance: number;
  localisationCompatible: number;
  salairePropose: number;
  culturalFit: number;
}

export interface AutomationRule {
  id: string;
  nom: string;
  actif: boolean;
  declencheur: {
    type: 'temps' | 'statut' | 'score';
    condition: string;
    valeur: string | number;
  };
  action: {
    type: 'email' | 'relance' | 'notification' | 'mise_a_jour';
    template?: string;
    contenu: string;
  };
  frequence?: 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel';
  dateCreation: string;
  derniereExecution?: string;
}

export interface AnalyticsData {
  candidaturesParMois: {
    mois: string;
    candidatures: number;
    entretiens: number;
    acceptations: number;
  }[];
  tauxReussite: {
    secteur: string;
    taux: number;
  }[];
  tempsReponse: {
    moyenne: number;
    mediane: number;
    repartition: { delai: string; nombre: number }[];
  };
}
