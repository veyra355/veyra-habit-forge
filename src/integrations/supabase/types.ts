export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.15" };
  public: {
    Tables: {
      profiles: { Row:{id:string;name:string;email:string;role:"user"|"admin";plan:"free"|"starter"|"pro"|"elite";onboarding:Json|null;notifications:Json;privacy:Json;created_at:string;updated_at:string}; Insert:{id:string;name?:string;email?:string;role?:"user"|"admin";plan?:"free"|"starter"|"pro"|"elite";onboarding?:Json|null;notifications?:Json;privacy?:Json;created_at?:string;updated_at?:string}; Update:Partial<{id:string;name:string;email:string;role:"user"|"admin";plan:"free"|"starter"|"pro"|"elite";onboarding:Json|null;notifications:Json;privacy:Json;created_at:string;updated_at:string}>; Relationships:[] };
      habits: { Row:{id:string;user_id:string;name:string;custom:boolean;created_at:string}; Insert:{id?:string;user_id:string;name:string;custom?:boolean;created_at?:string}; Update:Partial<{id:string;user_id:string;name:string;custom:boolean;created_at:string}>; Relationships:[] };
      habit_completions: { Row:{id:string;user_id:string;habit_id:string;completed_on:string;created_at:string}; Insert:{id?:string;user_id:string;habit_id:string;completed_on:string;created_at?:string}; Update:Partial<{id:string;user_id:string;habit_id:string;completed_on:string;created_at:string}>; Relationships:[] };
      workout_sessions: { Row:{id:string;user_id:string;workout_title:string;session_date:string;feedback:"easy"|"good"|"challenging"|"too_difficult"|null;created_at:string}; Insert:{id?:string;user_id:string;workout_title:string;session_date?:string;feedback?:"easy"|"good"|"challenging"|"too_difficult"|null;created_at?:string}; Update:Partial<{id:string;user_id:string;workout_title:string;session_date:string;feedback:"easy"|"good"|"challenging"|"too_difficult"|null;created_at:string}>; Relationships:[] };
      ai_conversations: { Row:{id:string;user_id:string;messages:Json;updated_at:string;created_at:string}; Insert:{id?:string;user_id:string;messages?:Json;updated_at?:string;created_at?:string}; Update:Partial<{id:string;user_id:string;messages:Json;updated_at:string;created_at:string}>; Relationships:[] };
    };
    Views:{[_ in never]:never}; Functions:{get_admin_overview:{Args:Record<string,never>;Returns:Json}}; Enums:{[_ in never]:never}; CompositeTypes:{[_ in never]:never};
  };
};
