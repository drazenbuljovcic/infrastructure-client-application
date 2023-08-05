import serverTracer from "./_utils/telemetry/server.tracer";
import {
  trace,
  context,
  propagation,
  SpanStatusCode,
  SpanKind,
} from "@opentelemetry/api";

const callApplicationServerThroughProxy = async () => {
  const path = `${process.env.REVERSE_PROXY_HOST}/?sleep=1000`;

  const parentContext = context.active();
  const span = serverTracer.startSpan(
    `HTTP ${path}`,
    {
      kind: SpanKind.SERVER,
    },
    parentContext
  );
  const requestContext = trace.setSpan(parentContext, span);
  const headers = {};
  propagation.inject(requestContext, headers);

  try {
    await fetch(path, {
      cache: "no-cache",
      headers,
    }).then((res) => res.json());

    span.setStatus({
      code: SpanStatusCode.OK,
    });
  } catch (e) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
    });
    console.error(e);
  } finally {
    span?.end();
  }
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
