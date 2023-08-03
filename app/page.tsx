const callApplicationServerThroughProxy = async () => {
  const path = `${process.env.REVERSE_PROXY_HOST}/distributed-information-node?sleep=1000`;

  return fetch(path, {
    cache: "no-cache",
  }).then((res) => res.json());
};

console.log(process.env.APPLICATION_SERVER_HOST);
console.log(process.env.REVERSE_PROXY_HOST);

const Home = async () => {
  await callApplicationServerThroughProxy();

  return (
    <>
      <span>HERE I AM!!</span>
      <span>ROCK YOU LIKE A HURRICANEEE!!!</span>
    </>
  );
};

export default Home;
