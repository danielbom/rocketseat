export interface City {
  id: number;
  nome: string;
  microregiao: {
    id: number;
    name: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: string;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        }
      }
    }
  }
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}
