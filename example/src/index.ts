// import initComponents from 'muban-core/lib/utils/initComponents';
import DummyFoo from './component/block/DummyFoo/DummyFoo';
import App from './App';
import { registerComponent } from 'muban-core';
import initComponents from 'muban-core/lib/utils/initComponents';

const componentList = [
  App,
  DummyFoo,
];

const render = () => {
  const div = document.getElementById('app');

  componentList.forEach((blockConstructor) => {
    registerComponent(blockConstructor);
  });

  initComponents(div);
};

document.addEventListener('DOMContentLoaded', () => {
  render();
});
