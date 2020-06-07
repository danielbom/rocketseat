import { GraphQLObjectType, GraphQLList } from "graphql";

import { ItemFields } from "./item-fields";
import { PointFields } from "./point-fields";

type DeferResult<T = any> = () => T;
function defer<T>(this: any, fn: () => T): DeferResult<T> {
  let ref: T | null = null;
  return () => {
    if (ref) return ref;
    ref = fn();
    return ref;
  };
}

const deferPointType: DeferResult = defer(
  () =>
    new GraphQLObjectType({
      name: "Point",
      fields: {
        ...PointFields,
        items: { type: new GraphQLList(deferItemType()) },
      },
    })
);
const deferItemType = defer(
  () =>
    new GraphQLObjectType({
      name: "Item",
      fields: () => ({
        ...ItemFields,
        points: { type: new GraphQLList(deferPointType()) },
      }),
    })
);

export const PointType = deferPointType();
export const ItemType = deferItemType();
