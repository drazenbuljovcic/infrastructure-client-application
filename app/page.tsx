const callApplicationServerThroughProxy = async () => {
  const path = `${process.env.REVERSE_PROXY_HOST}/distributed-information-node?sleep=1000`;

  return fetch(path, {
    cache: "no-cache",
  }).then((res) => res.json());
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
