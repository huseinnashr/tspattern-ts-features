import "reflect-metadata";

enum MetadataKeys {
  METHOD = "METHOD",
  BIND = "BIND",
}

const planeClassD: ClassDecorator = (constructor: Function) => {
  // console.log("Class:", constructor);
};

const planePropertyD: PropertyDecorator = (
  target: any,
  key: string | symbol
): void => {
  // console.log("Property: ", "Key: ", key);
};

const planeMethodD: MethodDecorator = (
  target: any,
  key: string | symbol,
  desc: PropertyDescriptor
): void => {
  // console.log("Method: ", "Key: ", key);
};

const planeParamD: ParameterDecorator = (
  target: any,
  key: string | symbol,
  index: number
): void => {
  // console.log("Parameter:", target, key, index);
};

@planeClassD
class Plane {
  @planePropertyD
  color: string = "red";

  @planePropertyD
  stick: StickService;

  constructor(@planeParamD private size: number) {
    this.stick = new StickService();
  }

  @planeMethodD
  pilot(@planeParamD speed: string, generateWake: boolean): void {}
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

  desc.value = function (...args: any[]) {
    for (let bind of binds) {
      const { paramIndex, model } = bind;
      const resolver = Reflect.getMetadata(MetadataKeys.METHOD, model);
      args[paramIndex] = resolver(args[paramIndex]);
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
  rotate(id: number) {
    console.log("Resolving Stick");
    return new StickModel(id);
  }
}

class BarService {
  @Resolver(BarModel)
  dive(id: number) {
    console.log("Resolving Bar");
    return new StickModel(id);
  }
}

class Controller {
  constructor() {}

  @RegisterBind
  get(@Bind(StickModel) stick: StickModel, @Bind(BarModel) bar: BarModel) {
    console.log(stick);
    console.log(bar);
    return stick;
  }
}

new Controller().get(21 as any, 23 as any);
