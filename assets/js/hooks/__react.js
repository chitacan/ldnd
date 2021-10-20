import {createElement} from 'react';
import { hydrate } from 'react-dom';
import containers from '../containers';

const hook = {
  mounted() {
    const component = containers[this.el.id];
    hydrate(createElement(component), this.el);
  },
};

export default hook;