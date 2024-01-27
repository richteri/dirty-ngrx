import { Component } from '@angular/core';
import { Facade } from './facade';
import { provideComponentStore } from '@ngrx/component-store';
import { Child, Parent } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [provideComponentStore(Facade)],
})
export class AppComponent {
  parents$ = this.facade.parents$;

  constructor(private facade: Facade) {}

  editChild(child: Child) {
    const name = prompt(`Edit ${child.name}`, child.name);
    if (name !== null) {
      this.facade.updateChild({
        parentId: child.parentId,
        childId: child.id,
        name,
      });
    }
  }

  deleteChild(child: Child) {
    if (confirm(`Delete ${child.name}?`)) {
      this.facade.deleteChild({ parentId: child.parentId, childId: child.id });
    }
  }

  editParent(parent: Parent) {
    const name = prompt(`Edit ${parent.name}`, parent.name);
    if (name !== null) {
      this.facade.updateParent({ parentId: parent.id, name });
    }
  }

  deleteParent(parent: Parent) {
    if (confirm(`Delete ${parent.name}?`)) {
      this.facade.deleteParent({ parentId: parent.id });
    }
  }

  addChild(parent: Parent) {
    const name = prompt(`Add Child to ${parent.name}`);
    if (name !== null) {
      this.facade.addChild({ parentId: parent.id, name });
    }
  }
}
