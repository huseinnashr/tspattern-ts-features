import "reflect-metadata";

const plane = {
  color: "red",
};

Reflect.defineMetadata("note", "hi there", plane);
Reflect.defineMetadata("height", 10, plane);
Reflect.defineMetadata("note", "red", plane, "color");

const note = Reflect.getMetadata("note", plane);
const height = Reflect.getMetadata("height", plane);
const note2 = Reflect.getMetadata("note", plane, "color");

console.log(plane);
console.log(note, height, note2);
