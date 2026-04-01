// [Updated: 2026-04-01]
// ============================================================
// Modelos de dados centrais para o módulo Correções por IA v4
// ============================================================

/** Entidade Prompt — CRUD na Aba 1 */
export interface Prompt {
  id: string;
  title: string;
  bodyEvaluation: string; // até 10.000 caracteres (v4)
  bodyFeedback: string; // até 10.000 caracteres (v4)
  businessUnitId: number;
  businessUnitName: string;
  activityTypeId: number;
  activityTypeName: string;
  createdAt: string;
  createdBy: string;
  status: 'Ativo' | 'Inativo'; // default: 'Ativo'
  observations: string; // até 10.000 caracteres
}

/** Configurações Globais de Publicação */
export interface PublicationGlobalSettings {
  note: number | null; // 0-100
  deadline: number | null; // 0-99 (dias)
  autoPublicationEnabled: boolean; // default: false
}

/** Disciplina — v4 */
export interface Discipline {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  clusterId: number;
  clusterName: string;
  businessUnitId: number;
}

/** Vínculo Prompt ↔ Disciplina — Aba 2 */
export interface PromptLink {
  id: string;
  promptId: string;
  promptTitle: string;
  disciplineId: number; // v4: principal entidade de vínculo
  disciplineName: string; // v4
  courseId: number; // mantido para contexto na tabela
  courseName: string; // mantido para contexto na tabela
  clusterId: number;
  clusterName: string;
  activityTypeName: string;
}

/** Configuração de Correção — Aba 3 */
export interface CorrectionConfig {
  id: string;
  businessUnitName: string;
  clusterName: string;
  courseName: string;
  disciplineName: string; // v4
  activityTypeName: string;
  promptTitle: string;
  correctionStatus: 'Ativo' | 'Inativo'; // default: Inativo
  createdAt: string; // v4: auditoria
  createdBy: string; // v4: auditoria
  updatedAt: string; // v4: auditoria
  updatedBy: string; // v4: auditoria
}

/** Configuração de Publicação — Aba 5 */
export interface PublicationConfig {
  id: string;
  businessUnitName: string;
  clusterName: string;
  courseName: string;
  disciplineName: string; // v4
  activityTypeName: string;
  promptTitle: string;
  correctionStatus: 'Ativo' | 'Inativo';
  publicationStatus: 'Habilitado' | 'Desabilitado'; // default: Desabilitado
  performanceThreshold: number | null; // % de corte (RN25-RN27)
  activatedBy: string;
  activatedAt: string;
}

/** Curso para navegação hierárquica */
export interface Course {
  id: number;
  name: string;
  clusterId: number;
  clusterName: string;
  businessUnitId: number;
}

/** Unidade de Negócio */
export interface BusinessUnit {
  id: number;
  name: string;
}

/** Tipo de Atividade */
export interface ActivityType {
  id: number;
  name: string;
}
