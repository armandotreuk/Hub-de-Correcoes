# Implementation Plan — US31 Governance Export (RN53)

## Overview

Implement the 21-column governance export for the Configuration Matrix (US31), with full audit trail tracking per RN53.1.

---

## Phase 1: Model Updates

### 1.1 Update `ia-corrections.models.ts`

- **`PromptLink`**: Add `createdByUserId`, `createdByName`, `updatedByUserId`
- **`CorrectionConfig`**: Add `activatedByUserId`, `activatedByName`, `updatedByUserId`
- **`PublicationConfig`**: Add `activatedByUserId`, `activatedByName`, `updatedByUserId`, change `publicationStatus` from `'Habilitado' | 'Desabilitado'` to `'Ativa' | 'Inativa'` (RN43.3)
- **`UnifiedConfigRow`**: Add all audit fields needed for the 21-column export:
  - `promptCreatedByUserId`, `promptCreatedByName`, `promptUpdatedByUserId`
  - `correctionActivatedByUserId`, `correctionActivatedByName`, `correctionUpdatedByUserId`
  - `correctionActivatedAt`, `correctionDeactivatedAt`
  - `publicationActivatedByUserId`, `publicationActivatedByName`, `publicationUpdatedByUserId`
  - `publicationActivatedAt`, `publicationDeactivatedAt`

## Phase 2: Service Updates

### 2.1 `PromptLinkingService`

- Update mock data to include `createdByUserId`, `createdByName`, `updatedByUserId`
- Update `linkPrompt()`, `bulkLinkPrompts()` to set audit fields

### 2.2 `CorrectionConfigService`

- Update mock data to include `activatedByUserId`, `activatedByName`, `updatedByUserId`
- Update `updateStatus()`, `updateStatuses()` to set audit fields

### 2.3 `PublicationService`

- Update mock data to include `activatedByUserId`, `activatedByName`, `updatedByUserId`
- Change status terminology to `'Ativa' | 'Inativa'`
- Update `updatePublicationStatus()`, `updatePublicationStatuses()` to set audit fields

### 2.4 New `GovernanceExportService`

- Method `generateExportRows(matrixRows: UnifiedConfigRow[]): GovernanceExportRow[]`
- Method `buildCsvContent(rows: GovernanceExportRow[]): string`
- Method `downloadFile(content: string, filename: string, mimeType: string): void`
- Method `exportMatrix(matrixRows: UnifiedConfigRow[], filters?: any): void` — orchestrates full flow

## Phase 3: Component Integration

### 3.1 `MatrixConfigurationTabComponent`

- Replace stub `onExportMatrix()` with real implementation using `GovernanceExportService`
- Add SweetAlert flow: confirmation → loading → success with count (RN52)

## Phase 4: Testing

### 4.1 `GovernanceExportService` Spec

- Test CSV generation with correct 21 columns
- Test null handling (publication Inativa → N/A for note/deadline)
- Test null handling (no prompt linked → empty B2-B6)
- Test CSV BOM and semicolon delimiter
- Test download trigger
- Test full export flow with mock data

### 4.2 Model Integration Spec

- Test `UnifiedConfigRow` mapping from source services
- Test audit field population

---

## Files to Create/Modify

| Action | File                                                                                                        | Phase |
| ------ | ----------------------------------------------------------------------------------------------------------- | ----- |
| MODIFY | `src/app/features/ia-corrections/models/ia-corrections.models.ts`                                           | 1     |
| MODIFY | `src/app/features/ia-corrections/services/prompt-linking.service.ts`                                        | 2.1   |
| MODIFY | `src/app/features/ia-corrections/services/correction-config.service.ts`                                     | 2.2   |
| MODIFY | `src/app/features/ia-corrections/services/publication.service.ts`                                           | 2.3   |
| CREATE | `src/app/features/ia-corrections/services/governance-export.service.ts`                                     | 2.4   |
| CREATE | `src/app/features/ia-corrections/services/governance-export.service.spec.ts`                                | 4     |
| MODIFY | `src/app/features/ia-corrections/components/matrix-configuration-tab/matrix-configuration-tab.component.ts` | 3.1   |

---

## Column Mapping (Service → Export)

| Export Column                      | Source                                            |
| ---------------------------------- | ------------------------------------------------- |
| A1 Unidade de Negócio              | `UnifiedConfigRow.businessUnitName`               |
| A2 Cluster                         | `UnifiedConfigRow.clusterName`                    |
| A3 Curso                           | `UnifiedConfigRow.courseName`                     |
| A4 Disciplina                      | `UnifiedConfigRow.disciplineName`                 |
| A5 Tipo de Atividade               | `UnifiedConfigRow.activityTypeName`               |
| B1 Prompt Vinculado                | `UnifiedConfigRow.promptTitle ?? 'Não vinculado'` |
| B2 Título do Prompt                | `prompt.title` (from PromptService)               |
| B3 Situação do Prompt              | `prompt.status`                                   |
| B4 Criado por (user_id)            | `UnifiedConfigRow.promptCreatedByUserId`          |
| B5 Criado por (Nome)               | `UnifiedConfigRow.promptCreatedByName`            |
| B6 Última Edição por (user_id)     | `UnifiedConfigRow.promptUpdatedByUserId`          |
| C1 Status Correção IA              | `UnifiedConfigRow.correctionStatus`               |
| C2 Data Ativação Correção          | `UnifiedConfigRow.correctionActivatedAt`          |
| C3 Data Inativação Correção        | `UnifiedConfigRow.correctionDeactivatedAt`        |
| C4 Ativação Original por (user_id) | `UnifiedConfigRow.correctionActivatedByUserId`    |
| C5 Ativação Original por (Nome)    | `UnifiedConfigRow.correctionActivatedByName`      |
| C6 Última Edição por (user_id)     | `UnifiedConfigRow.correctionUpdatedByUserId`      |
| D1 Status Publicação               | `UnifiedConfigRow.publicationStatus`              |
| D2 Nota Mínima                     | `UnifiedConfigRow.note` (or N/A)                  |
| D3 Prazo para Liberação (dias)     | `UnifiedConfigRow.deadline` (or N/A)              |
| D4 Data Ativação Publicação        | `UnifiedConfigRow.publicationActivatedAt`         |
| D5 Data Inativação Publicação      | `UnifiedConfigRow.publicationDeactivatedAt`       |
| D6 Ativação Original por (user_id) | `UnifiedConfigRow.publicationActivatedByUserId`   |
| D7 Ativação Original por (Nome)    | `UnifiedConfigRow.publicationActivatedByName`     |
| D8 Última Edição por (user_id)     | `UnifiedConfigRow.publicationUpdatedByUserId`     |
