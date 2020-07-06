const planeClassD: ClassDecorator = (constructor: Function) => {
  console.log("Class:", constructor);
};

const planePropertyD: PropertyDecorator = (
  target: any,
  key: string | symbol
): void => {
  console.log("Property: ", "Key: ", key);
};

const planeMethodD: MethodDecorator = (
  target: any,
  key: string | symbol,
  desc: PropertyDescriptor
): void => {
  console.log("Method: ", "Key: ", key);
};

const planeParamD: ParameterDecorator = (
  target: any,
  key: string | symbol,
  index: number
): void => {
  console.log("Parameter:", target, key, index);
};

@planeClassD
class Plane {
  @planePropertyD
  color: string = "red";

  @planePropertyD
  stick: Stick;

  constructor(@parameterDecorator private size: number) {
    this.stick = new Stick();
  }

  @planeMethodD
  pilot(@parameterDecorator speed: string, generateWake: boolean): void {}
}

const StickMethodD: MethodDecorator = (
  target: any,
  methodKey: string | symbol,
  desc: PropertyDescriptor
): void => {};

class Stick {
  @StickMethodD
  rotate() {}
}
