import "reflect-metadata";

enum MetadataKeys {
  METHOD = "METHOD",
  BIND = "BIND",
}

class StickModel {
  constructor(public id: number) {}
}
class BarModel {
  constructor(public id: number) {}
}

const RegisterBind: MethodDecorator = (
  target: any,
  methodKey: string | symbol,
  desc: PropertyDescriptor
) => {
  const originalMethod = desc.value;

  const binds = Reflect.getMetadata(MetadataKeys.METHOD, target, methodKey);

  desc.value = async function (...args: any[]) {
    for (let bind of binds) {
      const { paramIndex, model } = bind;
      const resolver = Reflect.getMetadata(MetadataKeys.METHOD, model);
      args[paramIndex] = await resolver(args[paramIndex]);
    }

    return originalMethod.apply(this, args);
  };

  return desc;
};

const Bind = (model: Function): ParameterDecorator => (
  target: any,
  methodKey: string | symbol,
  paramIndex: number
): void => {
  const binds =
    Reflect.getMetadata(MetadataKeys.METHOD, target, methodKey) || [];
  binds.push({ paramIndex, model });
  Reflect.defineMetadata(MetadataKeys.METHOD, binds, target, methodKey);
};

const Resolver = (model: Function): MethodDecorator => (
  target: any,
  methodKey: string | symbol,
  desc: PropertyDescriptor
): void => {
  // console.log("StickMethodD:", target, methodKey, desc.value);
  Reflect.defineMetadata(MetadataKeys.METHOD, target[methodKey], model);
};

class StickService {
  @Resolver(StickModel)
  async rotate(id: number) {
    console.log("Resolving Stick");
    return new StickModel(id);
  }
}

class BarService {
  @Resolver(BarModel)
  async dive(id: number) {
    console.log("Resolving Bar");
    return new StickModel(id);
  }
}

class Controller {
  constructor() {}

  @RegisterBind
  async get(
    @Bind(StickModel) stick: StickModel,
    @Bind(BarModel) bar: BarModel
  ) {
    console.log(stick);
    console.log(bar);
    return stick;
  }
}

const main = () => {
  const controller = new Controller();
  controller.get(21 as any, 23 as any).then(() => {});
};

main();
