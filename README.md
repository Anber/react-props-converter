# React props converter

```jsx harmony
// component.js
import React from 'react';
import createConverter from 'react-props-converter';
 
class Component extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
  };
 
  render() {
    return (<div>{this.props.value}</div>);
  }
}
 
const converter = createConverter(props => ({ value: parseInt(props.value, 16) })); 
export default converter(Component); 
```

```jsx harmony
<Wrapped value="FF" /> // will be rendered as <div>255</div>
```
