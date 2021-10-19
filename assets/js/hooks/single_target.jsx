import { render } from 'react-dom';

const Header = () => <div>root</div>

const hook = {
  mounted() {
    render(<Header/>, this.el)
  }
};

export default hook;

