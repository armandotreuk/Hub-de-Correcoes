import { Injectable } from '@angular/core';
import { UnifiedConfigRow, GovernanceExportRow } from '../models/ia-corrections.models';
import { Prompt } from '../models/ia-corrections.models';

const EXPORT_HEADERS = [
  'Unidade de Negócio',
  'Cluster',
  'Curso',
  'Disciplina',
  'Tipo de Atividade',
  'Prompt Vinculado',
  'Título do Prompt',
  'Situação do Prompt',
  'Criado por (user_id)',
  'Criado por (Nome)',
  'Última Edição por (user_id)',
  'Status Correção IA',
  'Data Ativação Correção',
  'Data Inativação Correção',
  'Ativação Original por (user_id)',
  'Ativação Original por (Nome)',
  'Última Edição por (user_id) — Correção',
  'Status Publicação',
  'Nota Mínima',
  'Prazo para Liberação (dias)',
  'Ativação Original por (user_id) — Publicação',
  'Ativação Original por (Nome) — Publicação',
  'Última Edição por (user_id) — Publicação',
];

@Injectable({ providedIn: 'root' })
export class GovernanceExportService {
  generateExportRows(matrixRows: UnifiedConfigRow[], prompts: Prompt[]): GovernanceExportRow[] {
    return matrixRows.map((row) => this.mapRow(row, prompts));
  }

  buildCsvContent(rows: GovernanceExportRow[]): string {
    const bom = '\uFEFF';
    const headerLine = EXPORT_HEADERS.join(';');
    const dataLines = rows.map((r) => this.rowToCsvLine(r));
    return bom + headerLine + '\n' + dataLines.join('\n');
  }

  downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportMatrix(
    matrixRows: UnifiedConfigRow[],
    prompts: Prompt[],
    filters?: Record<string, unknown>,
  ): string {
    const exportRows = this.generateExportRows(matrixRows, prompts);
    const csvContent = this.buildCsvContent(exportRows);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `governanca-correcoes-ia-${timestamp}.csv`;
    this.downloadFile(csvContent, filename);
    return filename;
  }

  private mapRow(row: UnifiedConfigRow, prompts: Prompt[]): GovernanceExportRow {
    const prompt = row.promptId ? prompts.find((p) => p.id === row.promptId) : undefined;

    const isPublicationActive = row.publicationStatus === 'Ativa';

    return {
      unidadeNegocio: row.businessUnitName,
      cluster: row.clusterName,
      curso: row.courseName,
      disciplina: row.disciplineName,
      tipoAtividade: row.activityTypeName,
      promptVinculado: row.promptTitle ?? 'Não vinculado',
      tituloPrompt: prompt?.title ?? '',
      situacaoPrompt: prompt?.status ?? '',
      criadoPorUserId: row.promptCreatedByUserId ?? '',
      criadoPorNome: row.promptCreatedByName ?? '',
      ultimaEdicaoUserId: row.promptUpdatedByUserId ?? '',
      statusCorrecaoIA: row.correctionStatus,
      dataAtivacaoCorrecao: row.correctionActivatedAt ?? '',
      dataInativacaoCorrecao: row.correctionDeactivatedAt ?? '',
      ativacaoOriginalUserId: row.correctionActivatedByUserId ?? '',
      ativacaoOriginalNome: row.correctionActivatedByName ?? '',
      correcaoUltimaEdicaoUserId: row.correctionUpdatedByUserId ?? '',
      statusPublicacao: row.publicationStatus,
      notaMinima: isPublicationActive ? (row.note?.toString() ?? '') : 'N/A',
      prazoLiberacao: isPublicationActive ? (row.deadline?.toString() ?? '') : 'N/A',
      publicacaoAtivacaoUserId: row.publicationActivatedByUserId ?? '',
      publicacaoAtivacaoNome: row.publicationActivatedByName ?? '',
      publicacaoUltimaEdicaoUserId: row.publicationUpdatedByUserId ?? '',
    };
  }

  private rowToCsvLine(row: GovernanceExportRow): string {
    return [
      row.unidadeNegocio,
      row.cluster,
      row.curso,
      row.disciplina,
      row.tipoAtividade,
      row.promptVinculado,
      row.tituloPrompt,
      row.situacaoPrompt,
      row.criadoPorUserId,
      row.criadoPorNome,
      row.ultimaEdicaoUserId,
      row.statusCorrecaoIA,
      row.dataAtivacaoCorrecao,
      row.dataInativacaoCorrecao,
      row.ativacaoOriginalUserId,
      row.ativacaoOriginalNome,
      row.correcaoUltimaEdicaoUserId,
      row.statusPublicacao,
      row.notaMinima,
      row.prazoLiberacao,
      row.publicacaoAtivacaoUserId,
      row.publicacaoAtivacaoNome,
      row.publicacaoUltimaEdicaoUserId,
    ]
      .map((v) => this.escapeCsvValue(v))
      .join(';');
  }

  private escapeCsvValue(value: string): string {
    if (value.includes(';') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
