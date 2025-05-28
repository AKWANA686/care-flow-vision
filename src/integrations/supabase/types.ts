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
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          delivery_status: string | null
          id: string
          patient_response: string | null
          reminder_type: string
          response_received_at: string | null
          scheduled_time: string
          sent_at: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          patient_response?: string | null
          reminder_type: string
          response_received_at?: string | null
          scheduled_time: string
          sent_at?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          patient_response?: string | null
          reminder_type?: string
          response_received_at?: string | null
          scheduled_time?: string
          sent_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          doctor_id: string
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          doctor_id: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          doctor_id?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: number
          phone: string | null
          speciality: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: number
          phone?: string | null
          speciality?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: number
          phone?: string | null
          speciality?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string
          description: string | null
          diagnosis: string | null
          doctor_id: string | null
          id: string
          medications: string[] | null
          patient_id: string
          title: string
          treatment_plan: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          medications?: string[] | null
          patient_id: string
          title: string
          treatment_plan?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          medications?: string[] | null
          patient_id?: string
          title?: string
          treatment_plan?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_monitoring_data: {
        Row: {
          created_at: string
          data_type: string
          device_id: string | null
          doctor_id: string
          id: string
          is_critical: boolean | null
          notes: string | null
          patient_id: string
          recorded_at: string
          unit: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          data_type: string
          device_id?: string | null
          doctor_id: string
          id?: string
          is_critical?: boolean | null
          notes?: string | null
          patient_id: string
          recorded_at?: string
          unit?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          data_type?: string
          device_id?: string | null
          doctor_id?: string
          id?: string
          is_critical?: boolean | null
          notes?: string | null
          patient_id?: string
          recorded_at?: string
          unit?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder_configurations: {
        Row: {
          created_at: string
          custom_message: string | null
          doctor_id: string
          enabled: boolean | null
          frequency: number | null
          id: string
          reminder_type: string
          timing_before_appointment: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          doctor_id: string
          enabled?: boolean | null
          frequency?: number | null
          id?: string
          reminder_type: string
          timing_before_appointment?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          doctor_id?: string
          enabled?: boolean | null
          frequency?: number | null
          id?: string
          reminder_type?: string
          timing_before_appointment?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      socket_connections: {
        Row: {
          connected_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_ping: string | null
          socket_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          connected_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_ping?: string | null
          socket_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          connected_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_ping?: string | null
          socket_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          phone_number: string | null
          plan: string
          result_code: number | null
          result_desc: string | null
          status: string
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          phone_number?: string | null
          plan: string
          result_code?: number | null
          result_desc?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          phone_number?: string | null
          plan?: string
          result_code?: number | null
          result_desc?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          allergies: string[] | null
          created_at: string
          current_medications: Json | null
          date_of_birth: string | null
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          id: string
          insurance_info: Json | null
          medical_history: Json | null
          medical_license_number: string | null
          patient_id: string | null
          phone_number: string | null
          profile_picture_url: string | null
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          current_medications?: Json | null
          date_of_birth?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          medical_history?: Json | null
          medical_license_number?: string | null
          patient_id?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          current_medications?: Json | null
          date_of_birth?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          medical_history?: Json | null
          medical_license_number?: string | null
          patient_id?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          specialization?: string | null
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
      get_patient_monitoring_data: {
        Args: {
          p_patient_id?: string
          p_doctor_id?: string
          p_data_type?: string
          p_hours_back?: number
        }
        Returns: {
          id: string
          patient_id: string
          doctor_id: string
          data_type: string
          value: Json
          unit: string
          recorded_at: string
          is_critical: boolean
          patient_name: string
        }[]
      }
      update_reminder_status: {
        Args: {
          reminder_id: string
          new_status: string
          patient_response?: string
        }
        Returns: undefined
      }
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
