import { DocumentBuilder } from "@nestjs/swagger";

export default function makeSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('WebWisp')
    .setDescription('A web agent for automatic end-to-end testing of websites.')
    .setVersion('1.0')
    .build()
}