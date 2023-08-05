import { trace, context } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import { CollectorTraceExporter } from "@opentelemetry/exporter-collector";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { Resource } from "@opentelemetry/resources";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";

import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const provider = new NodeTracerProvider();
// {
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]:
//       process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME!,
//   }),
// }

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(
  new BatchSpanProcessor(
    // https://github.com/MetinSeylan/Nestjs-OpenTelemetry/issues/42
    // @ts-expect-error
    new ZipkinExporter({
      url: `${process.env.NEXT_PUBLIC_OTEL_API_HOST}/api/v2/spans`,
      serviceName: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME,
    })
  )
);
registerInstrumentations({
  // instrumentations: [new HttpInstrumentation()],
});

provider.register();

const serverTracer = trace.getTracer(process.env.OTEL_SERVICE_NAME!);
// serverTracer.startSpan("ROOT", {}, context.ROOT_CONTEXT);

export default serverTracer;
