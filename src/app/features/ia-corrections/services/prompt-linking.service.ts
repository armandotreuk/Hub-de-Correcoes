import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PromptLink, Course } from '../models/ia-corrections.models';

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

  private links: PromptLink[] = [
    {
      id: 'LNK-001',
      promptId: 'PRM-001',
      promptTitle: 'Prompt Corretor Padrão',
      courseId: 101,
      courseName: 'Engenharia de Software',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      activityTypeName: 'Desafio Profissional',
    },
    {
      id: 'LNK-002',
      promptId: 'PRM-001',
      promptTitle: 'Prompt Corretor Padrão',
      courseId: 201,
      courseName: 'Ciência da Computação',
      clusterId: 2,
      clusterName: 'Cluster Norte',
      activityTypeName: 'Desafio Profissional',
    },
    {
      id: 'LNK-003',
      promptId: 'PRM-002',
      promptTitle: 'Prompt Resenha Crítica',
      courseId: 102,
      courseName: 'Administração',
      clusterId: 1,
      clusterName: 'Cluster Sul',
      activityTypeName: 'Resenha',
    },
  ];

  getCoursesByUnit(unitId: number): Observable<Course[]> {
    const filtered = this.courses.filter((c) => c.businessUnitId === unitId);
    return of(filtered).pipe(delay(300));
  }

  getAllCourses(): Observable<Course[]> {
    return of([...this.courses]).pipe(delay(300));
  }

  getLinksByPrompt(promptId: string): Observable<PromptLink[]> {
    const filtered = this.links.filter((l) => l.promptId === promptId);
    return of(filtered).pipe(delay(200));
  }

  getAllLinks(): Observable<PromptLink[]> {
    return of([...this.links]).pipe(delay(200));
  }

  linkPromptToCourse(
    promptId: string,
    promptTitle: string,
    courseId: number,
    activityTypeName: string,
  ): Observable<PromptLink> {
    // Validação RN07: unicidade (Curso + Tipo de Atividade)
    const exists = this.links.find(
      (l) => l.courseId === courseId && l.activityTypeName === activityTypeName,
    );
    if (exists) {
      return throwError(
        () =>
          new Error(
            `O curso já possui o prompt "${exists.promptTitle}" vinculado para "${activityTypeName}". Remova ou altere o vínculo existente.`,
          ),
      );
    }

    const course = this.courses.find((c) => c.id === courseId);
    if (!course) {
      return throwError(() => new Error('Curso não encontrado.'));
    }

    const newLink: PromptLink = {
      id: `LNK-${String(this.links.length + 1).padStart(3, '0')}`,
      promptId,
      promptTitle,
      courseId,
      courseName: course.name,
      clusterId: course.clusterId,
      clusterName: course.clusterName,
      activityTypeName,
    };
    this.links.push(newLink);
    return of(newLink).pipe(delay(400));
  }

  unlinkPromptFromCourse(linkId: string): Observable<boolean> {
    const index = this.links.findIndex((l) => l.id === linkId);
    if (index >= 0) {
      this.links.splice(index, 1);
    }
    return of(true).pipe(delay(300));
  }

  updateCoursePrompt(
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

  linkPromptToCourses(
    promptId: string,
    promptTitle: string,
    courseIds: number[],
    activityTypeName: string,
  ): Observable<PromptLink[]> {
    const createdLinks: PromptLink[] = [];
    const errors: string[] = [];

    for (const courseId of courseIds) {
      const exists = this.links.find(
        (l) => l.courseId === courseId && l.activityTypeName === activityTypeName,
      );
      if (exists) {
        errors.push(`Curso ${courseId} já possui vínculo para "${activityTypeName}"`);
        continue;
      }

      const course = this.courses.find((c) => c.id === courseId);
      if (!course) {
        errors.push(`Curso ${courseId} não encontrado`);
        continue;
      }

      const newLink: PromptLink = {
        id: `LNK-${String(this.links.length + 1).padStart(3, '0')}`,
        promptId,
        promptTitle,
        courseId,
        courseName: course.name,
        clusterId: course.clusterId,
        clusterName: course.clusterName,
        activityTypeName,
      };
      this.links.push(newLink);
      createdLinks.push(newLink);
    }

    if (errors.length > 0 && createdLinks.length === 0) {
      return throwError(() => new Error(errors.join('; ')));
    }

    return of(createdLinks).pipe(delay(400));
  }
}
