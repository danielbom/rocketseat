import axios from "axios";
import { State, City } from "../types/ibge";

const api = axios.create({ baseURL: "https://servicodados.ibge.gov.br" });

export const ibge = {
  states() {
    return api.get<State[]>("api/v1/localidades/estados");
  },
  cities(uf: string) {
    return api.get<City[]>(`api/v1/localidades/estados/${uf}/municipios`);
  },
};
