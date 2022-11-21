const React = require('react');
const Layout = require('./Layout');

module.exports = function Beaver() {
  return (
    <Layout canvas="true">
      <link rel="stylesheet" href="/css/beaver.css" />
      <div className="fill-block" />
      <div className="project-title">
        Elbrus
        <br />
        binnary battle
      </div>
      <div className="beaver">
        <div className="beaver-head">
          <div className="cheek left" />
          <div className="cheek right" />
          <div className="tooth left" />
          <div className="tooth right" />
          <div className="nose" />
          <div className="eye left">
            <div className="pupil" />
          </div>
          <div className="eye right">
            <div className="pupil" />
          </div>
          <div className="eyebrow left" />
          <div className="eyebrow right" />
        </div>
        <div className="ear left" />
        <div className="in-ear left" />
        <div className="ear right" />
        <div className="in-ear right" />
        <div className="mustache left-top" />
        <div className="mustache left-center" />
        <div className="mustache left-bottom" />
        <div className="mustache right-top" />
        <div className="mustache right-center" />
        <div className="mustache right-bottom" />
        <div className="tail" />
        <div className="beaver-body">
          <div className="arm left" />
          <div className="arm right" />
          <div className="foot left" />
          <div className="foot right" />
        </div>
        <div className="elbrus">E</div>
        <div className="chain" />
        <div className="tail-text top">&quot;БОБРЫ&quot;</div>
        <div className="tail-text bottom">2022 // ОНЛАЙН</div>
      </div>
      <div className="fill-block" />
    </Layout>
  );
};
