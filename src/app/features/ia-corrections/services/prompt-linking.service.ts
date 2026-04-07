import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { PromptLink, Course, Discipline } from '../models/ia-corrections.models';

@Injectable({ providedIn: 'root' })
export class PromptLinkingService {
  private courses: Course[] = [
    // Cluster Sul — Uniasselvi
    {
      id: 101,
      name: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    { id: 102, name: 'Administração', clusterId: 1, clusterName: 'Cluster Sul', businessUnitId: 1 },
    { id: 103, name: 'Pedagogia', clusterId: 1, clusterName: 'Cluster Sul', businessUnitId: 1 },
    { id: 104, name: 'Direito', clusterId: 1, clusterName: 'Cluster Sul', businessUnitId: 1 },
    // Cluster Norte — Uniasselvi
    {
      id: 201,
      name: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 202,
      name: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 203,
      name: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    // Cluster Centro — Unicesumar
    {
      id: 301,
      name: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    { id: 302, name: 'Psicologia', clusterId: 3, clusterName: 'Cluster Centro', businessUnitId: 2 },
    {
      id: 303,
      name: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    // Cluster Oeste — Unicesumar
    {
      id: 401,
      name: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 402,
      name: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 403,
      name: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
  ];

  // v4: Disciplinas (5 por curso)
  private disciplines: Discipline[] = [
    // Engenharia de Software (courseId: 101)
    {
      id: 1001,
      name: 'Algoritmos',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1002,
      name: 'Banco de Dados',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1003,
      name: 'Engenharia de Requisitos',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1004,
      name: 'Arquitetura de Software',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1005,
      name: 'Testes de Software',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    // Administração (courseId: 102)
    {
      id: 1006,
      name: 'Gestão de Projetos',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1007,
      name: 'Marketing',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1008,
      name: 'Contabilidade Gerencial',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1009,
      name: 'Recursos Humanos',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1010,
      name: 'Logística',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    // Pedagogia (courseId: 103)
    {
      id: 1011,
      name: 'Didática',
      courseId: 103,
      courseName: 'Pedagogia',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1012,
      name: 'Psicologia da Educação',
      courseId: 103,
      courseName: 'Pedagogia',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1013,
      name: 'Alfabetização',
      courseId: 103,
      courseName: 'Pedagogia',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1014,
      name: 'Educação Infantil',
      courseId: 103,
      courseName: 'Pedagogia',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1015,
      name: 'Gestão Educacional',
      courseId: 103,
      courseName: 'Pedagogia',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    // Direito (courseId: 104)
    {
      id: 1016,
      name: 'Direito Penal',
      courseId: 104,
      courseName: 'Direito',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1017,
      name: 'Direito Civil',
      courseId: 104,
      courseName: 'Direito',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1018,
      name: 'Direito Constitucional',
      courseId: 104,
      courseName: 'Direito',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1019,
      name: 'Direito do Trabalho',
      courseId: 104,
      courseName: 'Direito',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    {
      id: 1020,
      name: 'Legislação',
      courseId: 104,
      courseName: 'Direito',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      businessUnitId: 1,
    },
    // Ciência da Computação (courseId: 201)
    {
      id: 1021,
      name: 'Estrutura de Dados',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1022,
      name: 'Redes de Computadores',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1023,
      name: 'Sistemas Operacionais',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1024,
      name: 'Compiladores',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1025,
      name: 'Inteligência Artificial',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    // Gestão de RH (courseId: 202)
    {
      id: 1026,
      name: 'Recrutamento e Seleção',
      courseId: 202,
      courseName: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1027,
      name: 'Treinamento e Desenvolvimento',
      courseId: 202,
      courseName: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1028,
      name: 'Gestão de Desempenho',
      courseId: 202,
      courseName: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1029,
      name: 'Legislação Trabalhista',
      courseId: 202,
      courseName: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1030,
      name: 'Clima Organizacional',
      courseId: 202,
      courseName: 'Gestão de RH',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    // Contabilidade (courseId: 203)
    {
      id: 1031,
      name: 'Contabilidade Básica',
      courseId: 203,
      courseName: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1032,
      name: 'Contabilidade Avançada',
      courseId: 203,
      courseName: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1033,
      name: 'Análise de Balanços',
      courseId: 203,
      courseName: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1034,
      name: 'Auditoria',
      courseId: 203,
      courseName: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    {
      id: 1035,
      name: 'Perícia Contábil',
      courseId: 203,
      courseName: 'Contabilidade',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      businessUnitId: 1,
    },
    // Engenharia Civil (courseId: 301)
    {
      id: 1036,
      name: 'Materiais de Construção',
      courseId: 301,
      courseName: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1037,
      name: 'Mecânica dos Solos',
      courseId: 301,
      courseName: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1038,
      name: 'Instalações Elétricas',
      courseId: 301,
      courseName: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1039,
      name: 'Hidrologia',
      courseId: 301,
      courseName: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1040,
      name: 'Estruturas de Concreto',
      courseId: 301,
      courseName: 'Engenharia Civil',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    // Psicologia (courseId: 302)
    {
      id: 1041,
      name: 'Psicologia Geral',
      courseId: 302,
      courseName: 'Psicologia',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1042,
      name: 'Psicologia do Desenvolvimento',
      courseId: 302,
      courseName: 'Psicologia',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1043,
      name: 'Psicologia Organizacional',
      courseId: 302,
      courseName: 'Psicologia',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1044,
      name: 'Psicologia Clínica',
      courseId: 302,
      courseName: 'Psicologia',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1045,
      name: 'Psicologia Educacional',
      courseId: 302,
      courseName: 'Psicologia',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    // Medicina Veterinária (courseId: 303)
    {
      id: 1046,
      name: 'Anatomia Animal',
      courseId: 303,
      courseName: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1047,
      name: 'Farmacologia',
      courseId: 303,
      courseName: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1048,
      name: 'Cirurgia Veterinária',
      courseId: 303,
      courseName: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1049,
      name: 'Clínica Médica',
      courseId: 303,
      courseName: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    {
      id: 1050,
      name: 'Patologia',
      courseId: 303,
      courseName: 'Medicina Veterinária',
      clusterId: 3,
      clusterName: 'Cluster Centro',
      businessUnitId: 2,
    },
    // Arquitetura e Urbanismo (courseId: 401)
    {
      id: 1051,
      name: 'Desenho Arquitetônico',
      courseId: 401,
      courseName: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1052,
      name: 'Historia da Arquitetura',
      courseId: 401,
      courseName: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1053,
      name: 'Urbanismo',
      courseId: 401,
      courseName: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1054,
      name: 'Paisagismo',
      courseId: 401,
      courseName: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1055,
      name: 'Conforto Ambiental',
      courseId: 401,
      courseName: 'Arquitetura e Urbanismo',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    // Design Gráfico (courseId: 402)
    {
      id: 1056,
      name: 'Design de Identidade',
      courseId: 402,
      courseName: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1057,
      name: 'Tipografia',
      courseId: 402,
      courseName: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1058,
      name: 'Ilustração Digital',
      courseId: 402,
      courseName: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1059,
      name: 'Diagramação',
      courseId: 402,
      courseName: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1060,
      name: 'Motion Graphics',
      courseId: 402,
      courseName: 'Design Gráfico',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    // Marketing Digital (courseId: 403)
    {
      id: 1061,
      name: 'Marketing Digital',
      courseId: 403,
      courseName: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1062,
      name: 'Redes Sociais',
      courseId: 403,
      courseName: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1063,
      name: 'SEO',
      courseId: 403,
      courseName: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1064,
      name: 'Google Ads',
      courseId: 403,
      courseName: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
    {
      id: 1065,
      name: 'Analytics',
      courseId: 403,
      courseName: 'Marketing Digital',
      clusterId: 4,
      clusterName: 'Cluster Oeste',
      businessUnitId: 2,
    },
  ];

  // v4: Links atualizados para usar Disciplina
  private links: PromptLink[] = [
    {
      id: 'LNK-001',
      promptId: 'PRM-001',
      promptTitle: 'Prompt Corretor Padrão',
      disciplineId: 1001,
      disciplineName: 'Algoritmos',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      activityTypeName: 'Desafio Profissional',
      createdByUserId: 'USR-001',
      createdByName: 'João Silva',
      updatedByUserId: 'USR-001',
    },
    {
      id: 'LNK-002',
      promptId: 'PRM-001',
      promptTitle: 'Prompt Corretor Padrão',
      disciplineId: 1021,
      disciplineName: 'Estrutura de Dados',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      activityTypeName: 'Desafio Profissional',
      createdByUserId: 'USR-002',
      createdByName: 'Maria Santos',
      updatedByUserId: 'USR-002',
    },
    {
      id: 'LNK-003',
      promptId: 'PRM-002',
      promptTitle: 'Prompt Resenha Crítica',
      disciplineId: 1006,
      disciplineName: 'Gestão de Projetos',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      activityTypeName: 'Resenha',
      createdByUserId: 'USR-003',
      createdByName: 'Pedro Oliveira',
      updatedByUserId: 'USR-004',
    },
  ];

  getCoursesByUnit(unitId: number): Observable<Course[]> {
    const filtered = this.courses.filter((c) => c.businessUnitId === unitId);
    return of(filtered).pipe(delay(300));
  }

  getAllCourses(): Observable<Course[]> {
    return of([...this.courses]).pipe(delay(300));
  }

  // v4: Novos métodos para Disciplina
  getAllDisciplines(): Observable<Discipline[]> {
    return of([...this.disciplines]).pipe(delay(300));
  }

  getDisciplinesByFilters(
    unitIds?: number[],
    clusterIds?: number[],
    courseIds?: number[],
  ): Observable<Discipline[]> {
    let filtered = [...this.disciplines];

    if (unitIds && unitIds.length > 0) {
      filtered = filtered.filter((d) => unitIds.includes(d.businessUnitId));
    }
    if (clusterIds && clusterIds.length > 0) {
      filtered = filtered.filter((d) => clusterIds.includes(d.clusterId));
    }
    if (courseIds && courseIds.length > 0) {
      filtered = filtered.filter((d) => courseIds.includes(d.courseId));
    }

    return of(filtered).pipe(delay(300));
  }

  getLinksByPrompt(promptId: string): Observable<PromptLink[]> {
    const filtered = this.links.filter((l) => l.promptId === promptId);
    return of(filtered).pipe(delay(200));
  }

  getAllLinks(): Observable<PromptLink[]> {
    return of([...this.links]).pipe(delay(200));
  }

  // v4: Refatorado para usar Disciplina
  linkPromptToDiscipline(
    promptId: string,
    promptTitle: string,
    disciplineId: number,
    activityTypeName: string,
  ): Observable<PromptLink> {
    // RN07: unicidade (Disciplina + Tipo de Atividade)
    const exists = this.links.find(
      (l) => l.disciplineId === disciplineId && l.activityTypeName === activityTypeName,
    );
    if (exists) {
      return throwError(
        () =>
          new Error(
            `A disciplina já possui o prompt "${exists.promptTitle}" vinculado para "${activityTypeName}". Remova ou altere o vínculo existente.`,
          ),
      );
    }

    const discipline = this.disciplines.find((d) => d.id === disciplineId);
    if (!discipline) {
      return throwError(() => new Error('Disciplina não encontrada.'));
    }

    const newLink: PromptLink = {
      id: `LNK-${String(this.links.length + 1).padStart(3, '0')}`,
      promptId,
      promptTitle,
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      courseId: discipline.courseId,
      courseName: discipline.courseName,
      clusterId: discipline.clusterId,
      clusterName: discipline.clusterName,
      activityTypeName,
      createdByUserId: 'USR-Current',
      createdByName: 'Usuário Atual',
      updatedByUserId: 'USR-Current',
    };
    this.links.push(newLink);
    return of(newLink).pipe(delay(400));
  }

  unlinkPromptFromDiscipline(linkId: string): Observable<boolean> {
    const index = this.links.findIndex((l) => l.id === linkId);
    if (index >= 0) {
      this.links.splice(index, 1);
    }
    return of(true).pipe(delay(300));
  }

  updateDisciplinePrompt(
    linkId: string,
    newPromptId: string,
    newPromptTitle: string,
  ): Observable<PromptLink> {
    const index = this.links.findIndex((l) => l.id === linkId);
    if (index >= 0) {
      this.links[index] = {
        ...this.links[index],
        promptId: newPromptId,
        promptTitle: newPromptTitle,
      };
    }
    return of(this.links[index]).pipe(delay(400));
  }

  // v4: Nova implementação com lógica de skipping
  linkPromptToDisciplines(
    promptId: string,
    promptTitle: string,
    disciplineIds: number[],
    activityTypeName: string,
  ): Observable<{ created: PromptLink[]; skipped: number }> {
    const createdLinks: PromptLink[] = [];
    let skipped = 0;

    for (const disciplineId of disciplineIds) {
      const exists = this.links.find(
        (l) => l.disciplineId === disciplineId && l.activityTypeName === activityTypeName,
      );

      if (exists) {
        skipped++;
        continue;
      }

      const discipline = this.disciplines.find((d) => d.id === disciplineId);
      if (!discipline) continue;

      const newLink: PromptLink = {
        id: `LNK-${String(this.links.length + 1).padStart(3, '0')}`,
        promptId,
        promptTitle,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        courseId: discipline.courseId,
        courseName: discipline.courseName,
        clusterId: discipline.clusterId,
        clusterName: discipline.clusterName,
        activityTypeName,
        createdByUserId: 'USR-Current',
        createdByName: 'Usuário Atual',
        updatedByUserId: 'USR-Current',
      };
      this.links.push(newLink);
      createdLinks.push(newLink);
    }

    return of({ created: createdLinks, skipped }).pipe(delay(400));
  }

  // Compatibility stubs for v3 component (to be replaced in Phase D)
  linkPromptToCourse(
    promptId: string,
    promptTitle: string,
    courseId: number,
    activityTypeName: string,
  ): Observable<PromptLink> {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course) return throwError(() => new Error('Course not found'));

    // Find a discipline for this course (first one)
    const discipline = this.disciplines.find((d) => d.courseId === courseId);
    if (!discipline) return throwError(() => new Error('Discipline not found for course'));

    return this.linkPromptToDiscipline(promptId, promptTitle, discipline.id, activityTypeName);
  }

  linkPromptToCourses(
    promptId: string,
    promptTitle: string,
    courseIds: number[],
    activityTypeName: string,
  ): Observable<PromptLink[]> {
    const allDisciplineIds: number[] = [];
    courseIds.forEach((cid) => {
      const discs = this.disciplines.filter((d) => d.courseId === cid).map((d) => d.id);
      allDisciplineIds.push(...discs);
    });

    return this.linkPromptToDisciplines(
      promptId,
      promptTitle,
      allDisciplineIds,
      activityTypeName,
    ).pipe(map((result) => result.created));
  }

  unlinkPromptFromCourse(linkId: string): Observable<boolean> {
    return this.unlinkPromptFromDiscipline(linkId);
  }
}
