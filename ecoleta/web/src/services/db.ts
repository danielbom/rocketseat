import axios from "axios";
import { Item, Point } from "../types/db";

const api = axios.create({ baseURL: "http://192.168.1.8:3333" });

export const db = {
  items: {
    index() {
      return api.get<Item[]>("items");
    },
  },
  points: {
    store(body: { point: Omit<Point, 'id' | 'image'>; items: number[] }) {
      return api.post<Point>("points", body);
    },
    index(params: { uf: string; city: string; items: number[] }) {
      return api.get("points", {
        params: { ...params, items: params.items.join(",") },
      });
    },
    show(id: number) {
      return api.get<{ point: Point, items: Pick<Item, "title">[] }>(`points/${id}`);
    },
    image(id: number, image: File) {
      const data = new FormData();
      data.append("image", image);

      return api.post(`points/${id}/image`, data);
    }
  },
};
