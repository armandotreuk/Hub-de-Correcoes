import { GovernanceExportService } from './governance-export.service';
import { UnifiedConfigRow, Prompt } from '../models/ia-corrections.models';
import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';

describe('GovernanceExportService', () => {
  let service: GovernanceExportService;

  const mockPrompts: Prompt[] = [
    {
      id: 'PRM-001',
      title: 'Prompt Corretor Padrão',
      bodyEvaluation: 'Avalie o aluno.',
      bodyFeedback: 'Feedback detalhado.',
      businessUnitId: 1,
      businessUnitName: 'Uniasselvi',
      activityTypeId: 1,
      activityTypeName: 'Desafio Profissional',
      createdAt: '2026-01-10',
      createdBy: 'USR-Admin',
      status: 'Ativo',
      observations: '',
    },
    {
      id: 'PRM-002',
      title: 'Prompt Resenha Crítica',
      bodyEvaluation: 'Avalie a resenha.',
      bodyFeedback: 'Feedback da resenha.',
      businessUnitId: 1,
      businessUnitName: 'Uniasselvi',
      activityTypeId: 2,
      activityTypeName: 'Resenha',
      createdAt: '2026-01-15',
      createdBy: 'USR-Coord',
      status: 'Inativo',
      observations: 'Prompt em revisão.',
    },
  ];

  const mockRowWithPrompt: UnifiedConfigRow = {
    id: '1_Desafio Profissional',
    disciplineId: 1,
    disciplineName: 'Algoritmos',
    courseName: 'Engenharia de Software',
    clusterName: 'Cluster Sul',
    businessUnitName: 'Uniasselvi',
    activityTypeName: 'Desafio Profissional',
    promptId: 'PRM-001',
    promptTitle: 'Prompt Corretor Padrão',
    correctionStatus: 'Ativo',
    publicationStatus: 'Ativa',
    note: 70,
    deadline: 5,
    promptCreatedByUserId: 'USR-001',
    promptCreatedByName: 'João Silva',
    promptUpdatedByUserId: 'USR-002',
    correctionActivatedByUserId: 'USR-003',
    correctionActivatedByName: 'Maria Santos',
    correctionUpdatedByUserId: 'USR-004',
    correctionActivatedAt: '2026-03-01 10:00',
    correctionDeactivatedAt: '',
    publicationActivatedByUserId: 'USR-005',
    publicationActivatedByName: 'Pedro Oliveira',
    publicationUpdatedByUserId: 'USR-006',
    publicationActivatedAt: '2026-03-02 14:00',
    publicationDeactivatedAt: '',
  };

  const mockRowWithoutPrompt: UnifiedConfigRow = {
    id: '2_Resenha',
    disciplineId: 2,
    disciplineName: 'Gestão de Projetos',
    courseName: 'Administração',
    clusterName: 'Cluster Sul',
    businessUnitName: 'Uniasselvi',
    activityTypeName: 'Resenha',
    promptId: undefined,
    promptTitle: undefined,
    correctionStatus: 'Inativo',
    publicationStatus: 'Inativa',
    note: null,
    deadline: null,
  };

  const mockRowInactivePublication: UnifiedConfigRow = {
    id: '3_MAPA',
    disciplineId: 3,
    disciplineName: 'Materiais de Construção',
    courseName: 'Engenharia Civil',
    clusterName: 'Cluster Centro',
    businessUnitName: 'Unicesumar',
    activityTypeName: 'MAPA',
    promptId: 'PRM-002',
    promptTitle: 'Prompt MAPA Avaliativo',
    correctionStatus: 'Ativo',
    publicationStatus: 'Inativa',
    note: 60,
    deadline: 3,
    promptCreatedByUserId: 'USR-010',
    promptCreatedByName: 'Ana Costa',
    promptUpdatedByUserId: 'USR-011',
    correctionActivatedByUserId: 'USR-012',
    correctionActivatedByName: 'Carlos Lima',
    correctionUpdatedByUserId: 'USR-013',
    correctionActivatedAt: '2026-02-15 09:00',
    correctionDeactivatedAt: '',
    publicationActivatedByUserId: 'USR-014',
    publicationActivatedByName: 'Lucia Ferreira',
    publicationUpdatedByUserId: 'USR-015',
    publicationActivatedAt: '2026-02-16 11:00',
    publicationDeactivatedAt: '2026-03-01 08:00',
  };

  beforeEach(() => {
    service = new GovernanceExportService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateExportRows', () => {
    it('should map a row with a linked prompt correctly', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);

      expect(rows.length).toBe(1);
      const row = rows[0];

      expect(row.unidadeNegocio).toBe('Uniasselvi');
      expect(row.cluster).toBe('Cluster Sul');
      expect(row.curso).toBe('Engenharia de Software');
      expect(row.disciplina).toBe('Algoritmos');
      expect(row.tipoAtividade).toBe('Desafio Profissional');
      expect(row.promptVinculado).toBe('Prompt Corretor Padrão');
      expect(row.tituloPrompt).toBe('Prompt Corretor Padrão');
      expect(row.situacaoPrompt).toBe('Ativo');
      expect(row.criadoPorUserId).toBe('USR-001');
      expect(row.criadoPorNome).toBe('João Silva');
      expect(row.ultimaEdicaoUserId).toBe('USR-002');
      expect(row.statusCorrecaoIA).toBe('Ativo');
      expect(row.dataAtivacaoCorrecao).toBe('2026-03-01 10:00');
      expect(row.ativacaoOriginalUserId).toBe('USR-003');
      expect(row.ativacaoOriginalNome).toBe('Maria Santos');
      expect(row.correcaoUltimaEdicaoUserId).toBe('USR-004');
      expect(row.statusPublicacao).toBe('Ativa');
      expect(row.notaMinima).toBe('70');
      expect(row.prazoLiberacao).toBe('5');
      expect(row.publicacaoAtivacaoUserId).toBe('USR-005');
      expect(row.publicacaoAtivacaoNome).toBe('Pedro Oliveira');
      expect(row.publicacaoUltimaEdicaoUserId).toBe('USR-006');
    });

    it('should set N/A for notaMinima and prazoLiberacao when publication is Inativa', () => {
      const rows = service.generateExportRows([mockRowInactivePublication], mockPrompts);

      expect(rows.length).toBe(1);
      const row = rows[0];

      expect(row.statusPublicacao).toBe('Inativa');
      expect(row.notaMinima).toBe('N/A');
      expect(row.prazoLiberacao).toBe('N/A');
      expect(row.publicacaoUltimaEdicaoUserId).toBe('USR-015');
    });

    it('should set empty strings for prompt fields when no prompt is linked', () => {
      const rows = service.generateExportRows([mockRowWithoutPrompt], mockPrompts);

      expect(rows.length).toBe(1);
      const row = rows[0];

      expect(row.promptVinculado).toBe('Não vinculado');
      expect(row.tituloPrompt).toBe('');
      expect(row.situacaoPrompt).toBe('');
      expect(row.criadoPorUserId).toBe('');
      expect(row.criadoPorNome).toBe('');
      expect(row.ultimaEdicaoUserId).toBe('');
    });

    it('should map multiple rows correctly', () => {
      const rows = service.generateExportRows(
        [mockRowWithPrompt, mockRowWithoutPrompt, mockRowInactivePublication],
        mockPrompts,
      );

      expect(rows.length).toBe(3);
      expect(rows[0].promptVinculado).toBe('Prompt Corretor Padrão');
      expect(rows[1].promptVinculado).toBe('Não vinculado');
      expect(rows[2].promptVinculado).toBe('Prompt MAPA Avaliativo');
    });

    it('should handle row with promptId but prompt not found in list', () => {
      const rowWithMissingPrompt: UnifiedConfigRow = {
        ...mockRowWithPrompt,
        promptId: 'PRM-999',
        promptTitle: 'Prompt Desconhecido',
      };

      const rows = service.generateExportRows([rowWithMissingPrompt], mockPrompts);

      expect(rows[0].promptVinculado).toBe('Prompt Desconhecido');
      expect(rows[0].tituloPrompt).toBe('');
      expect(rows[0].situacaoPrompt).toBe('');
    });

    it('should handle null note and deadline when publication is Ativa', () => {
      const rowWithNullValues: UnifiedConfigRow = {
        ...mockRowWithPrompt,
        publicationStatus: 'Ativa',
        note: null,
        deadline: null,
      };

      const rows = service.generateExportRows([rowWithNullValues], mockPrompts);

      expect(rows[0].notaMinima).toBe('');
      expect(rows[0].prazoLiberacao).toBe('');
    });
  });

  describe('buildCsvContent', () => {
    it('should produce CSV with BOM prefix', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);
      const csv = service.buildCsvContent(rows);

      expect(csv.startsWith('\uFEFF')).toBe(true);
    });

    it('should use semicolon as delimiter', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const headerLine = csv.split('\n')[0].replace('\uFEFF', '');

      const columns = headerLine.split(';');
      expect(columns.length).toBe(23);
    });

    it('should have exactly 23 header columns matching RN53 blueprint', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const headerLine = csv.split('\n')[0].replace('\uFEFF', '');

      const expectedHeaders = [
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

      expect(headerLine.split(';')).toEqual(expectedHeaders);
    });

    it('should have header line plus one data line for single row', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const lines = csv.split('\n');

      expect(lines.length).toBe(2);
    });

    it('should escape values containing semicolons', () => {
      const rowWithSemicolon: UnifiedConfigRow = {
        ...mockRowWithPrompt,
        disciplineName: 'Algoritmos; Estruturas',
      };

      const rows = service.generateExportRows([rowWithSemicolon], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const dataLine = csv.split('\n')[1];

      expect(dataLine).toContain('"Algoritmos; Estruturas"');
    });

    it('should escape values containing double quotes', () => {
      const rowWithQuotes: UnifiedConfigRow = {
        ...mockRowWithPrompt,
        disciplineName: 'Algoritmos "Avançados"',
      };

      const rows = service.generateExportRows([rowWithQuotes], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const dataLine = csv.split('\n')[1];

      expect(dataLine).toContain('"Algoritmos ""Avançados"""');
    });

    it('should produce correct data for row with inactive publication', () => {
      const rows = service.generateExportRows([mockRowInactivePublication], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const dataLine = csv.split('\n')[1];
      const columns = dataLine.split(';');

      const statusPublicacaoIdx = 17;
      const notaMinimaIdx = 18;
      const prazoIdx = 19;

      expect(columns[statusPublicacaoIdx]).toBe('Inativa');
      expect(columns[notaMinimaIdx]).toBe('N/A');
      expect(columns[prazoIdx]).toBe('N/A');
    });

    it('should produce correct data for row without prompt', () => {
      const rows = service.generateExportRows([mockRowWithoutPrompt], mockPrompts);
      const csv = service.buildCsvContent(rows);
      const dataLine = csv.split('\n')[1];
      const columns = dataLine.split(';');

      const promptVinculadoIdx = 5;
      const tituloPromptIdx = 6;
      const situacaoPromptIdx = 7;

      expect(columns[promptVinculadoIdx]).toBe('Não vinculado');
      expect(columns[tituloPromptIdx]).toBe('');
      expect(columns[situacaoPromptIdx]).toBe('');
    });
  });

  describe.skip('downloadFile', () => {
    it('deve pular testes - requer APIs de DOM não disponíveis sem jsdom completo', () => {
      expect(true).toBe(true);
    });
  });

  describe('exportMatrix', () => {
    let downloadSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      downloadSpy = vi.spyOn(service, 'downloadFile').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate CSV and trigger download with correct filename', () => {
      const filename = service.exportMatrix([mockRowWithPrompt], mockPrompts);

      expect(filename).toMatch(/^governanca-correcoes-ia-\d{4}-\d{2}-\d{2}\.csv$/);
      expect(downloadSpy).toHaveBeenCalled();
    });

    it('should call downloadFile with CSV content containing BOM', () => {
      service.exportMatrix([mockRowWithPrompt], mockPrompts);

      const csvContent = downloadSpy.mock.calls[0][0];
      expect(csvContent.startsWith('\uFEFF')).toBe(true);
    });

    it('should call downloadFile with correct filename pattern', () => {
      service.exportMatrix([mockRowWithPrompt], mockPrompts);

      const filename = downloadSpy.mock.calls[0][1];
      expect(filename).toMatch(/^governanca-correcoes-ia-/);
      expect(filename).toMatch(/\.csv$/);
    });

    it('should handle empty matrix rows', () => {
      const filename = service.exportMatrix([], mockPrompts);

      expect(filename).toMatch(/^governanca-correcoes-ia-/);
      const csvContent = downloadSpy.mock.calls[0][0];
      const lines = csvContent.split('\n');
      expect(lines.length).toBe(2);
      const headerLine = lines[0].replace('\uFEFF', '');
      expect(headerLine.split(';').length).toBe(23);
    });
  });

  describe('GovernanceExportRow structure', () => {
    it('should have exactly 23 properties matching the blueprint', () => {
      const rows = service.generateExportRows([mockRowWithPrompt], mockPrompts);
      const row = rows[0];

      const expectedKeys = [
        'unidadeNegocio',
        'cluster',
        'curso',
        'disciplina',
        'tipoAtividade',
        'promptVinculado',
        'tituloPrompt',
        'situacaoPrompt',
        'criadoPorUserId',
        'criadoPorNome',
        'ultimaEdicaoUserId',
        'statusCorrecaoIA',
        'dataAtivacaoCorrecao',
        'dataInativacaoCorrecao',
        'ativacaoOriginalUserId',
        'ativacaoOriginalNome',
        'correcaoUltimaEdicaoUserId',
        'statusPublicacao',
        'notaMinima',
        'prazoLiberacao',
        'publicacaoAtivacaoUserId',
        'publicacaoAtivacaoNome',
        'publicacaoUltimaEdicaoUserId',
      ];

      expect(Object.keys(row).length).toBe(23);
      expectedKeys.forEach((key) => {
        expect(row).toHaveProperty(key);
      });
    });
  });
});
