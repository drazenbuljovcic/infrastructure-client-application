import serverTracer from "./_utils/telemetry/server.tracer";
import {
  trace,
  context,
  propagation,
  SpanStatusCode,
  SpanKind,
} from "@opentelemetry/api";

const callApplicationServerThroughProxy = async () => {
  const path = "/distributed-information-node";
  const url = `${process.env.REVERSE_PROXY_HOST}${path}?sleep=1000`;

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
  console.log({ headers });

  try {
    const data = await fetch(url, {
      cache: "no-cache",
      headers,
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        throw e;
      });

    span.setStatus({
      code: SpanStatusCode.OK,
    });
  } catch (e) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
    });
    console.error(e);
    throw e;
  } finally {
    span?.end();
  }
};

const Home = async () => {
  let didMyRequestGoThrough = false;
  try {
    let didCatch = false;
    await callApplicationServerThroughProxy().catch((e) => {
      didMyRequestGoThrough = false;
      didCatch = true;
    });

    if (!didCatch) {
      didMyRequestGoThrough = true;
    }
  } catch (e) {
    console.error(e);
  }

  console.log({ didMyRequestGoThrough });
  return (
    <>
      <span>HERE I AM!!</span>
      <span>ROCK YOU LIKE A HURRICANEEE!!!</span>

      <p>Did my request go through: {String(didMyRequestGoThrough)}</p>
    </>
  );
};

export default Home;
