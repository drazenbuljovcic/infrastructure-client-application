import { SpanKind } from "@opentelemetry/exporter-zipkin/build/src/types";
import serverTracer from "./_utils/telemetry/server.tracer";
import { trace, context } from "@opentelemetry/api";

const callApplicationServerThroughProxy = async () => {
  // const activeSpanContext = context.active();
  // const span = trace.getSpan(activeSpanContext);
  const path = `${process.env.REVERSE_PROXY_HOST}/?sleep=1000`;
  // span?.setAttribute("path", path);
  serverTracer.startActiveSpan(path, { attributes: { path } }, (span) => {
    try {
      fetch(path, {
        cache: "no-cache",
      }).then((res) => res.json());
    } catch (e) {
      console.error(e);
    } finally {
      span?.end();
    }
  });
};

const Home = async () => {
  let didMyRequestGoThrough = false;
  try {
    await callApplicationServerThroughProxy();
    didMyRequestGoThrough = true;
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <span>HERE I AM!!</span>
      <span>ROCK YOU LIKE A HURRICANEEE!!!</span>

      <p>Did my request go through: {String(didMyRequestGoThrough)}</p>
    </>
  );
};

export default Home;
