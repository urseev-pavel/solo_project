const React = require('react');
const Layout = require('./Layout');

module.exports = function AntiStress({ user }) {
  return (
    <Layout user={user}>
      <script defer src="/js/antistress.js" />
      <link rel="stylesheet" href="/css/antistress.css" />
      <canvas id="canvas" />
      Elbrus bootcamp
    </Layout>
  );
};
