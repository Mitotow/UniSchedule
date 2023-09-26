export default interface XMLData {
    $: {
      id: string;
      type: string;
      typeid: string;
      order: string;
      dept: string;
      link: string;
    };
    dept: string[];
    name: string[];
    initial: any[]; // Vous pouvez ajuster le type si vous connaissez la structure des données
    link: any[]; // Vous pouvez ajuster le type si vous connaissez la structure des données
}