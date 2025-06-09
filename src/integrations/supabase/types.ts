export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_metrics: {
        Row: {
          candidatures_envoyees: number | null
          created_at: string
          date_metric: string
          entretiens_planifies: number | null
          id: string
          offres_recues: number | null
          secteur: string | null
          taux_reponse: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          candidatures_envoyees?: number | null
          created_at?: string
          date_metric?: string
          entretiens_planifies?: number | null
          id?: string
          offres_recues?: number | null
          secteur?: string | null
          taux_reponse?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          candidatures_envoyees?: number | null
          created_at?: string
          date_metric?: string
          entretiens_planifies?: number | null
          id?: string
          offres_recues?: number | null
          secteur?: string | null
          taux_reponse?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      automatisations: {
        Row: {
          actif: boolean | null
          created_at: string
          description: string | null
          frequence: string | null
          id: string
          nom: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actif?: boolean | null
          created_at?: string
          description?: string | null
          frequence?: string | null
          id?: string
          nom: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actif?: boolean | null
          created_at?: string
          description?: string | null
          frequence?: string | null
          id?: string
          nom?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      candidatures: {
        Row: {
          created_at: string
          date_envoi: string | null
          description: string | null
          entreprise: string
          id: string
          localisation: string | null
          poste: string
          priorite: string | null
          salaire: string | null
          statut: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_envoi?: string | null
          description?: string | null
          entreprise: string
          id?: string
          localisation?: string | null
          poste: string
          priorite?: string | null
          salaire?: string | null
          statut?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_envoi?: string | null
          description?: string | null
          entreprise?: string
          id?: string
          localisation?: string | null
          poste?: string
          priorite?: string | null
          salaire?: string | null
          statut?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          est_par_defaut: boolean | null
          id: string
          mime_type: string | null
          nom: string
          taille_fichier: number | null
          type: string
          updated_at: string
          url_fichier: string
          user_id: string
        }
        Insert: {
          created_at?: string
          est_par_defaut?: boolean | null
          id?: string
          mime_type?: string | null
          nom: string
          taille_fichier?: number | null
          type: string
          updated_at?: string
          url_fichier: string
          user_id: string
        }
        Update: {
          created_at?: string
          est_par_defaut?: boolean | null
          id?: string
          mime_type?: string | null
          nom?: string
          taille_fichier?: number | null
          type?: string
          updated_at?: string
          url_fichier?: string
          user_id?: string
        }
        Relationships: []
      }
      emails_envoyes: {
        Row: {
          candidature_id: string | null
          corps_message: string
          created_at: string
          date_envoi: string
          date_lecture: string | null
          date_reponse: string | null
          destinataire_email: string
          documents_joints: Json | null
          entreprise_id: string | null
          gmail_message_id: string | null
          id: string
          statut_envoi: string | null
          sujet: string
          updated_at: string
          user_id: string
        }
        Insert: {
          candidature_id?: string | null
          corps_message: string
          created_at?: string
          date_envoi?: string
          date_lecture?: string | null
          date_reponse?: string | null
          destinataire_email: string
          documents_joints?: Json | null
          entreprise_id?: string | null
          gmail_message_id?: string | null
          id?: string
          statut_envoi?: string | null
          sujet: string
          updated_at?: string
          user_id: string
        }
        Update: {
          candidature_id?: string | null
          corps_message?: string
          created_at?: string
          date_envoi?: string
          date_lecture?: string | null
          date_reponse?: string | null
          destinataire_email?: string
          documents_joints?: Json | null
          entreprise_id?: string | null
          gmail_message_id?: string | null
          id?: string
          statut_envoi?: string | null
          sujet?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_envoyes_candidature_id_fkey"
            columns: ["candidature_id"]
            isOneToOne: false
            referencedRelation: "candidatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_envoyes_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
        ]
      }
      entreprises: {
        Row: {
          created_at: string
          description: string | null
          id: string
          localisation: string | null
          nom: string
          secteur: string | null
          site_web: string | null
          taille: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          localisation?: string | null
          nom: string
          secteur?: string | null
          site_web?: string | null
          taille?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          localisation?: string | null
          nom?: string
          secteur?: string | null
          site_web?: string | null
          taille?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      offres_scoring: {
        Row: {
          analyse_ia: string | null
          contenu_offre: string | null
          created_at: string
          entreprise: string
          id: string
          poste: string
          recommandation: string | null
          score_competences: number | null
          score_culture: number | null
          score_global: number | null
          score_localisation: number | null
          updated_at: string
          url_offre: string | null
          user_id: string
        }
        Insert: {
          analyse_ia?: string | null
          contenu_offre?: string | null
          created_at?: string
          entreprise: string
          id?: string
          poste: string
          recommandation?: string | null
          score_competences?: number | null
          score_culture?: number | null
          score_global?: number | null
          score_localisation?: number | null
          updated_at?: string
          url_offre?: string | null
          user_id: string
        }
        Update: {
          analyse_ia?: string | null
          contenu_offre?: string | null
          created_at?: string
          entreprise?: string
          id?: string
          poste?: string
          recommandation?: string | null
          score_competences?: number | null
          score_culture?: number | null
          score_global?: number | null
          score_localisation?: number | null
          updated_at?: string
          url_offre?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          experience_years: string | null
          first_name: string | null
          id: string
          last_name: string | null
          localisation: string | null
          phone: string | null
          position_recherchee: string | null
          salaire_souhaite: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          experience_years?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          localisation?: string | null
          phone?: string | null
          position_recherchee?: string | null
          salaire_souhaite?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          experience_years?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          localisation?: string | null
          phone?: string | null
          position_recherchee?: string | null
          salaire_souhaite?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_objectives: {
        Row: {
          created_at: string
          id: string
          mois_objectif: string
          objectif_candidatures: number | null
          objectif_entretiens: number | null
          objectif_taux_reponse: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mois_objectif?: string
          objectif_candidatures?: number | null
          objectif_entretiens?: number | null
          objectif_taux_reponse?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mois_objectif?: string
          objectif_candidatures?: number | null
          objectif_entretiens?: number | null
          objectif_taux_reponse?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
