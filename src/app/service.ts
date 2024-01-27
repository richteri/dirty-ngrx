import { Injectable } from '@angular/core';
import { Parent, Child } from './model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private idSeq = 1000;

  parents: Parent[] = [
    {
      id: 1,
      name: 'P1',
      children: [
        { id: 1, parentId: 1, name: 'P1.C1' },
        { id: 2, parentId: 1, name: 'P1.C2' },
        { id: 3, parentId: 1, name: 'P1.C3' },
      ],
    },
    {
      id: 2,
      name: 'P2',
      children: [
        { id: 4, parentId: 2, name: 'P2.C1' },
        { id: 5, parentId: 2, name: 'P2.C2' },
        { id: 6, parentId: 2, name: 'P2.C3' },
      ],
    },
    {
      id: 3,
      name: 'P3',
      children: [
        { id: 7, parentId: 3, name: 'P3.C1' },
        { id: 8, parentId: 3, name: 'P3.C2' },
        { id: 9, parentId: 3, name: 'P3.C3' },
      ],
    },
  ];

  /**
   * GET /parents/{parentId}
   */
  findParent(parentId: number): Observable<Parent> {
    return res(
      `Service.findParent(${parentId})`,
      this.parents.find((parent) => parent.id === parentId),
    );
  }

  /**
   * GET /parents
   */
  findParents(): Observable<Parent[]> {
    return res('Service.findParent()', this.parents);
  }

  /**
   * POST /parents
   */
  addParent(name: string): Observable<Parent> {
    const parent: Parent = { id: ++this.idSeq, name, children: [] };
    this.parents.push(parent);

    return res(`Service.addParent(${name})`, parent);
  }

  /**
   * DELETE /parents/{parentId}
   */
  deleteParent(parentId: number): Observable<void> {
    const index = this.parents.findIndex((parent) => (parent.id === parentId));
    this.parents.splice(index, 1);

    return res(`Service.deleteParent(${parentId})`);
  }

  /**
   * PUT /parents/{parentId}
   */
  updateParent(parentId: number, name: string): Observable<Parent> {
    const index = this.parents.findIndex((parent) => (parent.id === parentId));
    const parent = this.parents[index];
    parent.name = name;

    return res(`Service.updateParent(${parentId}, ${name})`, parent);
  }

  /**
   * GET /parents/{parentId}/children/{childId}
   */
  findChild(parentId: number, childId: number): Observable<Child> {
    const child = this.parents
      .find(({ id }) => parentId === id)
      ?.children.find((child) => child.id === childId);
    if (child) {
      return res(`Service.findChild(${childId}): OK`, child);
    }

    return res(`Service.findChild(${childId}): Not Found`);
  }

  /**
   * POST /parents/{parentId}/children
   */
  addChild(parentId: number, name: string): Observable<Child> {
    const parent = this.parents.find(({ id }) => parentId === id)!;
    const child: Child = { id: ++this.idSeq, parentId, name };
    parent.children.push(child);

    return res(`Service.addChild(${parentId}, ${name})`, child);
  }

  /**
   * DELETE /parents/${parentId}/children/{childId}
   */
  deleteChild(parentId: number, childId: number): Observable<void> {
    const parent = this.parents.find(({ id }) => parentId === id);
    if (parent) {
      const index = parent.children.findIndex((child) => (child.id === childId));

      if (index >= 0) {
        parent.children.splice(index, 1);

        return res(`Service.deleteChild(${childId}): OK`);
      }
    }

    return res(`Service.deleteChild(${parentId}, ${childId}): Not Found`);
  }

  /**
   * PUT /parents/${parentId}/children/{childId}
   */
  updateChild(
    parentId: number,
    childId: number,
    name: string,
  ): Observable<Child> {
    const parent = this.parents.find((parent) => parent.id === parentId);
    if (parent) {
      const index = parent.children.findIndex((child) => (child.id === childId));

      if (index >= 0) {
        const child = { ...parent.children[index], name };
        parent.children.splice(index, 1, child);

        return res(
          `Service.updateChild(${parentId}, ${childId}, ${name}): OK`,
          child,
        );
      }
    }

    return res(
      `Service.updateChild(${parentId}, ${childId}, ${name}): Not Found`,
    );
  }
}

export const res = <T>(debugMessage: string, o?: T): Observable<T> => {
  if (o) {
    const clone = JSON.parse(JSON.stringify(o));
    console.debug(debugMessage, clone);
    return of(clone);
  }

  console.debug(debugMessage, o);

  return of(undefined as T);
};
