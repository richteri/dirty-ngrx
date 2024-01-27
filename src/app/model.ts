export interface Parent {
  id: number;
  name: string;
  children: Child[];

  open?: boolean;
}

export interface Child {
  id: number;
  parentId: number;
  name: string;
}
