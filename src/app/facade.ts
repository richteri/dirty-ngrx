import { Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { Parent } from './model';
import { exhaustMap, Observable } from 'rxjs';
import { Service } from './service';

export interface State {
  parents: Parent[];
}

export const initialState: State = {
  parents: [],
};

@Injectable()
export class Facade extends ComponentStore<State> implements OnStateInit {
  constructor(private service: Service) {
    super(initialState);
  }

  readonly parents$ = this.select((state) => state.parents);

  readonly loadParents = this.effect((param$) => {
    return param$.pipe(
      exhaustMap(() =>
        this.service.findParents().pipe(
          tapResponse(
            (parents) => this.patchState({ parents }),
            (error) => console.error(error),
          ),
        ),
      ),
    );
  });

  readonly addParent = this.effect((param$: Observable<{ name: string }>) => {
    return param$.pipe(
      exhaustMap(({ name }) =>
        this.service.addParent(name).pipe(
          tapResponse(
            // preserve filter & pagination
            () => this.loadParents(),
            (error) => console.error(error),
          ),
        ),
      ),
    );
  });

  readonly deleteParent = this.effect(
    (param$: Observable<{ parentId: number }>) => {
      return param$.pipe(
        exhaustMap(({ parentId }) =>
          this.service.deleteParent(parentId).pipe(
            tapResponse(
              // preserve filter & pagination
              () => this.loadParents(),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  readonly updateParent = this.effect(
    (param$: Observable<{ parentId: number; name: string }>) => {
      return param$.pipe(
        exhaustMap(({ parentId, name }) =>
          this.service.updateParent(parentId, name).pipe(
            tapResponse(
              (parent) =>
                this.patchState((state) => {
                  const index = state.parents.findIndex(
                    (p) => p.id === parentId,
                  );
                  state.parents.splice(index, 1, parent);

                  return state;
                }),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  readonly loadParent = this.effect(
    (param$: Observable<{ parentId: number }>) => {
      return param$.pipe(
        exhaustMap(({ parentId }) =>
          this.service.findParent(parentId).pipe(
            tapResponse(
              (parent) =>
                this.patchState((state) => {
                  const index = state.parents.findIndex(
                    (p) => p.id === parentId,
                  );
                  parent.open = true;
                  state.parents.splice(index, 1, parent);

                  return state;
                }),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  readonly addChild = this.effect(
    (param$: Observable<{ parentId: number; name: string }>) => {
      return param$.pipe(
        exhaustMap(({ parentId, name }) =>
          this.service.addChild(parentId, name).pipe(
            tapResponse(
              () => this.loadParent({ parentId }),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  readonly deleteChild = this.effect(
    (param$: Observable<{ parentId: number; childId: number }>) => {
      return param$.pipe(
        exhaustMap(({ parentId, childId }) =>
          this.service.deleteChild(parentId, childId).pipe(
            tapResponse(
              () => this.loadParent({ parentId }),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  readonly updateChild = this.effect(
    (
      param$: Observable<{ parentId: number; childId: number; name: string }>,
    ) => {
      return param$.pipe(
        exhaustMap(({ parentId, childId, name }) =>
          this.service.updateChild(parentId, childId, name).pipe(
            tapResponse(
              () => this.loadParent({ parentId }),
              (error) => console.error(error),
            ),
          ),
        ),
      );
    },
  );

  ngrxOnStateInit() {
    console.debug('Facade.ngrxOnStateInit()');
    this.loadParents();
  }
}
