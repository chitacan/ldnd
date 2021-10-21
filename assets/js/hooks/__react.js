import { createElement } from 'react';
import { hydrate, render, unmountComponentAtNode} from 'react-dom';
import containers from '../containers';

const hook = {
  mounted() {
    this.Component = containers[this.el.id];
    hydrate(createElement(this.Component, {socket: this}), this.el);
  },
  destroed() {
    unmountComponentAtNode(this.el);
  }
};

export default hook;