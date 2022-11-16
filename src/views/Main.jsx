const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ user }) {
  return (
    <Layout user={user}>

      <div style={{ border: '1px solid black', width: '500px', height: '500px' }} />

    </Layout>
  );
};
